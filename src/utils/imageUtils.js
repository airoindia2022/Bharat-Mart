import { BASE_URL } from '../services/api';

export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/api/images')) return `${BASE_URL}${url}`;
    return url;
};
