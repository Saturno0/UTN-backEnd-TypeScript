#!/usr/bin/env node

// Database Initialization Script for UTN E-commerce Application
// Run this script to set up your database: node database/init.js

const { 
  testConnection, 
  initializeDatabase, 
  seedDatabase 
} = require('./config');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const main = async () => {
  console.log('🚀 UTN E-commerce Database Initialization');
  console.log('==========================================\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
      console.log('\n❌ Please make sure MySQL is running and your credentials are correct.');
      console.log('   You can update the credentials in database/config.js or set environment variables:');
      console.log('   - DB_HOST (default: localhost)');
      console.log('   - DB_USER (default: root)');
      console.log('   - DB_PASSWORD (default: root)');
      console.log('   - DB_NAME (default: shopdb)');
      rl.close();
      return;
    }

    // Ask user if they want to initialize the database
    const initChoice = await question('\n2. Do you want to initialize the database schema? (y/n): ');
    
    if (initChoice.toLowerCase() === 'y' || initChoice.toLowerCase() === 'yes') {
      console.log('\n   Initializing database schema...');
      const initOk = await initializeDatabase();
      
      if (!initOk) {
        console.log('❌ Database initialization failed. Please check the error messages above.');
        rl.close();
        return;
      }
    } else {
      console.log('   Skipping database initialization.');
    }

    // Ask user if they want to seed the database
    const seedChoice = await question('\n3. Do you want to seed the database with sample data? (y/n): ');
    
    if (seedChoice.toLowerCase() === 'y' || seedChoice.toLowerCase() === 'yes') {
      console.log('\n   Seeding database with sample data...');
      const seedOk = await seedDatabase();
      
      if (!seedOk) {
        console.log('❌ Database seeding failed. Please check the error messages above.');
        rl.close();
        return;
      }
    } else {
      console.log('   Skipping database seeding.');
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Your API will be available at http://localhost:4000');
    console.log('   3. Test the endpoints: GET /products, POST /products, etc.');
    
  } catch (error) {
    console.error('\n❌ An unexpected error occurred:', error.message);
  } finally {
    rl.close();
  }
};

// Run the main function
main().catch(console.error);
