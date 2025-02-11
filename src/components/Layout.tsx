import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Wallet, 
  QrCode, 
  SendHorizontal, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { accentColor } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Wallet, label: 'Dashboard', path: '/' },
    { icon: SendHorizontal, label: 'Send', path: '/send' },
    { icon: QrCode, label: 'Receive', path: '/receive' },
    { icon: HistoryIcon, label: 'History', path: '/history' },
    { icon: Database, label: 'Assets', path: '/assets' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-gray-900 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? `text-white bg-${accentColor}-600`
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            <button
              onClick={logout}
              className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;