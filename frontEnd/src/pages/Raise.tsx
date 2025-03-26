import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserAppeals, deleteAppeal } from '../services/AppealService';
import { Appeal } from '../services/AppealService';
import { Trash2, Edit } from 'lucide-react';

const Raise: React.FC = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppeals = async () => {
      try {
        setIsLoading(true);
        const userAppeals = await fetchUserAppeals();
        setAppeals(userAppeals);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load appeals. Please try again.');
        setIsLoading(false);
      }
    };

    loadAppeals();
  }, []);

  const handleCreateNewAppeal = () => {
    navigate('/create-appeal');
  };

  const handleDeleteAppeal = async (appealId: string) => {
    try {
      await deleteAppeal(appealId);
      // Remove the deleted appeal from the list
      setAppeals(appeals.filter(appeal => appeal._id !== appealId));
      setDeleteConfirmationId(null);
      alert('Appeal deleted successfully');
    } catch (err) {
      alert('Failed to delete appeal');
    }
  };

  const handleEditAppeal = (appeal: Appeal) => {
    // Navigate to edit page with appeal details
    navigate(`/edit-appeal/${appeal._id}`, { state: { appeal } });
  };

  if (isLoading) {
    return <div>Loading your appeals...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Donation Appeals</h1>
        <button 
          onClick={handleCreateNewAppeal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Appeal
        </button>
      </div>

      {appeals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">You haven't created any appeals yet.</p>
          <button 
            onClick={handleCreateNewAppeal}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Your First Appeal
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appeals.map((appeal) => (
            <div 
              key={appeal._id} 
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <img 
                src={`http://localhost:5000${appeal.image}`} 
                alt={appeal.title} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = '/api/placeholder/400/300';
                }}
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{appeal.title}</h2>
                <p className="text-gray-600 mb-2 truncate">{appeal.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-600 font-bold">
                    ${appeal.targetAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {appeal.status}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between space-x-2">
                  {/* Edit Button */}
                  <button 
                    onClick={() => handleEditAppeal(appeal)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <span className="flex items-center justify-center">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </span>
                  </button>

                  {/* Delete Button with Confirmation */}
                  <button 
                    onClick={() => setDeleteConfirmationId(appeal._id!)}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <span className="flex items-center justify-center">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Are you absolutely sure?</h2>
            <p className="mb-6 text-gray-600">
              This action cannot be undone. This will permanently delete your appeal.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteAppeal(deleteConfirmationId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Raise;