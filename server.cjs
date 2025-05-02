// server.cjs
require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mysql = require('mysql2/promise');

// 1. Schema definition (added deleteFigure)
const typeDefs = gql`
  type Figure {
    id: ID!
    name: String!
    series: String
    price: Float!
    image: String!
  }

  type Query {
    figures: [Figure!]!
  }

  type Mutation {
    addFigure(
      name: String!
      series: String
      price: Float!
      image: String!
    ): Figure!

    updateFigure(
      id: ID!
      name: String!
      series: String
      price: Float!
      image: String!
    ): Figure!

    deleteFigure(
      id: ID!
    ): Boolean!
  }
`;

// 2. MySQL pool
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT,
});

// 3. Resolvers (Query + all Mutations in one object)
const resolvers = {
  Query: {
    figures: async () => {
      const [rows] = await pool.query(
        'SELECT id, name, series, price, image FROM figures'
      );
      return rows;
    },
  },

  Mutation: {
    addFigure: async (_, { name, series, price, image }) => {
      const [result] = await pool.execute(
        'INSERT INTO figures (name, series, price, image) VALUES (?, ?, ?, ?)',
        [name, series, price, image]
      );
      return { id: result.insertId, name, series, price, image };
    },

    updateFigure: async (_, { id, name, series, price, image }) => {
      await pool.execute(
        `UPDATE figures
           SET name = ?, series = ?, price = ?, image = ?
         WHERE id = ?`,
        [name, series, price, image, id]
      );
      return { id, name, series, price, image };
    },

    deleteFigure: async (_, { id }) => {
      await pool.execute(
        'DELETE FROM figures WHERE id = ?',
        [id]
      );
      return true;
    },
  },
};

// 4. Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL ready at ${url}`);
});
