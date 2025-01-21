// import { useState, FormEvent } from 'react';
// import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import axios, { AxiosError } from 'axios'; // Import AxiosError type
// import api from '../api/axios';
// interface LoginResponse {
//   token: string;
//   user: {
//     id: string;
//     email: string;
//   };
//   msg: string;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post<LoginResponse>('/login', {
//         email,
//         password
//       });

//       // Store the token in localStorage
//       localStorage.setItem('token', response.data.token);
      
//       // Store user info if needed
//       localStorage.setItem('user', JSON.stringify({
//         id: response.data.user.id,
//         email: response.data.user.email
//       }));

//       // Redirect to profile page
//       navigate('/profile');
      
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message = error.response?.data?.msg || 'Invalid email or password. Please try again.';
//         setError(message);
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             ConnectAid
//           </h1>
//           <p className="text-gray-600 mt-2">Welcome back</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email address
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 pl-11 transition-all duration-200 outline-none hover:border-gray-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 required
//               />
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 pl-11 pr-11 transition-all duration-200 outline-none hover:border-gray-400"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//               />
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember" className="ml-2 block text-gray-700">
//                 Remember me
//               </label>
//             </div>
//             <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
//               Forgot password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg
//             font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg
//             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//             disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
//                 Logging in...
//               </span>
//             ) : (
//               "Log in"
//             )}
//           </button>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <button
//               type="button"
//               className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300
//               hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
//             >
//               <svg className="h-5 w-5" viewBox="0 0 24 24">
//                 {/* Google SVG paths */}
//                 <path
//                   d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12.956 16.26c-2.479 0-4.346-1.26-4.792-3.453h-3.451c.446 3.45 3.451 6.08 8.243 6.08 2.275 0 4.306-.852 5.89-2.233l-2.6-2.599c-.893.731-2.031 1.178-3.29 1.178z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M15.092 7.625l-2.6 2.599c-.893-.731-2.031-1.178-3.29-1.178a5.27 5.27 0 0 0-5.279 5.279c0 2.917 2.361 5.279 5.279 5.279 1.259 0 2.397-.447 3.29-1.178l2.6 2.599c-1.584 1.381-3.615 2.233-5.89 2.233a8.908 8.908 0 0 1-8.934-8.934c0-4.467 3.615-8.934 8.934-8.934 2.275 0 4.306.852 5.89 2.233z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               <span>Continue with Google</span>
//             </button>
//             <button
//               type="button"
//               className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300
//               hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
//             >
//               <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//               </svg>
//               <span>Continue with GitHub</span>
//             </button>
//           </div>

//           <div className="text-center text-sm text-gray-600">
//             Don't have an account?{' '}
//             <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
//               Sign up
//             </a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

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