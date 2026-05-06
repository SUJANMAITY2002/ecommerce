import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

import './Models/db.js';

import payment from './routes/productRoutes.js';
import AuthRouter from './routes/AuthRouter.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ecommercesujan.netlify.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ FIX: Use cors() as middleware BEFORE routes.
// When preflightContinue is false (default), cors() automatically
// responds to OPTIONS requests itself — no app.options() needed at all.
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/v1', payment);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;