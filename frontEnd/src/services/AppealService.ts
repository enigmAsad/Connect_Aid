import api from '../api/axios';

export type AppealCategory = 'medical' | 'education' | 'emergency' | 'community' | 'other';

export interface Appeal {
  _id?: string;
  user: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount?: number;
  image?: string;
  category: AppealCategory;
  status?: 'active' | 'completed' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export const createAppeal = async (appealData: FormData): Promise<Appeal> => {
  try {
    const response = await api.post('/appeals', appealData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create appeal:', error);
    throw error;
  }
};

export const fetchUserAppeals = async (): Promise<Appeal[]> => {
  try {
    const response = await api.get('/appeals/my-appeals');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user appeals:', error);
    throw error;
  }
};

export const fetchAllAppeals = async (): Promise<Appeal[]> => {
  try {
    const response = await api.get('/appeals');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appeals:', error);
    throw error;
  }
};

export const deleteAppeal = async (appealId: string): Promise<void> => {
  try {
    await api.delete(`/appeals/${appealId}`);
  } catch (error) {
    console.error('Failed to delete appeal:', error);
    throw error;
  }
};

export const fetchAppealById = async (appealId: string): Promise<Appeal> => {
  try {
    console.log(`Fetching appeal with ID: ${appealId}`);
    
    const response = await api.get(`/appeals/${appealId}`);
    
    console.log('Fetch appeal response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Detailed fetch appeal error:', {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const updateAppeal = async (appealId: string, appealData: FormData): Promise<Appeal> => {
  try {
    const response = await api.put(`/appeals/${appealId}`, appealData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update appeal:', error);
    throw error;
  }
};