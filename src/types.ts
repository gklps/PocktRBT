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