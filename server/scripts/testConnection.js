// scripts/testConnection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    console.log('Current directory:', __dirname);
    console.log('.env path:', path.join(__dirname, '..', '.env'));
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();