import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Import AxiosError type
import api from '../api/axios';

const Raise = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    targetAmount: '',
    deadline: '',
    contactInfo: '',
    beneficiaryName: '',
    image: null as File | null,
    documents: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    'Medical',
    'Education',
    'Emergency',
    'Community',
    'Natural Disaster',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }

    if (!formData.beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const submitData = new FormData();
        
        // Add appeal data as JSON string
        submitData.append('appealData', JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          targetAmount: parseFloat(formData.targetAmount),
          deadline: formData.deadline,
          contactInfo: formData.contactInfo,
          beneficiaryName: formData.beneficiaryName
        }));

        // Add image file
        if (formData.image) {
          submitData.append('image', formData.image);
        }

        // Add document files
        formData.documents.forEach(doc => {
          submitData.append('documents', doc);
        });

        // Send request to backend using your api instance
        const response = await api.post('/api/appeals', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization header will be added by your interceptor
          }
        });

        console.log('Appeal created:', response.data);
        navigate('/donate'); // or wherever you want to redirect after success
      } catch (error) {
        console.error('Submission failed:', error);
        // Handle error appropriately
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-xl shadow-sm p-6 mb-1">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create a Donation Appeal
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Provide detailed information to start your fundraising campaign
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Category Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Appeal Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Medical Treatment for John"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Appeal Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Provide a detailed description of your appeal..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Amount and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                  Target Amount (USD) *
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${errors.targetAmount ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.targetAmount && <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>}
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Campaign Deadline *
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                Contact Information *
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.contactInfo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., john.doe@example.com"
              />
              {errors.contactInfo && <p className="mt-1 text-sm text-red-500">{errors.contactInfo}</p>}
            </div>

            {/* Beneficiary Name */}
            <div>
              <label htmlFor="beneficiaryName" className="block text-sm font-medium text-gray-700">
                Beneficiary Name *
              </label>
              <input
                type="text"
                id="beneficiaryName"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.beneficiaryName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., John Doe"
              />
              {errors.beneficiaryName && <p className="mt-1 text-sm text-red-500">{errors.beneficiaryName}</p>}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image *</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 border rounded-lg shadow-sm"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Image Preview" className="max-w-xs" />
                </div>
              )}
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Supporting Documents (Optional)
              </label>
              <input
                type="file"
                multiple
                onChange={handleDocumentsChange}
                className="mt-1 block w-full text-sm text-gray-500 border rounded-lg shadow-sm"
              />
              <div className="mt-2">
                {formData.documents.map((file, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex justify-center py-2 px-6 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Raise;
