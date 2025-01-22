export interface User {
  id: number;
  email: string;
  name: string;
  did: string;
}

export interface LoginResponse {
  token: string;
}

export interface Balance {
  account_info: {
    did: string;
    did_type: number;
    locked_rbt: number;
    pinned_rbt: number;
    pledged_rbt: number;
    rbt_amount: number;
  }[];
  message: string;
  result: null;
  status: boolean;
}

export interface TransferResponse {
  did: string;
  jwt: string;
  status: string;
}

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

export interface TransactionHistory {
  TxnDetails: Transaction[];
  message: string;
  result: string;
  status: boolean;
}

export interface NFT {
  nft: string;
  nft_value: number;
  owner_did: string;
}

export interface NFTResponse {
  message: string;
  nfts: NFT[];
  result: null;
  status: boolean;
}

export interface FT {
  creator_did: string;
  ft_count: number;
  ft_name: string;
}

export interface FTResponse {
  ft_info: FT[];
  message: string;
  result: null;
  status: boolean;
}

export interface TransferFTParams {
  sender: string;
  receiver: string;
  ft_count: number;
  ft_name: string;
  creatorDID: string;
  quorum_type?: number;
}