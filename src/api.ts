import axios from 'axios';

const API_URL = 'http://20.193.136.169:8080';

/**
 * Signs up a new user.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @param name - The name of the user.
 *
 * @returns The response data from the server.
 */
export const signup = async (email: string, password: string, name: string) => {
  const response = await axios.post(`${API_URL}/create`, {
    email,
    password,
    name,
  });
  return response.data;
};

/**
 * Logs in a user.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 *
 * @returns The response data from the server.
 */
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

/**
 * Gets the profile of the user.
 *
 * @param token - The authentication token of the user.
 *
 * @returns The response data from the server.
 */
export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const getBalance = async (did: string, token: string) => {
  const response = await axios.get(`${API_URL}/request_balance?did=${did}`, {
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
  const response = await axios.post(
    `${API_URL}/request_txn`,
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
  const response = await axios.get(
    `${API_URL}/txn/by_did?did=${did}&role=${role}&StartDate=${startDate}&EndDate=${endDate}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const registerDid = async (did: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/register_did`,
    { did },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};