import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';  
import Sidebar from './components/Sidebar';
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
        {/* Show Navbar only on non-dashboard pages */}
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
          
          {/* Dashboard Layout with Sidebar */}
          <Route path="/profile" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Profile />
              </div>
            </div>
          } />
          <Route path="/donate" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Donate />
              </div>
            </div>
          } />
          <Route path="/raise" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Raise />
              </div>
            </div>
          } />
          <Route path="/settings" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Settings />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;