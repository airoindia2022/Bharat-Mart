
require('dotenv').config({ path: './backend/.env' });
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function test() {
    try {
        console.log('Testing Razorpay Order Creation...');
        console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
        const options = {
            amount: 100 * 100, // 100 INR
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order.id);
    } catch (error) {
        console.error('Order creation failed:', error);
    }
}

test();
