import axios from 'axios';
import type { 
  APIResponse,
  SignupResponse,
  LoginResponse,
  SignupRequest,
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
  name: string
): Promise<SignupResponse> => {
  try {
    const data: SignupRequest = {
      email,
      password,
      name,
      secret_key: password, // Using password as secret key
      wallet_type: 'server-custody' // Default to server custody
    };
    
    const response = await api.post<SignupResponse>('/create', data);
    
    // Check if response status is 201 (Created)
    if (response.status === 201) {
      return response.data;
    }
    
    // If we have data but status isn't 201, still return the data
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Failed to create account');
  } catch (error: any) {
    // Check if we have a response with error data
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // Check if we have a response with data but no error field
    if (error.response?.data) {
      return error.response.data;
    }
    
    throw new Error('Failed to create account');
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const data: LoginRequest = { email, password };
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Invalid credentials');
  }
};

export const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get<User>('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to fetch profile');
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
  token: string,
  comment?: string,
  quorumType?: number,
  password?: string
): Promise<APIResponse> => {
  try {
    const data: any = { 
      did, 
      receiver, 
      rbt_amount: rbtAmount 
    };

    if (comment) data.comment = comment;
    if (quorumType) data.quorum_type = quorumType;
    if (password) data.password = password;

    const response = await api.post<APIResponse>(
      '/request_txn',
      data,
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
  token: string,
  startDate?: string,
  endDate?: string
): Promise<APIResponse<Transaction[]>> => {
  try {
    let url = `/txn/by_did?did=${did}&role=${role}`;
    if (startDate) url += `&StartDate=${startDate}`;
    if (endDate) url += `&EndDate=${endDate}`;
    
    const response = await api.get<APIResponse<Transaction[]>>(
      url,
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

export const createFT = async (
  did: string,
  ftName: string,
  ftCount: number,
  tokenCount: number,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/create_ft',
      {
        did,
        ft_name: ftName,
        ft_count: ftCount,
        token_count: tokenCount
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const transferFT = async (
  sender: string,
  receiver: string,
  ftCount: number,
  ftName: string,
  creatorDID: string,
  quorumType: number,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/transfer_ft',
      {
        sender,
        receiver,
        ft_count: ftCount,
        ft_name: ftName,
        creatorDID,
        quorum_type: quorumType
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
  deployerAddr: string,
  smartContractToken: string,
  quorumType: number,
  rbtAmount: number,
  comment: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/deploy-smart-contract',
      {
        deployerAddr,
        smartContractToken,
        quorumType,
        rbtAmount,
        comment
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const executeSmartContract = async (
  executorAddr: string,
  smartContractToken: string,
  smartContractData: string,
  quorumType: number,
  comment: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/execute-smart-contract',
      {
        executorAddr,
        smartContractToken,
        smartContractData,
        quorumType,
        comment
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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

// RBT Operations
export const generateTestRBT = async (
  did: string,
  numberOfTokens: number,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/testrbt/create',
      {
        did,
        number_of_tokens: numberOfTokens
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const unpledgeRBT = async (
  did: string,
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/rbt/unpledge',
      { did },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Signing Operations
export const sign = async (
  did: string,
  hash: string,
  id: string,
  mode: number,
  onlyPrivKey: boolean = true
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/sign',
      {
        did,
        sign_data: {
          hash,
          id,
          mode,
          only_priv_key: onlyPrivKey
        }
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const passSignature = async (
  did: string,
  id: string,
  mode: number,
  signature: number[],
  token: string
): Promise<APIResponse> => {
  try {
    const response = await api.post<APIResponse>(
      '/pass_signature',
      {
        did,
        sign_response: {
          id,
          mode,
          signature: {
            Signature: signature
          }
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};