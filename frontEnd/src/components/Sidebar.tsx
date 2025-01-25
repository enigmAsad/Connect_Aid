import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Heart, HandHeart, Settings, LogOut, X, Wallet } from 'lucide-react';
import { fetchUserProfile } from '../services/UserService';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUsername(profile.username);
        // Placeholder for wallet balance - you'll implement the actual fetch later
        setWalletBalance(profile.walletBalance || 0);
      } catch (error) {
        console.error('Failed to load user profile', error);
      }
    };

    loadUserProfile();
  }, []);

  const navItems = [
    {
      path: '/profile',
      name: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      path: '/donate',
      name: 'Donate',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      path: '/raise',
      name: 'Raise',
      icon: <HandHeart className="w-5 h-5" />,
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile and Tablet Overlay Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50"
          onClick={onToggleSidebar} 
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-indigo-600 via-purple-500 to-pink-500 shadow-lg">
            <div className="flex items-center justify-between flex-shrink-0 px-4 py-4">
              <h1 className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-200">
                ConnectAid
              </h1>
              <button 
                onClick={onToggleSidebar}
                className="md:hidden text-white hover:text-gray-200 transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Welcome and Wallet Balance */}
            <div className="px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Welcome,</p>
                  <p className="text-lg font-semibold">{username || 'User'}</p>
                </div>
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">
                    ${walletBalance !== null ? walletBalance.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex-1 space-y-2 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm
                    ${
                      location.pathname === item.path
                        ? 'text-white bg-purple-600 shadow-md hover:bg-purple-700 hover:scale-105'
                        : 'text-gray-100 hover:text-white hover:bg-purple-500 hover:scale-105'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Logout button at the bottom */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 mt-10 text-sm font-semibold text-gray-100 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 w-full shadow-md hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;