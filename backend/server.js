import app from './app.js';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

// ✅ FIX: Warn clearly if Razorpay keys are missing
if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
    console.warn('WARNING: RAZORPAY_API_KEY or RAZORPAY_API_SECRET is not set. Payments will fail.');
}

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});