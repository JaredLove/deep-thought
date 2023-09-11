import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const ThoughtList = ({ thoughts, title }) => {
   const [currentPage, setCurrentPage] = useState(1);
  const [currentThoughts, setCurrentThoughts] = useState([]); 
  const thoughtsPerPage = 10;
  const pages = Math.ceil(thoughts.length / thoughtsPerPage);  
  useEffect(() => {
    paginate(thoughts, 1);
  }, [thoughts]);
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }  


  const paginate = (array, page_number) => {
    setCurrentThoughts(array.slice((page_number - 1) * thoughtsPerPage, page_number * thoughtsPerPage));
    setCurrentPage(page_number);
  };

  return (
    <div>
      <div className="flex-row justify-content-center">
    <ul className="pagination">
      <li className="page-item">
        <button
          className="page-link"
          disabled={currentPage === 1}
          onClick={() => paginate(thoughts, currentPage - 1)}
        >
          Previous
        </button>
      </li>
      {Array.from({ length: pages }).map((item, index) => (
        <li key={index} className="page-item">
          <button
            className="page-link"
            onClick={() => paginate(thoughts, index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}
      <li className="page-item">
        <button
          className="page-link"
          disabled={currentPage === pages}
          onClick={() => paginate(thoughts, currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
  </div>

      <h3>{title}</h3>
      {currentThoughts.map(thought => (
        <div key={thought._id} className="card mb-3">
          <p className="card-header">
            <Link
              to={`/profile/${thought.username}`}
              style={{ fontWeight: 700 }}
              className="text-light"
            >
              {thought.username}
            </Link>{' '}
            thought on {thought.createdAt}
          </p>
          <div className="card-body">
            <Link to={`/thought/${thought._id}`}>
              <p>{thought.thoughtText}</p>
              <p className="mb-0">
                Reactions: {thought.reactionCount} || Click to{' '}
                {thought.reactionCount ? 'see' : 'start'} the discussion!
              </p>
            </Link>

      </div>
    </div>
  ))} 

</div>
  );
};




export default ThoughtList;