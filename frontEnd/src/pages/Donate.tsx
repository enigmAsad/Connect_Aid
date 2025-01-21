import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Donate = () => {
  // Sample donation data - replace with real data from your backend
  const [donations] = useState([
    {
      id: 1,
      title: "Medical Treatment Support",
      description: "Help John with his urgent medical treatment expenses",
      image: "",
      goal: 5000,
      raised: 3200,
      daysLeft: 15
    },
    {
      id: 2,
      title: "Education Fund",
      description: "Support Sarah's college education dreams",
      image: "",
      goal: 10000,
      raised: 4500,
      daysLeft: 30
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Causes' },
    { id: 'medical', name: 'Medical' },
    { id: 'education', name: 'Education' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'community', name: 'Community' }
  ];

  const calculateProgress = (raised: number, goal: number) => {
    return (raised / goal) * 100;
  };

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

        {/* Search and Filter Section */}
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

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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

        {donations.length > 0 ? (
          <>
            {/* Donation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {donations.map(donation => (
                <div key={donation.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
                  <img
                    src={donation.image}
                    alt={donation.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {donation.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {donation.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${calculateProgress(donation.raised, donation.goal)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>${donation.raised.toLocaleString()} raised</span>
                        <span>${donation.goal.toLocaleString()} goal</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {donation.daysLeft} days left
                      </span>
                      <Link
                        to={`/donate/${donation.id}`}
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