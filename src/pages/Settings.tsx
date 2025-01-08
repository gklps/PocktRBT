import React from 'react';
import { toast } from 'react-hot-toast';
import { Moon, Sun, Palette, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { registerDid } from '../api';

const Settings = () => {
  const { token, user } = useAuth();
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const [isRegistering, setIsRegistering] = React.useState(false);

  const handleRegisterDid = async () => {
    if (!token || !user?.did) return;

    setIsRegistering(true);
    try {
      const response = await registerDid(user.did, token);
      if (response === 'DID registered successfully') {
        toast.success('DID registered successfully');
      } else {
        toast.error(response.error || 'Failed to register DID');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to register DID');
    } finally {
      setIsRegistering(false);
    }
  };

  const colors = [
    { name: 'yellow', class: 'bg-yellow-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'red', class: 'bg-red-500' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>
        
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? (
                <Sun className="h-5 w-5 dark:text-white" />
              ) : (
                <Moon className="h-5 w-5 dark:text-white" />
              )}
              <div>
                <p className="font-medium dark:text-white">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch between light and dark mode
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Accent Color */}
          <div className="p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="h-5 w-5 dark:text-white" />
              <div>
                <p className="font-medium dark:text-white">Accent Color</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred accent color
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {colors.map(({ name, class: bgClass }) => (
                <button
                  key={name}
                  onClick={() => setAccentColor(name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    accentColor === name ? 'border-black dark:border-white' : 'border-transparent'
                  } ${bgClass}`}
                  aria-label={`Set ${name} as accent color`}
                />
              ))}
            </div>
          </div>

          {/* Register DID */}
          <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 dark:text-white" />
              <div>
                <p className="font-medium dark:text-white">Register DID</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register your DID with the network
                </p>
              </div>
            </div>
            <button
              onClick={handleRegisterDid}
              disabled={isRegistering}
              className={`px-4 py-2 text-white rounded-md disabled:opacity-50 bg-${accentColor}-600 hover:bg-${accentColor}-700`}
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;