import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength indicators
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  
  //   if (!passwordsMatch) {
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   try {
  //     const response = await api.post('/signup', {
  //       email,
  //       password
  //     });
      
  //     console.log("Signup successful:", response.data);
  //     alert("Account created successfully!");
      
  //     // Optionally redirect to login page
  //     // window.location.href = '/login';
      
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       const message = error.response?.data?.msg || "Something went wrong. Please try again.";
  //       console.error("Signup error:", message);
  //       console.error("Signup error:", error.response);

  //       alert(message);
  //     } else {
  //       console.error("Signup error:", error);
  //       alert("Something went wrong. Please try again.");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!passwordsMatch) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await api.post('/signup', {
        email,
        password
      });
  
      console.log('Signup successful:', response.data);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      alert('Account created successfully!');
      // Redirect if needed
      // window.location.href = '/login';
  
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.msg || 'Something went wrong. Please try again.';
        console.error('Signup error:', message);
        alert(message);
      } else {
        console.error('Unexpected error:', error);
        alert('Something went wrong. Please try again.');
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
          <p className="text-gray-600 mt-2">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                pl-11 transition-all duration-200 outline-none hover:border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                pl-11 pr-11 transition-all duration-200 outline-none hover:border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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

            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {hasLength ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-gray-400" size={16} />
                )}
                <span className={hasLength ? "text-green-500" : "text-gray-500"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasUpperCase ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-gray-400" size={16} />
                )}
                <span className={hasUpperCase ? "text-green-500" : "text-gray-500"}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasNumber ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-gray-400" size={16} />
                )}
                <span className={hasNumber ? "text-green-500" : "text-gray-500"}>
                  One number
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasSpecial ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-gray-400" size={16} />
                )}
                <span className={hasSpecial ? "text-green-500" : "text-gray-500"}>
                  One special character
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                pl-11 pr-11 transition-all duration-200 outline-none hover:border-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                {passwordsMatch ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <AlertCircle className="text-red-500" size={16} />
                )}
                <span className={passwordsMatch ? "text-green-500" : "text-red-500"}>
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg
            font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !passwordsMatch || !hasLength || !hasNumber || !hasSpecial || !hasUpperCase}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;