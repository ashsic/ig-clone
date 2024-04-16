import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, useReactiveVar, ApolloProvider, createHttpLink, gql } from '@apollo/client';
import { cache } from "./graphql/cache.js"
import { isLoggedInVar } from './graphql/cache';
import { Router } from './Router.jsx';

const link = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
});

const client = new ApolloClient({
  cache: cache,
  link
});

const VERIFY_JWT = gql`
  query {
  verifyJwt{
    _id
    username
    firstName
    dob
    bio
    picture
    chats
    posts
    followers
    following
  }
}
`;

// const { loading, error, data } = await client.query({
//   query: VERIFY_JWT
// })

// import { createContext } from 'react';

// const LoginStatusContext = createContext();



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  </React.StrictMode>,
);
