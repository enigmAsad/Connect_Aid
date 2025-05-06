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
      setAppeals(appeals.filter(appeal => appeal._id !== appealId));
      setDeleteConfirmationId(null);
      alert('Appeal deleted successfully');
    } catch (err) {
      alert('Failed to delete appeal');
    }
  };

  const handleEditAppeal = (appeal: Appeal) => {
    navigate(`/edit-appeal/${appeal._id}`, { state: { appeal } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your appeals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-xl shadow-sm p-6 mb-1">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Donation Appeals
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Manage your donation appeals and help make a difference in people's lives
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-end mb-6">
            <button 
              onClick={handleCreateNewAppeal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Appeal
            </button>
          </div>

          {appeals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Appeals Created Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start making a difference by creating your first donation appeal.
                </p>
                <button 
                  onClick={handleCreateNewAppeal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Your First Appeal
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appeals.map((appeal) => (
                <div 
                  key={appeal._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <img 
                    src={`http://localhost:5000${appeal.image}`} 
                    alt={appeal.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/300';
                    }}
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {appeal.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {appeal.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-green-600">
                        ${appeal.targetAmount.toLocaleString()}
                      </span>
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {appeal.status}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEditAppeal(appeal)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span className="flex items-center justify-center">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </span>
                      </button>

                      <button 
                        onClick={() => setDeleteConfirmationId(appeal._id!)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you absolutely sure?</h2>
            <p className="mb-6 text-gray-600">
              This action cannot be undone. This will permanently delete your appeal.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteAppeal(deleteConfirmationId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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