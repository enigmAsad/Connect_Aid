import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAppeals, Appeal, AppealCategory } from '../services/AppealService';

const Donate: React.FC = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppealCategory | 'all'>('all');

  const categories: { id: AppealCategory | 'all', name: string }[] = [
    { id: 'all', name: 'All Causes' },
    { id: 'medical', name: 'Medical' },
    { id: 'education', name: 'Education' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'community', name: 'Community' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    const loadAppeals = async () => {
      try {
        setIsLoading(true);
        const fetchedAppeals = await fetchAllAppeals();
        setAppeals(fetchedAppeals);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load appeals. Please try again.');
        setIsLoading(false);
      }
    };

    loadAppeals();
  }, []);

  const calculateProgress = (currentAmount: number | undefined, targetAmount: number) => {
    return currentAmount ? (currentAmount / targetAmount) * 100 : 0;
  };

  const filteredAppeals = appeals.filter(appeal => 
    // Filter by search term
    (appeal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     appeal.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    // Filter by category (if not 'all')
    (selectedCategory === 'all' || appeal.category === selectedCategory)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading appeals...</div>
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
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-xl shadow-sm p-6 mb-1">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Make a Difference Today
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Your generosity can transform lives. Browse through active donation appeals or create your own to help those in need.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AppealCategory | 'all')}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredAppeals.length > 0 ? (
          <>
            {/* Donation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredAppeals.map(appeal => (
                <div 
                  key={appeal._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {appeal.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {appeal.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ 
                            width: `${calculateProgress(appeal.currentAmount, appeal.targetAmount)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>${(appeal.currentAmount || 0).toLocaleString()} raised</span>
                        <span>${appeal.targetAmount.toLocaleString()} goal</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/donate-appeal/${appeal._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Active Donations
              </h3>
              <p className="text-gray-600 mb-6">
                There are currently no active donation appeals. Be the first to create one and help someone in need.
              </p>
            </div>
          </div>
        )}

        {/* Create Appeal Button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/raise"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start a Donation Appeal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Donate;