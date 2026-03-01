import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, ShoppingBag, X, Plus, Heart, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbHelpers } from '../utils/dbHelpers';
import ImageUpload from '../components/ImageUpload';
import EmptyState from '../components/EmptyState';

const CATEGORIES_FILTER = ['All', 'Books', 'Tech & Gear', 'Electronics', 'Furniture', 'Clothing', 'Notes & Papers', 'Calculators', 'Instruments', 'Sports', 'Other', 'AIML', 'Civil', 'Mechanical'];

const Marketplace = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    // Load listings
    useEffect(() => {
        const loadListings = async () => {
            try {
                const listings = await dbHelpers.getActiveListings();
                setItems(listings);
            } catch (err) {
                console.error('Error loading listings:', err);
            } finally {
                setLoading(false);
            }
        };
        loadListings();
    }, []);

    // Load wishlist
    useEffect(() => {
        if (!user) return;
        const loadWishlist = async () => {
            try {
                const saved = await dbHelpers.getUserWishlist(user.uid);
                setWishlist(saved);
            } catch (err) {
                console.error('Error loading wishlist:', err);
            }
        };
        loadWishlist();
    }, [user?.uid]);

    // Watchlist State
    const savedItems = new Set(wishlist.map(w => w.listingId));

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Handle Navbar shortcut
    React.useEffect(() => {
        if (location.state?.openCreateModal) {
            setIsCreateModalOpen(true);
            // Clear state so it doesn't reopen on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Books',
        condition: 'Good',
        image: '',
        negotiable: true,
        location: ''
    });

    const CATEGORIES = [
        { value: 'Books', label: 'Books', icon: '📚' },
        { value: 'Tech & Gear', label: 'Tech & Gadgets', icon: '💻' },
        { value: 'Electronics', label: 'Electronics', icon: '📱' },
        { value: 'Furniture', label: 'Furniture', icon: '🪑' },
        { value: 'Clothing', label: 'Clothing', icon: '👕' },
        { value: 'Notes & Papers', label: 'Notes & Papers', icon: '📝' },
        { value: 'Calculators', label: 'Calculators', icon: '🧮' },
        { value: 'Instruments', label: 'Instruments', icon: '🎸' },
        { value: 'Sports', label: 'Sports & Fitness', icon: '⚽' },
        { value: 'Other', label: 'Other', icon: '📦' }
    ];

    const CONDITIONS = [
        { value: 'New', label: 'Brand New', desc: 'Never used' },
        { value: 'Like New', label: 'Like New', desc: 'Used once or twice' },
        { value: 'Good', label: 'Good', desc: 'Minor wear & tear' },
        { value: 'Fair', label: 'Fair', desc: 'Visible wear but works' },
        { value: 'For Parts', label: 'For Parts', desc: 'Not working' }
    ];

    const toggleSaveItem = async (item) => {
        if (!user) {
            alert("Please sign in to save items!");
            return;
        }

        const existingItem = wishlist.find(w => w.listingId === item.id);
        if (existingItem) {
            await dbHelpers.removeFromWishlist(user.uid, item.id);
            setWishlist(prev => prev.filter(w => w.listingId !== item.id));
        } else {
            await dbHelpers.addToWishlist(user.uid, {
                id: item.id,
                title: item.title,
                price: item.price,
                sellerName: item.sellerName,
                image: item.image,
                category: item.category
            });
            setWishlist(prev => [...prev, { listingId: item.id }]);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please sign in to post a listing!");
            return;
        }

        if (!newItem.title || !newItem.price) return;

        try {
            await dbHelpers.createListing({
                title: newItem.title,
                description: newItem.description,
                category: newItem.category,
                price: Number(newItem.price),
                condition: newItem.condition,
                sellerName: user.name,
                sellerId: user.uid,
                sellerAvatar: user.avatar,
                image: newItem.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=300',
                location: newItem.location,
                negotiable: newItem.negotiable
            });

            setIsCreateModalOpen(false);
            setNewItem({ title: '', description: '', price: '', category: 'Books', condition: 'Good', image: '', negotiable: true, location: '' });
            
            // Refresh listings
            const listings = await dbHelpers.getActiveListings();
            setItems(listings);
        } catch (err) {
            console.error('Error posting listing:', err);
            alert(`Failed to post listing: ${err.message}`);
        }
    };

    const handleContactSeller = async (item) => {
        if (!user) {
            alert("Please sign in to message the seller!");
            return;
        }

        if (item.sellerId === user.uid) {
            alert("This is your own listing!");
            return;
        }

        try {
            const chatId = await dbHelpers.getOrCreateChat(
                user.uid,
                item.sellerId,
                item.id,
                item.title
            );
            navigate('/messages', { state: { selectedChatId: chatId } });
        } catch (err) {
            console.error("Error starting chat:", err);
            alert("Failed to start chat. Try again.");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSaved = showSavedOnly ? savedItems.has(item.id) : true;
        return matchesSearch && matchesCategory && matchesSaved;
    });

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-7xl relative overflow-hidden">

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                    Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Marketplace</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Buy and sell textbooks, calculators, and electronics directly with your peers. No shipping, no fees.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">

                {/* Sidebar / Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 card-glass p-6 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-white font-semibold text-lg border-b border-white/10 pb-4">
                        <Filter size={20} className="text-primary" />
                        <h2>Filters</h2>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Categories</h3>
                        <div className="flex flex-col gap-2">
                            {CATEGORIES_FILTER.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setShowSavedOnly(false); // Reset saved filter when changing categories normally
                                    }}
                                    className={`text-left px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeCategory === category && !showSavedOnly
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 border-t border-white/10 pt-6">
                        <button
                            onClick={() => {
                                setShowSavedOnly(!showSavedOnly);
                                if (!showSavedOnly) setActiveCategory('All');
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-between ${showSavedOnly
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Heart size={16} className={showSavedOnly ? "fill-rose-400" : ""} /> Saved Items
                            </span>
                            {savedItems.size > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${showSavedOnly ? 'bg-rose-500/30' : 'bg-white/10'}`}>
                                    {savedItems.size}
                                </span>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={18} />
                        Post an Item
                    </button>
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full">

                    {/* Search Bar */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for books, calculators, tools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder-gray-500 shadow-inner"
                        />
                    </div>

                    <div className="mb-6 flex justify-between items-center text-sm text-gray-400">
                        <span>Showing {filteredItems.length} items {showSavedOnly && "(Saved)"}</span>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 size={48} className="text-primary animate-spin" />
                            <p className="text-gray-400 font-medium">Loading incredible deals...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => {
                                const isSaved = savedItems.has(item.id);
                                return (
                                    <div key={item.id} className="card-glass overflow-hidden flex flex-col group hover:-translate-y-2 hover:border-primary/30 transition-all duration-300">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" loading="lazy" />

                                            {/* Badges */}
                                            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
                                                <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10 block w-max">
                                                    {item.condition}
                                                </span>
                                                <span className="bg-primary/90 text-black text-xs font-bold px-3 py-1 rounded-full block w-max shadow-lg">
                                                    {item.category}
                                                </span>
                                            </div>

                                            {/* Save Button */}
                                            <button
                                                onClick={() => toggleSaveItem(item)}
                                                className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                                            >
                                                <Heart size={16} className={`${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'} transition-colors duration-300`} />
                                            </button>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow bg-neutral-950/50">
                                            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                            
                                            {item.description && (
                                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                                                    {item.condition}
                                                </span>
                                                {item.location && (
                                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                                                        📍 {item.location}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                <img 
                                                    src={item.sellerAvatar || `https://i.pravatar.cc/150?u=${item.sellerId}`} 
                                                    alt={item.sellerName}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="text-gray-500 text-sm">by <span className="text-gray-300">{item.sellerName}</span></span>
                                            </div>

                                            <div className="mt-auto flex items-end justify-between">
                                                <div>
                                                    <span className="text-2xl font-bold font-heading text-white">₹{item.price}</span>
                                                    {item.negotiable && <span className="text-xs text-gray-500 ml-2">(Negotiable)</span>}
                                                </div>
                                                <button
                                                    onClick={() => handleContactSeller(item)}
                                                    className="text-sm font-semibold flex items-center gap-1 text-primary hover:text-white bg-primary/10 hover:bg-primary px-3 py-2 rounded-lg transition-colors border border-primary/20 hover:border-transparent"
                                                >
                                                    <MessageSquare size={16} /> Contact
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredItems.length === 0 && (
                        <EmptyState
                            icon={showSavedOnly ? Heart : Search}
                            title={showSavedOnly ? "No saved items yet" : "No items found"}
                            description={showSavedOnly
                                ? "Click the heart icon on any listing to add it to your watchlist."
                                : "We couldn't find anything matching your search. Try changing your filters."
                            }
                            actionLabel={showSavedOnly ? "Browse Marketplace" : "Post an Item"}
                            actionLink={showSavedOnly ? "/marketplace" : undefined}
                            onAction={showSavedOnly ? () => setShowSavedOnly(false) : () => setIsModalOpen(true)}
                        />
                    )}
                </div>
            </div>

            {/* Create Listing Modal Overlay */}
            {isCreateModalOpen && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="card-glass w-full max-w-2xl bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out] max-h-[90vh]">

                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-neutral-900/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShoppingBag className="text-primary" /> Post New Item
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Fill in the details to list your item</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">

                            {/* Image Upload - Featured */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Item Photos <span className="text-primary">*</span></label>
                                <ImageUpload
                                    folder="listings"
                                    onUpload={(url) => setNewItem({ ...newItem, image: url })}
                                />
                                {newItem.image && (
                                    <div className="mt-3 relative inline-block">
                                        <img src={newItem.image} alt="Preview" className="w-24 h-24 rounded-xl object-cover border-2 border-primary/50" />
                                        <button
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, image: '' })}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-rose-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Item Title <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    placeholder="e.g. Engineering Mathematics Vol 1, Casio Scientific Calculator"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description <span className="text-gray-500">(optional)</span></label>
                                <textarea
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Describe your item - features, brand, reason for selling..."
                                    rows={3}
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                />
                            </div>

                            {/* Price & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹) <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={newItem.price}
                                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                            placeholder="0"
                                            className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Condition <span className="text-gray-500">(select one)</span></label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {CONDITIONS.map(cond => (
                                        <button
                                            key={cond.value}
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, condition: cond.value })}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                newItem.condition === cond.value
                                                    ? 'bg-primary/20 border-primary/50 text-primary'
                                                    : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="font-medium text-sm">{cond.label}</div>
                                            <div className="text-[10px] opacity-70 mt-0.5">{cond.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Location <span className="text-gray-500">(optional)</span></label>
                                <input
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    placeholder="e.g. Block A Hostel, Main Gate, Library"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Negotiable Toggle */}
                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
                                <div>
                                    <p className="text-white font-medium">Price Negotiable</p>
                                    <p className="text-gray-500 text-sm">Allow buyers to negotiate the price</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNewItem({ ...newItem, negotiable: !newItem.negotiable })}
                                    className={`w-14 h-8 rounded-full transition-all relative ${
                                        newItem.negotiable ? 'bg-primary' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                                        newItem.negotiable ? 'left-7' : 'left-1'
                                    }`} />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="mt-2 flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 btn-secondary py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Post Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}

        </div>
    );
};

export default Marketplace;
