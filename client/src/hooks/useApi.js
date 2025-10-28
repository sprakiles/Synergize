import { useCallback } from 'react';

const useApi = () => {
    const token = localStorage.getItem('token');
    
    const makeRequest = useCallback(async (url, method = 'GET', body = null) => {
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
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'An API error occurred');
        }
        return await response.json();
    }, [token]);

    return makeRequest;
};

export default useApi;