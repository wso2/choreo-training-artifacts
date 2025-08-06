// src/api/index.ts
import axios from 'axios';

let baseURL = 'https://08bd1175-7029-4caf-a11b-10d047fed4f7-dev.e1-us-east-azure.choreoapis.dev/banking-app-sandbox/backend/v1.0';

if (typeof window !== 'undefined' && window.location.origin.includes('http')) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalConfig = (window as any).configs;
  if (globalConfig?.apiUrl) {
    baseURL = globalConfig.apiUrl;
  }
}

const api = axios.create({
  baseURL,
});

export interface BankAccount {
  id: number;
  user_id: number;
  owner: string;
  account_no: string;
  bank_name: string;
  balance: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  currency: string;
  created_at: string;
}

export interface TransactionInput {
  from_account_id: number;
  account_no: string;
  bank_name: string;
  amount: number;
  currency: string;
  user_id: number;
}

const defaultUserId = 1;

export const getAccounts = async () => {
  const res = await api.get<BankAccount[]>(`/users/${defaultUserId}/accounts`);
  return res.data;
};

export const createAccount = async (payload: BankAccount) => {
  const res = await api.post<BankAccount>(`/users/${defaultUserId}/accounts`, payload);
  return res.data;
}

export const deleteAccount = async (id: number) => {
  const res = await api.delete<BankAccount>(`/users/${defaultUserId}/accounts/${id}`);
  return res.data;
}

export const getTransactions = async (accountId?: number) => {
  const res = await api.get<Transaction[]>(`/users/${defaultUserId}/transactions`);
  if (accountId) {
    return res.data.filter(
      (tx) => tx.from_account_id === accountId || tx.to_account_id === accountId,
    );
  }
  return res.data;
};

export const createTransaction = async (payload: TransactionInput) => {
  const res = await api.post<Transaction>(`/users/${defaultUserId}/transactions`, payload);
  return res.data;
};