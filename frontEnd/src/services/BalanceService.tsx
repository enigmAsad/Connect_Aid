import api from '../api/axios';

export interface BalanceResponse {
  balance: number;
  message?: string;
}

export const BalanceService = {
  // Fetch user balance
  fetchBalance: async (): Promise<number> => {
    try {
      const response = await api.get<BalanceResponse>('/api/user/balance');
      return response.data.balance;
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw error;
    }
  },

  // Top up balance
  topUpBalance: async (amount: number): Promise<number> => {
    try {
      const response = await api.post<BalanceResponse>('/api/user/balance/topup', { amount });
      return response.data.balance;
    } catch (error) {
      console.error('Failed to top up balance:', error);
      throw error;
    }
  },

  // Deduct balance (for purchases)
  deductBalance: async (amount: number): Promise<number> => {
    try {
      const response = await api.post<BalanceResponse>('/api/user/balance/deduct', { amount });
      return response.data.balance;
    } catch (error) {
      console.error('Failed to deduct balance:', error);
      throw error;
    }
  }
};