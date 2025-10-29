// client/src/hooks/useApi.js
import { useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const useApi = () => {
    const token = localStorage.getItem('token');
    
    const makeRequest = useCallback(async (url, method = 'GET', body = null) => {
        const fullUrl = `${API_BASE_URL}${url}`;

        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(fullUrl, options);
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'An API error occurred');
            } catch (jsonError) {
                throw new Error('Failed to parse error response from server.');
            }
        }
        return await response.json();
    }, [token]);

    return makeRequest;
};

export default useApi;