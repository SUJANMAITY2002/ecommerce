import express from 'express';
import cors from 'cors';
import payment from './routes/productRoutes.js';
import AuthRouter from './routes/AuthRouter.js';
import dotenv from 'dotenv';
import './Models/db.js';

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED: Allow all your frontend origins including Render-hosted frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ecommercesujan.netlify.app",
    // Add your Render frontend URL here if you have one, e.g.:
    // "https://your-frontend.onrender.com"
  ],
  credentials: true
}));

// ✅ FIXED: Auth routes now mounted in app.js so they work on Render
app.use('/api/auth', AuthRouter);

// Payment / product routes
app.use("/api/v1", payment);

// Health check — useful for Render to confirm the server is up
app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;