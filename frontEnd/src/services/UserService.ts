import api from '../api/axios';

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/details');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};