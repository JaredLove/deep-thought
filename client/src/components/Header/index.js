import React from 'react';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
// With React Router, however, you can't simply use <a> elements. An element like <a href="/login"> 
// would cause the browser to refresh and make a new request to your server for /login. That would 
// defeat the whole purpose of React and its single-page goodness. Instead, you can use React Router's 
// Link component. This component will change the URL while staying on the same page.
import { Link } from 'react-router-dom';

import { QUERY_ME_NAME } from '../../utils/queries';
const Header = () => {
  const { data } = useQuery(QUERY_ME_NAME);
  //With the event.preventDefault(), we're actually overriding the <a> 
  // element's default nature of having the browser load a different 
  // resource. Instead, we execute the .logout() method, which will 
  // remove the token from localStorage and then refresh the application 
  // by taking the user back to the homepage.

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
  {Auth.loggedIn() ? (
    
    <>  
      {data?.me ? (
        <>
          Welcome, {data.me.username}!
        </>
      ) : null}
      <Link to="/">Home</Link>
      <Link to="/profile">Me</Link>
      <a href="/" onClick={logout}>
        Logout
      </a>
    </>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </>
  )}
</nav>
      </div>
    </header>
  );
};
export default Header;
