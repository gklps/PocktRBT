import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTransactionHistory } from '../api';
const ITEMS_PER_PAGE = 5;
const History = () => {
    const { token, user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || !user?.did)
                return;
            try {
                // Format dates manually since we removed date-fns dependency
                const startDate = '2020-01-01';
                const endDate = new Date().toISOString().split('T')[0];
                const [sentTxns, receivedTxns] = await Promise.all([
                    getTransactionHistory(user.did, 'Sender', startDate, endDate, token),
                    getTransactionHistory(user.did, 'Receiver', startDate, endDate, token),
                ]);
                const allTransactions = [
                    ...(sentTxns.TxnDetails || []),
                    ...(receivedTxns.TxnDetails || []),
                ].sort((a, b) => new Date(b.DateTime).getTime() - new Date(a.DateTime).getTime());
                setTransactions(allTransactions);
            }
            catch (error) {
                console.error('Failed to fetch transaction history:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token, user]);
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = transactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    if (loading) {
        return (<div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-20 bg-gray-200 rounded"></div>))}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <div className="space-y-4">
          {paginatedTransactions.map((tx) => {
            const isSender = tx.SenderDID === user?.did;
            return (<div key={tx.TransactionID} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isSender ? (<ArrowUpRight className="h-5 w-5 text-red-500"/>) : (<ArrowDownLeft className="h-5 w-5 text-green-500"/>)}
                    <div>
                      <p className="font-medium">
                        {isSender ? 'Sent to' : 'Received from'}:{' '}
                        <span className="font-mono text-sm">
                          {isSender ? tx.ReceiverDID : tx.SenderDID}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.DateTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isSender ? 'text-red-500' : 'text-green-500'}`}>
                      {isSender ? '-' : '+'}{tx.Amount} RBT
                    </p>
                    <p className="text-xs text-gray-500">ID: {tx.TransactionID.slice(0, 8)}...</p>
                  </div>
                </div>
              </div>);
        })}
        </div>

        {totalPages > 1 && (<div className="flex justify-center space-x-2 mt-6">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>)}
      </div>
    </div>);
};
export default History;
