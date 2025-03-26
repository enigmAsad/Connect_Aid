import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import Layout from './components/UserLayout';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import Raise from './pages/Raise';
import Appeal from './pages/CreateAppealPage';
import EditAppeal from './pages/EditAppealPage';
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
              //<ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
              //</ProtectedRoute>
            } 
          />
          <Route
            path="/donate"
            element={
              //<ProtectedRoute>
                <Layout>
                  <Donate />
                </Layout>
              //</ProtectedRoute>
            }
          />
          <Route
            path="/raise"
            element={
              //<ProtectedRoute>
                <Layout>
                  <Raise />
                </Layout>
              //</ProtectedRoute>
            }
          />
          <Route 
            path="/create-appeal" 
            element={
              //<ProtectedRoute>
                  <Layout>
                    <Appeal />
                  </Layout>
              //</ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-appeal/:id" 
            element={
              //<ProtectedRoute>
                  <Layout>
                    <EditAppeal />
                  </Layout>
              //</ProtectedRoute>
            } 
          />
          <Route
            path="/settings"
            element={
              //<ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              //</ProtectedRoute>
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