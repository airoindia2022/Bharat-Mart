import axiosInstance from './axiosInstance';

/**
 * Initiate an order to get Razorpay order ID
 * @param {Object} orderData - The order details
 * @returns {Promise<Object>} Created order data
 */
export const createOrder = async (orderData) => {
    const { data } = await axiosInstance.post('/payment/create-order', orderData);
    return data;
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentDetails - Verification info (IDs/Signature)
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (paymentDetails) => {
    const { data } = await axiosInstance.post('/payment/verify-payment', paymentDetails);
    return data;
};

/**
 * Fetch authenticated user's order history
 * @returns {Promise<Array>} List of user's orders
 */
export const getMyOrders = async () => {
    const { data } = await axiosInstance.get('/payment/my-orders');
    return data;
};

/**
 * Fetch orders relevant to the authenticated seller
 * @returns {Promise<Array>} List of seller/received orders
 */
export const getSellerOrders = async () => {
    const { data } = await axiosInstance.get('/payment/seller-orders');
    return data;
};

/**
 * Admin: Fetch all orders across platform
 * @returns {Promise<Array>} Full order list
 */
export const getAllOrders = async () => {
    const { data } = await axiosInstance.get('/payment/all-orders');
    return data;
};

/**
 * Admin: Settle an order manually
 * @param {string} orderId - ID of the order to settle
 * @returns {Promise<Object>} Updated order data
 */
export const settleOrderManual = async (orderId) => {
    const { data } = await axiosInstance.put(`/payment/settle-order/${orderId}`);
    return data;
};

/**
 * Admin: Refund an order manually
 * @param {string} orderId - ID of the order to refund
 * @returns {Promise<Object>} Updated order data
 */
export const refundOrderManual = async (orderId) => {
    const { data } = await axiosInstance.put(`/payment/refund-order/${orderId}`);
    return data;
};
