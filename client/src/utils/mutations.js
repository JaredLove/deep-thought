import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;



export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;

export const REMOVE_THOUGHT = gql`
  mutation removeThought($id: ID!) {
    removeThought(thoughtId: $id) {
      _id
      username
      thoughtText
      createdAt
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

  export const REMOVE_REACTION = gql`
  mutation removeReaction($thoughtId: ID!, $reactionId: ID!) {
    removeReaction(thoughtId: $thoughtId, reactionId: $reactionId) {
        _id
        reactionCount
        reactions {
          _id
          reactionBody
          createdAt
          username
        }
    }
  }
`;


export const REMOVE_FRIEND = gql`
  mutation removeFriend($id: ID!) {
    removeFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

