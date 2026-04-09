import axiosInstance from './axiosInstance';

/**
 * Fetch products with optional filters
 * @param {Object} [params={}] - Search/Filter parameters
 * @param {AbortSignal} [signal] - Optional signal to abort request
 * @returns {Promise<Array>} List of products
 */
export const getProducts = async (params = {}, signal) => {
    const { data } = await axiosInstance.get('/products', { params, signal });
    return data;
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 * @param {AbortSignal} [signal] - Optional signal to abort request
 * @returns {Promise<Object>} Product details
 */
export const getProductById = async (id, signal) => {
    if (!id) throw new Error("Product ID is required");
    const { data } = await axiosInstance.get(`/products/${id}`, { signal });
    return data;
};

/**
 * Create a new product (handles both JSON and FormData)
 * @param {Object|FormData} productData - New product details
 * @returns {Promise<Object>} Created product data
 */
export const createProduct = async (productData) => {
    const { data } = await axiosInstance.post('/products', productData, {
        headers: {
            'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
    });
    return data;
};

/**
 * Update an existing product (handles both JSON and FormData)
 * @param {string} id - Product ID to update
 * @param {Object|FormData} productData - Updated product details
 * @returns {Promise<Object>} Updated product data
 */
export const updateProduct = async (id, productData) => {
    const { data } = await axiosInstance.put(`/products/${id}`, productData, {
        headers: {
            'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
    });
    return data;
};

/**
 * Delete a product by ID
 * @param {string} id - Product ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProduct = async (id) => {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
};

/**
 * Admin: Approve a pending product
 * @param {string} id - Product ID to approve
 * @returns {Promise<Object>} Approval result
 */
export const approveProduct = async (id) => {
    const { data } = await axiosInstance.put(`/products/${id}/approve`);
    return data;
};

/**
 * Create a review for a product
 * @param {string} productId - Product ID
 * @param {Object} review - Review data (rating, comment)
 * @returns {Promise<Object>} Created review result
 */
export const createProductReview = async (productId, review) => {
    const { data } = await axiosInstance.post(`/products/${productId}/reviews`, review);
    return data;
};
