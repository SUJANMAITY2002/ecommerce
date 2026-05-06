import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const mongo_url = process.env.MONGO_CONN;

// ✅ FIX: If MONGO_CONN is missing, crash immediately with a clear message
// instead of silently failing and causing mysterious 500 errors later
if (!mongo_url) {
    console.error('FATAL: MONGO_CONN environment variable is not set!');
    console.error('Go to Render Dashboard → Your Service → Environment → Add MONGO_CONN');
    process.exit(1);
}

mongoose.connect(mongo_url)
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });