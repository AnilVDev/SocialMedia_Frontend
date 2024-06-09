import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, concat } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSelector } from 'react-redux';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
const graphql_api = process.env.REACT_APP_GRAPHQL_API


const httpLink = new HttpLink({
  // uri: 'http://127.0.0.1:8000/graphql/',
  uri: graphql_api
});
const authMiddleware = new ApolloLink((operation, forward) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));


  const accessToken = user ? user.access : (adminUser ? adminUser.access_token : null);
  // const accessToken = user ? user.access : null; 
  if (accessToken){

    operation.setContext({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return forward(operation);
});


const cache = new InMemoryCache();
// const uri = 'http://127.0.0.1:8000/graphql/'
// const uploadLink = createUploadLink({
//   uri: 'http://127.0.0.1:8000/graphql/',
// });

// const link = concat(authMiddleware, uploadLink);

// const link =createUploadLink( { uri })

// const client = new ApolloClient({
//   cache,
//   link 
// });


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware,httpLink),
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
       <App />
    </ApolloProvider>
  </React.StrictMode>
);

export { client };
