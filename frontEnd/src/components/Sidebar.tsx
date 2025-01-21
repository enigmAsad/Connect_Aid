import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Heart, HandHeart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add the useNavigate hook

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
    // Add any logout logic here, e.g., clearing tokens or user data
    console.log('Logout clicked');
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-screen pt-5 overflow-y-auto bg-gradient-to-b from-indigo-600 via-purple-500 to-pink-500 shadow-lg">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-200">ConnectAid</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm ${
                  location.pathname === item.path
                    ? 'text-white bg-purple-600 shadow-md hover:bg-purple-700 hover:scale-105'
                    : 'text-gray-100 hover:text-white hover:bg-purple-500 hover:scale-105'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Logout button at the bottom */}
            <button
              onClick={handleLogout} // Use the handleLogout function
              className="flex items-center px-4 py-3 mt-10 text-sm font-semibold text-gray-100 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 w-full shadow-md hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
