import axios from 'axios';
import type { 
  APIResponse,
  SignupResponse,
  LoginResponse,
  CreateUserRequest,
  LoginRequest,
  AccountInfo,
  Transaction,
  NFT,
  FT,
  TransferFTParams,
  User,
  SmartContractRequest,
  DeploySmartContractRequest,
  ExecuteSmartContractRequest
} from './types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: any): never => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error(error.message || 'An error occurred');
};

// Auth
export const signup = async (
  email: string,
  password: string,
  name: string,
  secretKey?: string
): Promise<APIResponse<SignupResponse>> => {
  try {
    const data: CreateUserRequest = { email, password, name };
    if (secretKey) {
      data.secret_key = secretKey;
    }
    const response = await api.post<APIResponse<SignupResponse>>('/create', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const data: LoginRequest = { email, password };
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get<User>('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Wallet Operations
export const createWallet = async (port: number): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>('/create_wallet', { port });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const registerDid = async (did: string, token: string): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/register_did',
      { did },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const setupQuorum = async (did: string, token: string): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/setup_quorum',
      { did },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addPeer = async (
  selfDid: string,
  did: string,
  didType: number,
  peerId: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/add_peer',
      {
        self_did: selfDid,
        DID: did,
        DIDType: didType,
        PeerID: peerId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Balance
export const getBalance = async (did: string, token: string): Promise<APIResponse<AccountInfo[]>> => {
  try {
    const response = await api.get<APIResponse<AccountInfo[]>>(`/request_balance?did=${did}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Send Tokens
export const sendTokens = async (
  did: string,
  receiver: string,
  rbtAmount: number,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/request_txn',
      { did, receiver, rbt_amount: rbtAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Transactions
export const getTransactionHistory = async (
  did: string,
  role: 'Sender' | 'Receiver',
  startDate: string,
  endDate: string,
  token: string
): Promise<APIResponse<Transaction[]>> => {
  try {
    const response = await api.get<APIResponse<Transaction[]>>(
      `/txn/by_did?did=${did}&role=${role}&StartDate=${startDate}&EndDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// NFT Operations
export const getAllNFTs = async (did: string, token: string): Promise<APIResponse<NFT[]>> => {
  try {
    const response = await api.get<APIResponse<NFT[]>>(`/get_all_nft?did=${did}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createNFT = async (
  did: string,
  metadata: File,
  artifact: File,
  token: string
): Promise<APIResponse> => {
  try {
    const formData = new FormData();
    formData.append('did', did);
    formData.append('metadata', metadata);
    formData.append('artifact', artifact);

    const response = await api.post<APIResponse>('/create_nft', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const subscribeNFT = async (
  did: string,
  nft: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/subscribe_nft',
      { did, nft },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deployNFT = async (
  did: string,
  nft: string,
  quorumType: number,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/deploy_nft',
      { did, nft, quorum_type: quorumType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const executeNFT = async (
  owner: string,
  receiver: string,
  nft: string,
  nftValue: number,
  nftData: string,
  quorumType: number,
  comment: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/execute_nft',
      {
        owner,
        receiver,
        nft,
        nft_value: nftValue,
        nft_data: nftData,
        quorum_type: quorumType,
        comment
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// FT Operations
export const getAllFTs = async (did: string, token: string): Promise<APIResponse<FT[]>> => {
  try {
    const response = await api.get<APIResponse<FT[]>>(`/get_all_ft?did=${did}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const transferFT = async (params: TransferFTParams, token: string): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>('/transfer_ft', params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Smart Contract Operations
export const generateSmartContract = async (
  did: string,
  binaryCodePath: File,
  rawCodePath: File,
  schemaFilePath: File,
  token: string
): Promise<APIResponse> => {
  try {
    const formData = new FormData();
    formData.append('did', did);
    formData.append('binaryCodePath', binaryCodePath);
    formData.append('rawCodePath', rawCodePath);
    formData.append('schemaFilePath', schemaFilePath);

    const response = await api.post<APIResponse>('/generate-smart-contract', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deploySmartContract = async (
  data: DeploySmartContractRequest,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>('/deploy-smart-contract', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const executeSmartContract = async (
  data: ExecuteSmartContractRequest,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>('/execute-smart-contract', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const subscribeSmartContract = async (
  did: string,
  smartContractToken: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/subscribe-smart-contract',
      { did, smartContractToken },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};