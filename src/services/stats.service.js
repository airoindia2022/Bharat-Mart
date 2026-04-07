import axiosInstance from './axiosInstance';

/**
 * Admin: Fetch platform-wide analytics
 * @returns {Promise<Object>} Statistics/Metrics object
 */
export const getAdminStats = async () => {
    const { data } = await axiosInstance.get('/stats/admin');
    return data;
};

/**
 * Seller: Fetch storefront specific business stats
 * @returns {Promise<Object>} Metrics related to sales and stock
 */
export const getSellerStats = async () => {
    const { data } = await axiosInstance.get('/stats/seller');
    return data;
};
