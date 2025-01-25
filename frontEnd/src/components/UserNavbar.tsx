import React from 'react';
import { useState } from 'react';
import { Menu, X, Wallet, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the prop types
export interface NavbarProps {
  username?: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

// Explicitly type the component
const UserNavbar: React.FC<NavbarProps> = ({ 
  username = 'User', 
  onToggleSidebar, 
  isSidebarOpen 
}) => {
  const navigate = useNavigate();
  const [balance] = useState('0.00');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu toggle and Logo */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            
            {/* Logo - visible only on mobile when sidebar is closed */}
            <div className="lg:hidden ml-2">
              <h1 className="text-xl font-bold text-gray-800">ConnectAid</h1>
            </div>
          </div>

          {/* Center - Welcome Message */}
          <div className="hidden sm:flex items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Welcome, <span className="text-indigo-600">{username}</span>
            </h2>
          </div>

          {/* Right side - Balance and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-gray-700">
                ${balance}
              </span>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;