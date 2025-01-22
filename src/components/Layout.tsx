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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="bg-gray-800 rounded-lg p-2">
            <img
              src="https://rubix.net/assets/rubixNewLogo-R7D-hBOI.png"
              alt="Rubix Logo"
              className="h-8"
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-gray-900 z-40">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 w-full p-3 rounded transition-colors ${
                    active
                      ? `bg-${accentColor}-600 text-white`
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full p-3 rounded text-red-400 hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-4 h-full flex flex-col">
          <div className="bg-gray-800 rounded-lg p-2 mb-8">
            <img
              src="https://rubix.net/assets/rubixNewLogo-R7D-hBOI.png"
              alt="Rubix Logo"
              className="h-8"
            />
          </div>
          <nav className="space-y-2 flex-grow">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 w-full p-3 rounded transition-colors ${
                    active
                      ? `bg-${accentColor}-600 text-white`
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full p-3 rounded text-red-400 hover:bg-gray-800 mt-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;