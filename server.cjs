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
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'appuser',
  password: process.env.DB_PASS || 'apppass',
  database: process.env.DB_NAME || 'figurines',
  port:     process.env.DB_PORT || 3307,
});

// In-memory fallback storage
let inMemoryFigures = [];
let nextId = 1;

// Check if we can use database or need in-memory
let useDatabase = false;

// Initialize database table
async function initDatabase() {
  try {
    // Test connection first with a timeout
    const testConnection = pool.execute('SELECT 1');
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 2000)
    );
    await Promise.race([testConnection, timeout]);
    
    // Create table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS figures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        series VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    useDatabase = true;
    console.log('✅ Database table initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // If database connection fails, we'll use in-memory storage
    useDatabase = false;
    console.log('📦 Using in-memory storage (database not available)');
  }
}

// 3. Resolvers (Query + all Mutations in one object)
const resolvers = {
  Query: {
    figures: async () => {
      // Always return in-memory if database is not available
      if (!useDatabase) {
        return inMemoryFigures;
      }
      
      try {
        const [rows] = await pool.query(
          'SELECT id, name, series, price, image FROM figures'
        );
        return rows.map(row => ({
          ...row,
          id: row.id.toString()
        }));
      } catch (dbError) {
        console.error('Database query error, switching to in-memory:', dbError.message);
        useDatabase = false;
        return inMemoryFigures;
      }
    },
  },

  Mutation: {
    addFigure: async (_, { name, series, price, image }) => {
      if (useDatabase) {
        try {
          const [result] = await pool.execute(
            'INSERT INTO figures (name, series, price, image) VALUES (?, ?, ?, ?)',
            [name, series, price, image]
          );
          return { id: result.insertId.toString(), name, series, price, image };
        } catch (error) {
          console.error('Database insert error:', error.message);
          useDatabase = false;
        }
      }
      // In-memory fallback
      const newFigure = { id: (nextId++).toString(), name, series, price, image };
      inMemoryFigures.push(newFigure);
      return newFigure;
    },

    updateFigure: async (_, { id, name, series, price, image }) => {
      if (useDatabase) {
        try {
          await pool.execute(
            `UPDATE figures
               SET name = ?, series = ?, price = ?, image = ?
             WHERE id = ?`,
            [name, series, price, image, id]
          );
          return { id, name, series, price, image };
        } catch (error) {
          console.error('Database update error:', error.message);
          useDatabase = false;
        }
      }
      // In-memory fallback
      const index = inMemoryFigures.findIndex(f => f.id === id);
      if (index !== -1) {
        inMemoryFigures[index] = { id, name, series, price, image };
        return inMemoryFigures[index];
      }
      throw new Error('Figure not found');
    },

    deleteFigure: async (_, { id }) => {
      if (useDatabase) {
        try {
          await pool.execute(
            'DELETE FROM figures WHERE id = ?',
            [id]
          );
          return true;
        } catch (error) {
          console.error('Database delete error:', error.message);
          useDatabase = false;
        }
      }
      // In-memory fallback
      const index = inMemoryFigures.findIndex(f => f.id === id);
      if (index !== -1) {
        inMemoryFigures.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};

// 4. Start Apollo Server
async function startServer() {
  await initDatabase();
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 GraphQL ready at ${url}`);
  });
}

startServer();
