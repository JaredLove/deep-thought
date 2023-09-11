import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {REMOVE_THOUGHT} from '../utils/mutations';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';
import Auth from '../utils/auth';
const SingleThought = props => {
  const { id: thoughtId } = useParams();
  const [removeThought] = useMutation(REMOVE_THOUGHT);
  console.log(thoughtId);
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });
  
  const thought = data?.thought || {};

  const handleDeleteThought = async () => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    
    if (!token) {
      return false;
    }
  
    try {
      await removeThought({
        variables: { id: thoughtId }
      });

      window.location.assign('/profile');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
<div>
  <div className="card-header">
    <h4 className="bg-dark text-light p-2 m-0">
      Viewing thought
    </h4>
  </div>
  <div className="card mb-3">
    <p className="card-header">
      <span style={{ fontWeight: 700 }} className="text-light">
        {thought.username}
      </span>{' '}
      thought on {thought.createdAt}
    </p>
    <div className="card-body">
      <p>{thought.thoughtText}</p>
    </div>
      <button className="btn w-100 btn-danger" onClick={handleDeleteThought}>
        Delete this thought
      </button>
      
  </div>


  {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}

      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
</div>
  );
};

export default SingleThought;
