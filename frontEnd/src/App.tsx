import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/UserLayout';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import Raise from './pages/Raise';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
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

          {/* Dashboard Layout with Layout Component */}
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/donate" element={
            <Layout>
              <Donate />
            </Layout>
          } />
          <Route path="/raise" element={
            <Layout>
              <Raise />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;