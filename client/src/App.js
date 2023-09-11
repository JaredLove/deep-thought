import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';


import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// With this function, setContext, we can create essentially a middleware function that will 
// retrieve the token for us and combine it with the existing httpLink. Let's create that function 
// next, by adding the following code right after the httpLink declaration in App.js:
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.

// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.

// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.

// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

// With the preceding code, we first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink().

// URI stands for "Uniform Resource Identifier." It's a string that identifies a resource. In this case, it identifies the location of our GraphQL server endpoint.
const httpLink = createHttpLink({
  uri: '/graphql',
});

// With the configuration of authLink, we use the setContext() function to 
// retrieve the token from localStorage and set the HTTP request headers of 
// every request to include the token, whether the request needs it or not. 
// This is fine, because if the request doesn't need the token, our 
// server-side resolver function won't check for it.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Finally, we need to combine the authLink and httpLink objects so that 
// every request retrieves the token and sets the request headers before 
// making the request to the API. Let's update the client declaration in 
// App.js to look like the following code:

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//Note how we wrap the entire returning JSX code with <ApolloProvider>. Because we're 
// passing the client variable in as the value for the client prop in the provider, 
// everything between the JSX tags will eventually have access to the server's API 
// data through the client we set up.
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
  <Routes>
    <Route
      path="/"
      element={<Home />}
    />
    <Route
      path="/login"
      element={<Login />}
    />
    <Route
      path="/signup"
      element={<Signup />}
    />
   <Route path="/profile">
    <Route path=":username" element={<Profile />} />
    <Route path="" element={<Profile />} />
  </Route>
  <Route
    path="/thought/:id"
    element={<SingleThought />}
  />

    <Route
      path="*"
      element={<NoMatch />}
    />
  </Routes>
</div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}
export default App;
