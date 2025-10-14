import express from 'express';
import { getkey, paymentverification, processPayment } from '../controllers/productController.js';
const router=express.Router();
router.route("/payment/process").post(processPayment);
router.route("/getKey").get(getkey);
router.route("/paymentverification").post(paymentverification)
export default router;