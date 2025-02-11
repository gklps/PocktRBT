// API Response Types
export interface APISuccessResponse<T = any> {
  status: boolean;
  message: string;
  result: T;
}

export interface APIErrorResponse {
  status: boolean;
  message: string;
  error: string;
}

export type APIResponse<T = any> = APISuccessResponse<T> | APIErrorResponse;

// Auth Types
export interface SignupResponse {
  did: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  secret_key?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  did: string;
}

// Balance Types
export interface AccountInfo {
  did: string;
  did_type: number;
  locked_rbt: number;
  pinned_rbt: number;
  pledged_rbt: number;
  rbt_amount: number;
}

// Transaction Types
export interface Transaction {
  Amount: number;
  BlockID: string;
  Comment: string;
  DateTime: string;
  DeployerDID: string;
  Epoch: number;
  Mode: number;
  ReceiverDID: string;
  SenderDID: string;
  Status: boolean;
  TotalTime: number;
  TransactionID: string;
  TransactionType: string;
}

// NFT Types
export interface NFT {
  nft: string;
  nft_value: number;
  owner_did: string;
}

export interface NFTChainData {
  BlockId: string;
  BlockNo: number;
  NFTData: string;
  NFTOwner: string;
  NFTValue: number;
}

// FT Types
export interface FT {
  creator_did: string;
  ft_count: number;
  ft_name: string;
}

export interface TransferFTParams {
  sender: string;
  receiver: string;
  ft_count: number;
  ft_name: string;
  creatorDID: string;
  quorum_type: number;
}

// Smart Contract Types
export interface SmartContractRequest {
  did: string;
  binary_code_path: string;
  raw_code_path: string;
  schema_file_path: string;
}

export interface DeploySmartContractRequest {
  deployerAddr: string;
  smartContractToken: string;
  quorumType: number;
  rbtAmount: number;
  comment: string;
}

export interface ExecuteSmartContractRequest {
  comment: string;
  smartContractToken: string;
  smartContractData: string;
  executorAddr: string;
  quorumType: number;
}

// Peer Types
export interface PeerRequest {
  self_did: string;
  DID: string;
  DIDType: number;
  PeerID: string;
}

// Response Types
export type BalanceResponse = APIResponse<AccountInfo[]>;
export type TransactionResponse = APIResponse<Transaction[]>;
export type NFTResponse = APIResponse<NFT[]>;
export type NFTChainResponse = APIResponse<NFTChainData[]>;
export type FTResponse = APIResponse<FT[]>;