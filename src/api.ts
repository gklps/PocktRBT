import axios from 'axios';
import type { TransferFTParams } from './types';

// Create axios instance
const api = axios.create();

// Update base URL before each request
api.interceptors.request.use(async (config) => {
  // Set default values for the config if they don't exist
  config.headers = config.headers || {};
  
  // Get the API URL from environment variables first, fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  config.baseURL = apiUrl;
  
  return config;
});

export const signup = async (email: string, password: string, name: string) => {
  const response = await api.post('/create', {
    email,
    password,
    name,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', {
    email,
    password,
  });
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBalance = async (did: string, token: string) => {
  const response = await api.get(`/request_balance?did=${did}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendTokens = async (
  senderDid: string,
  receiverDid: string,
  amount: number,
  token: string
) => {
  const response = await api.post(
    '/request_txn',
    {
      did: senderDid,
      receiver: receiverDid,
      rbt_amount: amount,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getTransactionHistory = async (
  did: string,
  role: 'Sender' | 'Receiver',
  startDate: string,
  endDate: string,
  token: string
) => {
  const response = await api.get(
    `/txn/by_did?did=${did}&role=${role}&StartDate=${startDate}&EndDate=${endDate}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const registerDid = async (did: string, token: string) => {
  const response = await api.post(
    '/register_did',
    { did },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getAllNFTs = async (did: string, token: string) => {
  const response = await api.get(`/get_all_nft?did=${did}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllFTs = async (did: string, token: string) => {
  const response = await api.get(`/get_all_ft?did=${did}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const transferFT = async (params: TransferFTParams, token: string) => {
  const response = await api.post('/transfer_ft', params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};