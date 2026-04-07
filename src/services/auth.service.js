import axiosInstance from './axiosInstance';

/**
 * Log out user from the application
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    // Optional: redirect to login
    // window.location.href = '/login';
};

/**
 * Login user with credentials
 * @param {Object} credentials - Login info (email, password)
 * @returns {Promise<Object>} The login response
 */
export const login = async (credentials) => {
    const { data } = await axiosInstance.post('/users/login', credentials);
    return data;
};

/**
 * Register user with given data
 * @param {Object} userData - Registration info
 * @returns {Promise<Object>} The register response
 */
export const register = async (userData) => {
    const { data } = await axiosInstance.post('/users/register', userData);
    return data;
};

/**
 * Fetch authenticated user's profile
 * @returns {Promise<Object>} The user profile data
 */
export const getProfile = async () => {
    const { data } = await axiosInstance.get('/users/profile');
    return data;
};

/**
 * Update authenticated user's profile
 * @param {Object} userData - Updated user info
 * @returns {Promise<Object>} The update profile response
 */
export const updateProfile = async (userData) => {
    const { data } = await axiosInstance.put('/users/profile', userData);
    return data;
};

/**
 * Admin only: Fetch all users
 * @returns {Promise<Array>} List of all users
 */
export const getUsers = async () => {
    const { data } = await axiosInstance.get('/users');
    return data;
};
/**
 * Upload company logo
 * @param {FormData} formData - FormData containing the logo file
 * @returns {Promise<Object>} The upload logo response
 */
export const uploadLogo = async (formData) => {
    const { data } = await axiosInstance.post('/users/logo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

/**
 * Fetch a user's public profile
 * @param {string} id - User ID
 * @returns {Promise<Object>} The public profile data
 */
export const getPublicProfile = async (id, signal) => {
    const { data } = await axiosInstance.get(`/users/${id}`, { signal });
    return data;
};
