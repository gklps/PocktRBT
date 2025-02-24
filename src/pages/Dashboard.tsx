import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getBalance } from '../api';
import { User, AccountInfo } from '../types';

const Dashboard = () => {
  const { token, user } = useAuth();
  const { accentColor } = useTheme();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!token || !user?.did) return;

      try {
        setLoading(true);
        const balanceData = await getBalance(user.did, token);
        if ('error' in balanceData) {
          toast.error(balanceData.error || 'Failed to fetch balance');
          return;
        }
        if (balanceData.status && balanceData.result && balanceData.result.length > 0) {
          setBalance(balanceData.result[0].rbt_amount);
        }
      } catch (error: any) {
        console.error('Failed to fetch balance:', error);
        toast.error(error.message || 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [token, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
        <div className={`bg-${accentColor}-50 rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wallet className={`h-6 w-6 text-${accentColor}-600 mr-2`} />
              <span className="text-lg font-medium">Your Balance</span>
            </div>
            <span className="text-2xl font-bold">
              {balance.toFixed(3)} RBT
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/send')}
              className={`flex items-center justify-center space-x-2 p-3 bg-${accentColor}-50 rounded-lg border border-${accentColor}-200 hover:bg-${accentColor}-100 transition-all duration-200`}
            >
              <ArrowUpRight className={`h-5 w-5 text-${accentColor}-600`} />
              <span>Send</span>
            </button>
            <button
              onClick={() => navigate('/receive')}
              className={`flex items-center justify-center space-x-2 p-3 bg-${accentColor}-50 rounded-lg border border-${accentColor}-200 hover:bg-${accentColor}-100 transition-all duration-200`}
            >
              <ArrowDownLeft className={`h-5 w-5 text-${accentColor}-600`} />
              <span>Receive</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Wallet Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">DID</label>
            <p className="text-gray-900 font-mono text-sm break-all">{user?.did}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;