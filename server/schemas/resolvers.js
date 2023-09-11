const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
// parent: This is if we used nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed 
// the nested resolver function. We won't need this throughout the project, but we need to include it as the first argument.

// args: This is an object of all of the values passed into a query or mutation request as parameters. In our case, we destructure the username 
// parameter out to be used.

// context: This will come into play later. If we were to need the same data to be accessible by all resolvers, such as a logged-in user's 
// status or API access token, this data will come through this context parameter as an object.

// info: This will contain extra information about an operation's current state. This isn't used as frequently, but it can be implemented 
// for more advanced uses.


const resolvers = {
    Query: {

      // Here, we pass in the parent as more of a placeholder parameter. It won't 
      // be used, but we need something in that first parameter's spot so we can 
      // access the username argument from the second parameter. We use a ternary 
      // operator to check if username exists. If it does, we set params to an object 
      // with a username key set to that value. If it doesn't, we simply return an empty object.
      thoughts: async (parent, { username }) => {

        const params = username ? { username } : {};
        // we will perform a .find() method on the Thought model to retrieve all thoughts
        // We're also returning the thought data in descending order, as can be seen in the .sort() method that we chained onto it
        return Thought.find(params).sort({ createdAt: -1 });
      },

      thought: async (parent, { _id }) => {
        return Thought.findOne({ _id });
      },

      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends');
      
          return userData;
        }
      
        throw new AuthenticationError('Not logged in');
      },

      // With these query resolvers, we can now look up either all users or a single user by their username value. 
      // Both of them will omit the Mongoose-specific __v property and the user's password information, which doesn't 
      // ever have to return anyway.
            // get all users
      users: async () => {
        return User.find()
          .select('-__v -password')
          .populate('friends')
          .populate('thoughts');
      },
      // get a user by username
      user: async (parent, { username }) => {
        return User.findOne({ username })
          .select('-__v -password')
          .populate('friends')
          .populate('thoughts');
      },

      // This query will look for a user with the specified username and return true or false if that user is a friend of the logged-in user.
      isFriend: async (parent, { username }, context) => {
        if (context.user) {
        const loggedInUser = await User.findOne({ _id: context.user._id })
        const userToCheck = await User.findOne ({ username: username })
        if (loggedInUser.friends.includes(userToCheck._id)) {
          return true
        } else {
          return false
        }
      }
    },
    },

    Mutation: {
      // Here, the Mongoose User model creates a new user in the database with whatever is passed in as the args.
      addUser: async (parent, args) => {
        const user = await User.create(args);

        const token = signToken(user);

        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        const correctPw = await user.isCorrectPassword(password);
      
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        const token = signToken(user);
        return { token, user };
      },
      addThought: async (parent, args, context) => {
        if (context.user) {
          const thought = await Thought.create({ ...args, username: context.user.username });
      
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { thoughts: thought._id } },
            { new: true }
          );
      
          return thought;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
      // Reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator. Because you're 
      // updating an existing thought, the client will need to provide the corresponding thoughtId. Be sure to copy 
      // the _id property from one of the test thoughts you created.
      addReaction: async (parent, { thoughtId, reactionBody }, context) => {
        if (context.user) {
          const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $push: { reactions: { reactionBody, username: context.user.username } } },
            { new: true, runValidators: true }
          );
      
          return updatedThought;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
      // This mutation will look for an incoming friendId and add that to the current user's friends array. A user can't be 
      // friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent 
      // duplicate entries.
      addFriend: async (parent, { friendId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { friends: friendId } },
            { new: true }
          ).populate('friends');
      
          return updatedUser;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
      // This mutation will look for an incoming friendId and remove that from the current user's friends array.
      removeFriend: async (parent, { friendId }, context) => {

            if (context.user) {
         const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friends: friendId } },
            { new: true }
          ).populate('friends');

          return updatedUser;
        }
      },

      // This mutation will look for an incoming thoughtId and remove that from the current user's thoughts array.
      removeThought: async (parent, { thoughtId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { thoughts: thoughtId } },
              { new: true }
            );

            
        
            return updatedUser;
        }
      },

    }
    
  };
  
  module.exports = resolvers;