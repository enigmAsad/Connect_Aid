import { Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="user-navbar">
      {/* Hamburger Icon */}
      <div className="user-navbar-container">
        <div className="user-navbar-content">
          <button onClick={toggleSidebar} className="menu-btn">
            <Menu size={24} />
          </button>
          <div className="logo-text">
            Connect<span className="text-pink-500">Aid</span>
          </div>
        </div>
      </div>

      {/* Navbar Styles */}
      <style>{`
        .user-navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          transition: all 0.3s;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
        }

        .user-navbar-container {
          max-width: 1280px;
          margin: 0;
          padding: 0;
        }

        .user-navbar-content {
          display: flex;
          align-items: center;
          height: 4rem;
          padding-left: 1rem;
        }

        .menu-btn {
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

        .menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .logo-text {
          font-size: 1.875rem;
          font-weight: bold;
          color: white;
          margin-left: 0.75rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.025em;
        }
      `}</style>
    </nav>
  );
}
