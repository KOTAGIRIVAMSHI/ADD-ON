import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, BookOpen, Heart, Package, ChevronRight, Edit3, Trash2, ExternalLink, Loader2, Linkedin, Github, Twitter, Globe, RefreshCw } from 'lucide-react';
import { dbHelpers } from '../utils/dbHelpers';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('listings');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [myListings, setMyListings] = useState([]);
    const [myUploads, setMyUploads] = useState([]);
    const [myWishlist, setMyWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!user) return;
        console.log('Fetching user data for UID:', user.uid);
        setLoading(true);
        try {
            const listings = await dbHelpers.getListingsByUser(user.uid);
            console.log('User listings:', listings);
            
            const uploads = await dbHelpers.getMaterials();
            console.log('All materials:', uploads);
            
            const saved = await dbHelpers.getUserWishlist(user.uid);
            console.log('User wishlist:', saved);
            
            setMyListings(listings);
            setMyUploads(uploads.filter(m => m.uploaderId === user.uid));
            setMyWishlist(saved);
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData, location.pathname]);

    const handleDeleteListing = async (listingId) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            await dbHelpers.deleteListing(listingId);
            setMyListings(prev => prev.filter(l => l.id !== listingId));
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert('Failed to delete listing');
        }
    };

    const handleRemoveFromWishlist = async (listingId) => {
        try {
            await dbHelpers.removeFromWishlist(user.uid, listingId);
            setMyWishlist(prev => prev.filter(w => w.listingId !== listingId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        }
    };

    if (!user) return <Navigate to="/" replace />;

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-6xl">

            {/* Profile Header */}
            <div className="card-glass p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Package size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-32 h-32 rounded-3xl border-2 border-primary/30 shadow-2xl"
                        />
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg border-4 border-neutral-900 hover:scale-110 transition-transform"
                        >
                            <Edit3 size={16} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
                        <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                                {user.branch}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 text-xs font-bold uppercase tracking-wider">
                                {user.year}
                            </span>
                        </div>
                        {user.bio && (
                            <p className="text-gray-400 text-sm mb-4 max-w-md">{user.bio}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all">
                                    <Linkedin size={14} />
                                </a>
                            )}
                            {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                                    <Github size={14} />
                                </a>
                            )}
                            {user.twitter && (
                                <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                                    <Twitter size={14} />
                                </a>
                            )}
                            {user.website && (
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                                    <Globe size={14} />
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto md:mx-0">
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-bold text-white">{myListings.length}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Listings</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-bold text-white">{myUploads.length}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Uploads</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-bold text-white">{myWishlist.length}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Saved</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="btn-secondary px-8 py-3"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={fetchUserData}
                        className="btn-secondary px-4 py-3"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all border ${activeTab === 'listings' ? 'bg-primary/10 border-primary/30 text-primary shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Package size={20} />
                                <span className="font-semibold">My Listings</span>
                            </div>
                            {activeTab === 'listings' && <ChevronRight size={16} />}
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all border ${activeTab === 'saved' ? 'bg-primary/10 border-primary/30 text-primary shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={20} />
                                <span className="font-semibold">Saved Items</span>
                            </div>
                            {activeTab === 'saved' && <ChevronRight size={16} />}
                        </button>
                        <button
                            onClick={() => setActiveTab('uploads')}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all border ${activeTab === 'uploads' ? 'bg-primary/10 border-primary/30 text-primary shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <BookOpen size={20} />
                                <span className="font-semibold">My Uploads</span>
                            </div>
                            {activeTab === 'uploads' && <ChevronRight size={16} />}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                    ) : activeTab === 'listings' && (
                        <div className="grid grid-cols-1 gap-4">
                            {myListings.length > 0 ? myListings.map(item => (
                                <div key={item.id} className="card-glass p-4 flex items-center gap-6 group hover:border-primary/20 transition-all">
                                    <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-white/5" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-primary font-bold mb-3">₹{item.price}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>0 views</span>
                                            <span>•</span>
                                            <span>Just listed</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleDeleteListing(item.id)}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-all"
                                            title="Delete Listing"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                                    <Package className="mx-auto text-gray-700 mb-4" size={48} />
                                    <p className="text-gray-500 mb-6">You haven't listed anything yet.</p>
                                    <button
                                        onClick={() => navigate('/marketplace')}
                                        className="btn-primary"
                                    >
                                        Post an Item
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="grid grid-cols-1 gap-4">
                            {myWishlist.length > 0 ? myWishlist.map(item => (
                                <div key={item.id} className="card-glass p-4 flex items-center gap-6 group hover:border-rose-500/20 transition-all">
                                    <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-white/5" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                                        <p className="text-primary font-bold mb-1">₹{item.price}</p>
                                        <p className="text-xs text-gray-500">Seller: <span className="text-gray-300">{item.seller}</span></p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item.listingId)}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                            title="Remove from Saved"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                                    <Heart className="mx-auto text-gray-700 mb-4" size={48} />
                                    <p className="text-gray-500">No saved items yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'uploads' && (
                        <div className="grid grid-cols-1 gap-4">
                            {myUploads.length > 0 ? myUploads.map(item => (
                                <div key={item.id} className="card-glass p-6 group hover:border-primary/20 transition-all flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <div className="flex gap-3 text-xs">
                                            <span className="text-gray-400">{item.type}</span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-400">{item.year}</span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-emerald-500/80 font-bold">{item.upvotes?.length || 0} upvotes</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                                    <BookOpen className="mx-auto text-gray-700 mb-4" size={48} />
                                    <p className="text-gray-500">No uploads yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <EditProfileModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
            />
        </div>
    );
};

export default Profile;
