import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { sendTokens } from '../api';
import { MessageSquare } from 'lucide-react';

const Send = () => {
  const { token, user } = useAuth();
  const { accentColor } = useTheme();
  const [receiverDid, setReceiverDid] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.did || !token) return;

    setIsLoading(true);
    setTransactionResult(null);
    try {
      const response = await sendTokens(
        user.did,
        receiverDid,
        parseFloat(amount),
        token,
        comment || undefined,
        2 // Default quorum type
      );
      
      if ('error' in response) {
        toast.error(response.error || 'Transaction failed');
        setTransactionResult(JSON.stringify(response, null, 2));
      } else if (response.status) {
        toast.success(response.message || 'Transaction completed successfully');
        setTransactionResult(JSON.stringify(response, null, 2));
        setReceiverDid('');
        setAmount('');
        setComment('');
        setShowComment(false);
      } else {
        toast.error(response.message || 'Transaction failed');
        setTransactionResult(JSON.stringify(response, null, 2));
      }
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
      setTransactionResult(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Send RBT</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="receiverDid" className="block text-sm font-medium text-gray-700">
              Receiver DID
            </label>
            <input
              id="receiverDid"
              type="text"
              required
              value={receiverDid}
              onChange={(e) => setReceiverDid(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder="Enter receiver's DID"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (RBT)
            </label>
            <input
              id="amount"
              type="number"
              step="0.001"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder="0.000"
            />
          </div>
          
          {!showComment ? (
            <button
              type="button"
              onClick={() => setShowComment(true)}
              className={`flex items-center text-${accentColor}-600 text-sm`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add a comment
            </button>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowComment(false);
                    setComment('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                placeholder="Add a comment to this transaction"
                rows={2}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${accentColor}-600 hover:bg-${accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500 disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : 'Send RBT'}
          </button>
        </form>

        {transactionResult && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Transaction Result:</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              {transactionResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Send;