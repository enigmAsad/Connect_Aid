import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  msg: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<LoginResponse>('/login', {
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      // Save auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Show success message (optional)
      console.log('Login successful:', response.data.msg);

      // Redirect to profile
      navigate('/profile');
      
    } catch (error: any) {
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else if (!navigator.onLine) {
        setError('Please check your internet connection');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ConnectAid
          </h1>
          <p className="text-gray-600 mt-2">Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                pl-11 transition-all duration-200 outline-none hover:border-gray-400"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                pl-11 pr-11 transition-all duration-200 outline-none hover:border-gray-400"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg
            font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;