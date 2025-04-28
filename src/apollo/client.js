import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export default new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/', // ← note the slash, not /graphql
  }),
  cache: new InMemoryCache(),
});
