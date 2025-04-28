const { ApolloServer, gql } = require('apollo-server');

// 1. Define schema
const typeDefs = gql`
  type Figure {
    id: ID!
    name: String!
    price: Float!
    image: String!
    series: String!
  }

  type Query {
    figures: [Figure!]!
  }
`;

// 2. Sample data
const figures = [
  {
    id: '1',
    name: 'Naruto Uzumaki Statue',
    price: 79.99,
    image: '/images/naruto.jpg',
    series: 'Naruto',
  },
  {
    id: '2',
    name: 'Goku Action Figure',
    price: 59.99,
    image: '/images/goku.jpg',
    series: 'Dragon Ball Z',
  },
  // add more sample figures as you like
];

// 3. Resolvers
const resolvers = {
  Query: {
    figures: () => figures,
  },
};

// 4. Start server
const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Mock GraphQL server ready at ${url}`);
});
