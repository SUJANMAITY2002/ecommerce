import express from 'express';
import cors from 'cors';
import payment from './routes/productRoutes.js';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS CONFIG (FIXED FOR LOCAL + DEPLOYED)
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommercesujan.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Routes
app.use("/api/v1", payment);

export default app;