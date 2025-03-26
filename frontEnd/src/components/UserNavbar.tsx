import { Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="navbar">
      {/* Hamburger Icon */}
      <button onClick={toggleSidebar} className="menu-btn">
        <Menu size={24} />
      </button>
      <h1 className="title">Dashboard</h1>

      {/* Navbar Styles */}
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background: #222;
          color: white;
        }

        .menu-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .menu-btn:hover {
          opacity: 0.8;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}
