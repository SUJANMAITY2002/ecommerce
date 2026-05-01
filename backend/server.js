import app from './app.js';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// ✅ FIXED: Removed AuthRouter and db import from here
// Both are now handled in app.js so they load correctly on Render
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});