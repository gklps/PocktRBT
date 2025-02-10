import axios from 'axios';
let cachedIP = null;
export const getPublicIP = async () => {
    if (cachedIP)
        return cachedIP;
    try {
        // Using ipify API to get public IP
        const response = await axios.get('https://api.ipify.org?format=json');
        cachedIP = response.data.ip;
        return cachedIP || 'localhost'; // Ensure we never return null
    }
    catch (error) {
        console.error('Failed to fetch public IP:', error);
        return 'localhost';
    }
};
export const getAPIURL = async () => {
    const ip = await getPublicIP(); // This will always return a string now
    return `http://${ip}:8080`;
};
