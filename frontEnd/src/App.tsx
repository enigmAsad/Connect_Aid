import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import Raise from './pages/Raise';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
            </>
          } />
          <Route path="/signup" element={
            <>
              <Navbar />
              <SignUp />
            </>
          } />

          {/* Protected Routes with Sidebar */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={toggleSidebar} 
                  />
                  <div className="flex-1 p-4 md:ml-64">
                    <Profile />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={toggleSidebar} 
                  />
                  <div className="flex-1 p-4 md:ml-64">
                    <Donate />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/raise" 
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={toggleSidebar} 
                  />
                  <div className="flex-1 p-4 md:ml-64">
                    <Raise />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={toggleSidebar} 
                  />
                  <div className="flex-1 p-4 md:ml-64">
                    <Settings />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;