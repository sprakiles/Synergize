import { useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const useApi = () => {
    const token = localStorage.getItem('token');

    const makeRequest = useCallback(async (url, method = 'GET', body = null) => {
        const base = API_BASE_URL || (import.meta.env.DEV ? '' : 'https://synergize-production.up.railway.app');
        const normalizedBase = base.replace(/\/$/, '');
        const path = url.startsWith('/') ? url : `/${url}`;
        const fullUrl = normalizedBase ? `${normalizedBase}${path}` : path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(fullUrl, options);
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.msg || `API error: ${response.status}`);
            } catch (jsonError) {
                throw new Error('Failed to parse error response from server.');
            }
        }
        return await response.json();
    }, [token]);

    return makeRequest;
};

export default useApi;
