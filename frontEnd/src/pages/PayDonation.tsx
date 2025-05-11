import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAppealById } from '../services/AppealService';
import { Appeal } from '../services/AppealService';
import { BalanceService } from '../services/BalanceService';
import api from '../api/axios';

const PayDonation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) {
          throw new Error('No appeal ID provided');
        }
        const fetchedAppeal = await fetchAppealById(id);
        setAppeal(fetchedAppeal);

        const balance = await BalanceService.fetchBalance();
        setUserBalance(balance);

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load appeal details or balance');
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const calculateProgress = (currentAmount: number | undefined, targetAmount: number) => {
    return currentAmount ? (currentAmount / targetAmount) * 100 : 0;
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id || !appeal) {
      setError('Invalid appeal');
      return;
    }

    // Validate donation amount
    if (donationAmount <= 0) {
      setError('Donation amount must be greater than zero');
      return;
    }

    // Check if donation amount exceeds user balance
    if (donationAmount > userBalance) {
      // Show alert when donation amount exceeds balance
      alert(`Insufficient balance. Your current balance is $${userBalance.toLocaleString()}. 
Please top up your balance or reduce the donation amount.`);
      return;
    }

    try {
      // Deduct balance first
      await BalanceService.deductBalance(donationAmount);

      // Update the appeal with the new donation amount
      await api.post(`/donations/${id}`, { 
        amount: donationAmount 
      });

      // Show success message and redirect
      alert(`Thank you for your donation of $${donationAmount}!`);
      navigate('/donate');
    } catch (err) {
      setError('Failed to process donation. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading appeal details...</div>
      </div>
    );
  }

  if (error || !appeal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Appeal not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Appeal Image */}
        <img
          src={appeal.image?.startsWith('http') ? appeal.image : appeal.image}
          alt={appeal.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/400/300';
          }}
        />

        {/* Appeal Details */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {appeal.title}
          </h1>

          <p className="text-gray-600 mb-6">
            {appeal.description}
          </p>

          {/* User Balance */}
          <div className="mb-4 text-gray-700">
            Your Current Balance: <span className="font-bold">${userBalance.toLocaleString()}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
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

          {/* Donation Form */}
          <form onSubmit={handleDonationSubmit} className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Make a Donation
            </h2>

            <div className="mb-4">
              <label htmlFor="donationAmount" className="block text-gray-700 mb-2">
                Donation Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  id="donationAmount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
                  min="1"
                  max={userBalance}
                  step="1"
                  placeholder="Enter donation amount"
                  className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Maximum donation: ${userBalance.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Donate Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayDonation;