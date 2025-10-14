import { instance } from "../server.js"
import crypto from 'crypto';

export const processPayment = async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
        }

        const options = {
            amount: Number(amount * 100), 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                created_at: new Date().toISOString()
            }
        };

        const order = await instance.orders.create(options);
        
        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
}

export const getkey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_API_KEY
        });
    } catch (error) {
        console.error('Error getting Razorpay key:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment key'
        });
    }
}

export const paymentverification = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        
        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification data'
            });
        }

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment verified successfully - return JSON response instead of redirecting
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                verified: true
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                verified: false
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
}