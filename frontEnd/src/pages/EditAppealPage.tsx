import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  AppealCategory, 
  Appeal
} from '../services/AppealService';
import { updateAppeal, fetchAppealById } from '../services/AppealService';
import { toast } from 'sonner';

// Updated interface to include category
interface AppealFormData {
  title: string;
  description: string;
  targetAmount: number;
  reason?: string;
  image: File | null;
  category: AppealCategory;
}

// Updated initial form data
const initialAppealFormData: AppealFormData = {
  title: '',
  description: '',
  targetAmount: 0,
  reason: '',
  image: null,
  category: 'other'
};

// Categories list for dropdown
const APPEAL_CATEGORIES: AppealCategory[] = [
  'medical', 
  'education', 
  'emergency', 
  'community', 
  'other'
];

// Form validation function
const validateAppealForm = (formData: AppealFormData) => {
  const errors: { [key: string]: string } = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  }

  if (formData.targetAmount <= 0) {
    errors.targetAmount = 'Target amount must be greater than zero';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const EditAppealPage: React.FC = () => {
  const [formData, setFormData] = useState<AppealFormData>(initialAppealFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  useEffect(() => {
    const loadAppeal = async () => {
      try {
        // First try to get appeal from navigation state
        const stateAppeal = location.state?.appeal as Appeal;
        
        if (stateAppeal) {
          // If appeal is passed through navigation state
          setFormData({
            title: stateAppeal.title,
            description: stateAppeal.description,
            targetAmount: stateAppeal.targetAmount,
            reason: '', // Reset reason as it's not part of Appeal model
            image: null,
            category: stateAppeal.category
          });
          setIsLoading(false);
        } else if (id) {
          // If no state, fetch appeal by ID
          const appeal = await fetchAppealById(id);
          setFormData({
            title: appeal.title,
            description: appeal.description,
            targetAmount: appeal.targetAmount,
            reason: '', // Reset reason as it's not part of Appeal model
            image: null,
            category: appeal.category
          });
          setIsLoading(false);
        } else {
          // No appeal found
          toast.error('Appeal not found');
          navigate('/raise');
        }
      } catch (error) {
        toast.error('Failed to load appeal');
        navigate('/raise');
      }
    };

    loadAppeal();
  }, [id, navigate, location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Safely handle null and empty FileList
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]  // Use non-null assertion after checking
      }));
    } else {
      // Reset image if no file is selected
      setFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = validateAppealForm(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Create FormData for file upload
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('targetAmount', formData.targetAmount.toString());
    formPayload.append('category', formData.category);
    
    if (formData.image) {
      formPayload.append('image', formData.image);
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Update appeal with ID
      await updateAppeal(id!, formPayload);
      
      // Show success toast and redirect
      toast.success('Appeal updated successfully');
      navigate('/raise');
    } catch (error) {
      setSubmitError('Failed to update appeal. Please try again.');
      setIsSubmitting(false);
      toast.error('Failed to update appeal');
    }
  };

  if (isLoading) {
    return <div>Loading appeal details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Donation Appeal</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Appeal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter a compelling title for your appeal"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            rows={4}
            placeholder="Provide details about your appeal"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="targetAmount" className="block mb-2">Target Amount ($)</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded ${errors.targetAmount ? 'border-red-500' : ''}`}
            placeholder="How much are you trying to raise?"
            min="0"
            step="0.01"
          />
          {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block mb-2">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            {APPEAL_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block mb-2">Update Appeal Image (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Select a new image to replace the current one
          </p>
        </div>

        {submitError && (
          <div className="mb-4 text-red-500 text-center">
            {submitError}
          </div>
        )}

        <div className="flex justify-between">
          <button 
            type="button"
            onClick={() => navigate('/raise')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Appeal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppealPage;