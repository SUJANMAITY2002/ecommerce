import app from './app.js';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import AuthRouter from './routes/AuthRouter.js';
import './Models/db.js';
import cors from "cors";   // ✅ ADD THIS

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

// ✅ ADD THIS BLOCK (VERY IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.use('/api/auth', AuthRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});