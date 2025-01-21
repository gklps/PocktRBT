import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import { Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Receive = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!user?.did) return;
    
    try {
      await navigator.clipboard.writeText(user.did);
      setCopied(true);
      toast.success('DID copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy DID');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Receive RBT</h1>
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white p-4 rounded-lg">
            {user?.did && <QRCode value={user.did} size={200} />}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your DID (Wallet Address)
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={user?.did || ''}
                className="flex-1 block w-full rounded-l-md border-gray-300 bg-gray-50 focus:ring-0 focus:border-gray-300"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-yellow-300 text-sm font-medium rounded-r-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Share your DID with others to receive RBT tokens
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;