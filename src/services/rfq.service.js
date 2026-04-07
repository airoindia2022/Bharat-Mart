import axiosInstance from './axiosInstance';

/**
 * Send a bulk inquiry or request for quote
 * @param {Object} rfqData - The inquiry data (product ID, quantity, etc.)
 * @returns {Promise<Object>} The RFQ submission response
 */
export const createRFQ = async (rfqData) => {
    const { data } = await axiosInstance.post('/rfq', rfqData);
    return data;
};

/**
 * Fetch list of RFQs with optional filtering
 * @param {Object} [params={}] - Filter parameters
 * @returns {Promise<Array>} List of requests
 */
export const getRFQs = async (params = {}) => {
    const { data } = await axiosInstance.get('/rfq', { params });
    return data;
};

/**
 * Fetch single RFQ details by ID
 * @param {string} id - The request ID
 * @returns {Promise<Object>} Single quest details
 */
export const getRFQById = async (id) => {
    const { data } = await axiosInstance.get(`/rfq/${id}`);
    return data;
};

/**
 * Update the status of an existing RFQ (e.g., Approve, Reject, Closed)
 * @param {string} id - The request ID
 * @param {Object} statusData - The new status info
 * @returns {Promise<Object>} Updated request info
 */
export const updateRFQStatus = async (id, statusData) => {
    const { data } = await axiosInstance.put(`/rfq/${id}`, statusData);
    return data;
};
