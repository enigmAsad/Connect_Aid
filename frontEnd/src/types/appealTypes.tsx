import { AppealCategory } from '../services/AppealService';

export interface AppealFormData {
  title: string;
  description: string;
  targetAmount: number;
  reason: string;
  image?: File | null;
  category: AppealCategory;
}

export const initialAppealFormData: AppealFormData = {
  title: '',
  description: '',
  targetAmount: 0,
  reason: '',
  image: null,
  category: 'other'
};

export interface AppealFormErrors {
  title?: string;
  description?: string;
  targetAmount?: string | number;
  reason?: string;
  image?: string;
  category?: string;
}

export const validateAppealForm = (formData: AppealFormData): { 
  isValid: boolean; 
  errors: AppealFormErrors 
} => {
  const errors: AppealFormErrors = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  }

  if (formData.targetAmount <= 0) {
    errors.targetAmount = 'Target amount must be greater than 0';
  }

  if (!formData.reason.trim()) {
    errors.reason = 'Reason is required';
  }

  // Optional: You could add category validation if needed
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};