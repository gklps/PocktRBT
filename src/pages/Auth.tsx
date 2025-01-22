import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login, signup } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('One special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { accentColor } = useTheme();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!isLogin && newEmail) {
      setEmailError(validateEmail(newEmail) ? '' : 'Please enter a valid email address');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin && newPassword) {
      const { errors } = validatePassword(newPassword);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const { isValid, errors } = validatePassword(password);
      if (!isValid) {
        toast.error(errors[0]);
        return;
      }

      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }

      try {
        const response = await signup(email, password, name);
        if (response.did) {
          toast.success('Account created successfully! Please login.');
          setIsLogin(true);
          setPassword('');
        }
      } catch (error: any) {
        console.error('Signup error:', error);
        toast.error(error.response?.data?.error || 'Failed to create account');
      }
    } else {
      try {
        const response = await login(email, password);
        authLogin(response.token);
        navigate('/');
      } catch (error: any) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className={`bg-${accentColor}-500 w-16 h-16 rounded-2xl mb-8 mx-auto flex items-center justify-center transform rotate-45`}>
          <div className="transform -rotate-45">
            <img
              src="https://rubix.net/assets/rubixNewLogo-R7D-hBOI.png"
              alt="Rubix Logo"
              className="w-10 h-10"
            />
          </div>
        </div>
        
        <div className="bg-gray-800 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to access your wallet' : 'Get started with your Rubix wallet'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailChange}
                className={`pl-10 w-full py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all ${
                  emailError ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-400">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordChange}
                  className={`pl-10 w-full py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all ${
                    passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
              </div>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-2">
                  {passwordErrors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center text-xs text-gray-400"
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        password.length > 0 ? 'bg-red-500' : 'bg-gray-600'
                      }`} />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-${accentColor}-600 hover:bg-${accentColor}-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500 transition-colors`}
            >
              <span className="mr-2">{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
                setEmailError('');
                setPasswordErrors([]);
              }}
              className={`text-sm text-${accentColor}-400 hover:text-${accentColor}-300 transition-colors`}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;