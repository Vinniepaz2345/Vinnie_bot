const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
    await client.connect();
    db = client.db('whatsapp_bot');
    console.log('✅ MongoDB Connected');
}

async function getSessionCollection() {
    if (!db) await connectDB();
    return db.collection('sessions');
}

module.exports = { connectDB, getSessionCollection };
