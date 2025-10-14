import express from 'express';
import cors from 'cors';
import payment from './routes/productRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: "http://localhost:5173", // frontend vite server
  credentials: true
}));

app.use("/api/v1", payment);

export default app;
