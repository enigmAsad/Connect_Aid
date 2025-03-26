import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Heart, HandHeart, Settings, LogOut, X, Wallet } from "lucide-react";
import { fetchUserProfile } from "../services/UserService";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("User");
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUsername(profile.username || "User");
        setWalletBalance(profile.walletBalance ?? 0); // Handles undefined cases safely
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
          background: #333;
          color: white;
          display: flex;
          flex-direction: column;
          transition: left 0.3s ease-in-out;
          z-index: 50;
          padding: 15px;
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

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .user-info {
          text-align: left;
          margin-bottom: 20px;
        }

        .username {
          font-weight: bold;
          font-size: 18px;
        }

        .wallet {
          display: flex;
          align-items: center;
          gap: 5px;
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
        }

        .nav-link:hover {
          background: #555;
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
        }

        .logout-btn:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
