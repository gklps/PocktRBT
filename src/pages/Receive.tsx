import React from 'react';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';

const Receive = () => {
  const { user } = useAuth();

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
                className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(user?.did || '')}
                className="ml-2 inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              >
                Copy
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