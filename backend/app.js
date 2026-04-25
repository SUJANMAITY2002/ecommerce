import express from 'express';
import cors from 'cors';
import payment from './routes/productRoutes.js';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5173", "https://ecommercesujan.netlify.app"],
  credentials: true
}));

app.use("/api/v1", payment);

export default app;