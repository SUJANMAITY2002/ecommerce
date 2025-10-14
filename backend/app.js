import express from 'express';
import cors from 'cors';
import payment from './routes/productRoutes.js';
import dotenv from 'dotenv';
dotenv.config({path:"./.env"});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend vite server
  credentials: true
}));

app.use("/api/v1", payment);

export default app;
