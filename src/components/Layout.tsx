import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, QrCode, SendHorizontal, History, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { accentColor } = useTheme();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <img
            src="https://learn.rubix.net/images/logo_name.png"
            alt="Rubix Logo"
            className="h-8 mb-8"
          />
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-${accentColor}-50 text-gray-700 dark:text-gray-200`}
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </button>
            <button
              onClick={() => navigate('/receive')}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-${accentColor}-50 text-gray-700 dark:text-gray-200`}
            >
              <QrCode className="h-5 w-5" />
              <span>Receive</span>
            </button>
            <button
              onClick={() => navigate('/send')}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-${accentColor}-50 text-gray-700 dark:text-gray-200`}
            >
              <SendHorizontal className="h-5 w-5" />
              <span>Send</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-${accentColor}-50 text-gray-700 dark:text-gray-200`}
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-${accentColor}-50 text-gray-700 dark:text-gray-200`}
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full p-2 rounded hover:bg-red-50 text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 dark:bg-gray-900">{children}</main>
    </div>
  );
};

export default Layout;