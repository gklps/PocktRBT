import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Wallet, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllNFTs, getAllFTs, transferFT } from '../api';
const Assets = () => {
    const { token, user } = useAuth();
    const { accentColor } = useTheme();
    const [activeTab, setActiveTab] = useState('NFT');
    const [nfts, setNfts] = useState([]);
    const [fts, setFts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFT, setSelectedFT] = useState(null);
    const [transferData, setTransferData] = useState({
        receiverDid: '',
        ftCount: 1,
    });
    useEffect(() => {
        if (token && user?.did) {
            if (activeTab === 'NFT') {
                fetchNFTs();
            }
            else if (activeTab === 'FT') {
                fetchFTs();
            }
        }
    }, [token, user?.did, activeTab]);
    const fetchNFTs = async () => {
        if (!token || !user?.did)
            return;
        setLoading(true);
        try {
            const response = await getAllNFTs(user.did, token);
            setNfts(response.nfts || []);
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch NFTs');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchFTs = async () => {
        if (!token || !user?.did)
            return;
        setLoading(true);
        try {
            const response = await getAllFTs(user.did, token);
            setFts(response.ft_info || []);
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch FTs');
        }
        finally {
            setLoading(false);
        }
    };
    const handleTransferFT = async (e) => {
        e.preventDefault();
        if (!token || !user?.did || !selectedFT)
            return;
        try {
            const params = {
                sender: user.did,
                receiver: transferData.receiverDid,
                ft_count: transferData.ftCount,
                ft_name: selectedFT.ft_name,
                creatorDID: selectedFT.creator_did,
                quorum_type: 2,
            };
            const response = await transferFT(params, token);
            toast.success('FT transferred successfully');
            setSelectedFT(null);
            setTransferData({ receiverDid: '', ftCount: 1 });
            fetchFTs();
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to transfer FT');
        }
    };
    return (<div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Digital Assets</h1>
        
        {/* Asset Type Selector */}
        <div className="flex space-x-2 mb-6">
          {['NFT', 'FT', 'Smart Contracts'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab
                ? `bg-${accentColor}-600 text-white`
                : `bg-gray-100 hover:bg-${accentColor}-50`}`}>
              {tab}
            </button>))}
        </div>

        {/* NFTs Section */}
        {activeTab === 'NFT' && (<div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your NFTs</h2>
            {loading ? (<div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (<div key={i} className="h-20 bg-gray-100 rounded-lg"></div>))}
              </div>) : nfts.length > 0 ? (<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {nfts.map((nft) => (<div key={nft.nft} className={`p-4 border border-${accentColor}-200 rounded-lg bg-${accentColor}-50`}>
                    <p className="font-mono text-sm mb-2">NFT ID: {nft.nft}</p>
                    <p className="text-sm text-gray-600">Value: {nft.nft_value}</p>
                  </div>))}
              </div>) : (<p className="text-gray-500">No NFTs found</p>)}
          </div>)}

        {/* FTs Section */}
        {activeTab === 'FT' && (<div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your FTs</h2>
            {loading ? (<div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (<div key={i} className="h-20 bg-gray-100 rounded-lg"></div>))}
              </div>) : fts.length > 0 ? (<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {fts.map((ft) => (<div key={`${ft.creator_did}-${ft.ft_name}`} className={`p-4 border border-${accentColor}-200 rounded-lg bg-${accentColor}-50`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{ft.ft_name}</h3>
                        <p className="text-sm text-gray-600">Count: {ft.ft_count}</p>
                      </div>
                      <button onClick={() => setSelectedFT(ft)} className={`p-2 rounded-lg bg-${accentColor}-100 hover:bg-${accentColor}-200 transition-colors`}>
                        <Send className="h-4 w-4"/>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-gray-500 truncate">
                      Creator: {ft.creator_did}
                    </p>
                  </div>))}
              </div>) : (<p className="text-gray-500">No FTs found</p>)}

            {/* Transfer FT Modal */}
            {selectedFT && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Transfer FT</h3>
                  <form onSubmit={handleTransferFT} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receiver DID
                      </label>
                      <input type="text" value={transferData.receiverDid} onChange={(e) => setTransferData({ ...transferData, receiverDid: e.target.value })} className="w-full p-2 border rounded-lg" required/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        FT Count
                      </label>
                      <input type="number" min="1" max={selectedFT.ft_count} value={transferData.ftCount} onChange={(e) => setTransferData({
                    ...transferData,
                    ftCount: parseInt(e.target.value),
                })} className="w-full p-2 border rounded-lg" required/>
                    </div>
                    <div className="flex space-x-2">
                      <button type="submit" className={`flex-1 py-2 bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700`}>
                        Transfer
                      </button>
                      <button type="button" onClick={() => setSelectedFT(null)} className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>)}
          </div>)}

        {/* Smart Contracts Section */}
        {activeTab === 'Smart Contracts' && (<div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
            <p className="text-gray-500">Smart Contracts feature coming soon</p>
          </div>)}
      </div>
    </div>);
};
export default Assets;
