import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Heart, HandHeart, Settings, LogOut, X, Wallet } from "lucide-react";
import { fetchUserProfile } from "../services/UserService";
import { BalanceService } from "../services/BalanceService";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("User");
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Fetch user profile for username
        const profile = await fetchUserProfile();
        // Convert username to Title Case
        const titleCaseName = profile.username 
          ? profile.username.split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ') 
          : "User";
        setUsername(titleCaseName);
        
        // Fetch balance using BalanceService
        const balance = await BalanceService.fetchBalance();
        setWalletBalance(balance);
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    };

    loadUserProfile();
  }, []);

  const navItems = [
    { path: "/profile", name: "Profile", icon: <User size={20} /> },
    { path: "/donate", name: "Donate", icon: <Heart size={20} /> },
    { path: "/raise", name: "Raise", icon: <HandHeart size={20} /> },
    { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>ConnectAid</h1>
          <button onClick={toggleSidebar} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="user-info">
          <p>Welcome,</p>
          <p className="username">{username}</p>
          <div className="wallet">
            <Wallet size={18} />
            <span>${walletBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="nav-link" onClick={toggleSidebar}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Sidebar Styles */}
      <style>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -250px;
          width: 250px;
          height: 100vh;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: left 0.3s ease-in-out;
          z-index: 50;
          padding: 15px;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sidebar-header h1 {
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .user-info {
          text-align: left;
          margin-bottom: 20px;
          padding: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .username {
          font-weight: bold;
          font-size: 18px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .wallet {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          text-decoration: none;
          color: white;
          cursor: pointer;
          border-radius: 6px;
          margin-bottom: 5px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-top: 20px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ff6b6b;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
