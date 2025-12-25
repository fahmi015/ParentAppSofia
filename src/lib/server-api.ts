import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'https://api.sofia-sahara.com/api/v1';

export const serverApi = async (url: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const config = {
        method,
        url: `${API_URL}${url}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        data,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching ${url}:`, error.response?.status, error.response?.data);
        throw error;
    }
};
