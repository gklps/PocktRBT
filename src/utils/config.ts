import axios from 'axios';

let cachedIP: string | null = null;

export const getPublicIP = async (): Promise<string> => {
  if (cachedIP) return cachedIP;
  
  try {
    // Using ipify API to get public IP
    const response = await axios.get('https://api.ipify.org?format=json');
    cachedIP = response.data.ip;
    return cachedIP || 'localhost'; // Ensure we never return null
  } catch (error) {
    console.error('Failed to fetch public IP:', error);
    return 'localhost';
  }
};

export const getAPIURL = async (): Promise<string> => {
  const ip = await getPublicIP(); // This will always return a string now
  return `http://${ip}:8080`;
};