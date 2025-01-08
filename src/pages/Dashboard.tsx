import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile, getBalance } from '../api';
import { User, Balance } from '../types';

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const userData = await getProfile(token);
          setUser(userData);
          const balanceData = await getBalance(userData.did, token);
          setBalance(balanceData);
        }
      } catch (error) {
        toast.error('Failed to fetch wallet data');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-lg font-medium">Your Balance</span>
            </div>
            <span className="text-2xl font-bold">
              {balance?.account_info[0]?.rbt_amount.toFixed(3) || '0'} RBT
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/send')}
              className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-50"
            >
              <ArrowUpRight className="h-5 w-5 text-yellow-600" />
              <span>Send</span>
            </button>
            <button
              onClick={() => navigate('/receive')}
              className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-50"
            >
              <ArrowDownLeft className="h-5 w-5 text-yellow-600" />
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;