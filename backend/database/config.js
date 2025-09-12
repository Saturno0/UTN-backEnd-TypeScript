// Database Configuration for UTN E-commerce Application
// This file contains database connection settings and utilities

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'shopdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const createPool = () => {
  return mysql.createPool(dbConfig);
};

// Test database connection
const testConnection = async () => {
  try {
    const pool = createPool();
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    const pool = createPool();
    
    // Read and execute schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of statements) {
      if (statement) {
        await pool.execute(statement);
      }
    }
    
    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Seed database with sample data
const seedDatabase = async () => {
  try {
    const pool = createPool();
    
    // Read and execute seed file
    const fs = require('fs');
    const path = require('path');
    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    
    // Split seed into individual statements
    const statements = seed
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of statements) {
      if (statement) {
        await pool.execute(statement);
      }
    }
    
    console.log('✅ Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    return false;
  }
};

// Utility functions
const executeQuery = async (query, params = []) => {
  try {
    const pool = createPool();
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Query execution failed:', error.message);
    throw error;
  }
};

const executeTransaction = async (queries) => {
  try {
    const pool = createPool();
    const connection = await pool.getConnection();
    
    await connection.beginTransaction();
    
    try {
      for (const { query, params = [] } of queries) {
        await connection.execute(query, params);
      }
      
      await connection.commit();
      connection.release();
      return true;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Transaction failed:', error.message);
    throw error;
  }
};

module.exports = {
  createPool,
  testConnection,
  initializeDatabase,
  seedDatabase,
  executeQuery,
  executeTransaction,
  dbConfig
};
