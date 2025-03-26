import api from '../api/axios';

export interface UserProfile {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};