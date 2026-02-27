import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, ShoppingBag, X, Plus, Heart, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Books', 'Tech & Gear'];

const Marketplace = () => {
    const { user } = useAuth();
    const { docs: items, loading, addDocument } = useFirestore('listings');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Watchlist State
    const [savedItems, setSavedItems] = useState(new Set());
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        price: '',
        category: 'Books',
        condition: 'Good',
        image: ''
    });

    // Chat State
    const [activeChat, setActiveChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeChat) scrollToBottom();
    }, [chatMessages, activeChat]);

    const toggleSaveItem = (id) => {
        setSavedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please sign in to post a listing!");
            return;
        }

        // Basic validation
        if (!newItem.title || !newItem.price) return;

        try {
            await addDocument({
                title: newItem.title,
                category: newItem.category,
                price: Number(newItem.price),
                condition: newItem.condition,
                seller: user.name,
                sellerId: user.uid,
                image: newItem.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=300'
            });

            setIsCreateModalOpen(false);
            setNewItem({ title: '', price: '', category: 'Books', condition: 'Good', image: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to post listing. Check console for errors.");
        }
    };

    const openChat = (item) => {
        setActiveChat(item);
        // Simulate initial conversation based on item
        setChatMessages([
            { id: 1, text: `Hi, is the ${item.title} still available?`, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            { id: 2, text: `Yes, it is! Let me know if you want to meet up on campus.`, sender: 'them', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: messageInput,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages([...chatMessages, newMsg]);
        setMessageInput('');

        // Simulate a reply after 1.5 seconds if it's not the user's listing
        if (activeChat.seller !== 'You') {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Sounds good, I'll text you when I'm near the library.",
                    sender: 'them',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1500);
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
                            {CATEGORIES.map(category => (
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
                                                onClick={() => toggleSaveItem(item.id)}
                                                className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                                            >
                                                <Heart size={16} className={`${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'} transition-colors duration-300`} />
                                            </button>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow bg-neutral-950/50">
                                            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                            <p className="text-gray-500 text-sm mb-4">Seller: <span className="text-gray-300">{item.seller}</span></p>

                                            <div className="mt-auto flex items-end justify-between">
                                                <span className="text-2xl font-bold font-heading text-white">₹{item.price}</span>
                                                <button
                                                    onClick={() => openChat(item)}
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
                        <div className="card-glass p-12 text-center rounded-2xl border-dashed border-white/20">
                            {showSavedOnly ? (
                                <Heart className="mx-auto text-rose-500/50 mb-4" size={48} />
                            ) : (
                                <Search className="mx-auto text-gray-600 mb-4" size={48} />
                            )}
                            <h3 className="text-xl text-white font-semibold mb-2">
                                {showSavedOnly ? "No saved items yet" : "No items found"}
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                {showSavedOnly
                                    ? "Click the heart icon on any listing to add it to your watchlist."
                                    : "We couldn't find anything matching your search. Try changing your filters."
                                }
                            </p>

                            {showSavedOnly && (
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowSavedOnly(false)}
                                >
                                    Browse Marketplace
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Drawer Sidebar Overlay */}
            {activeChat && createPortal(
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity animate-[fade-in_0.2s_ease-out]"
                        onClick={() => setActiveChat(null)}
                    ></div>

                    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-neutral-950 border-l border-white/10 z-[70] flex flex-col shadow-2xl animate-[slide-in-right_0.3s_ease-out]">

                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 bg-neutral-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                    {activeChat.seller.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">{activeChat.seller}</h3>
                                    <p className="text-xs text-primary font-medium">Re: {activeChat.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveChat(null)}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Item Quick View */}
                        <div className="p-3 bg-neutral-900/50 border-b border-white/5 flex gap-3 items-center">
                            <img src={activeChat.image} alt={activeChat.title} className="w-12 h-12 rounded object-cover border border-white/10" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-gray-200 truncate">{activeChat.title}</p>
                                <p className="text-xs text-gray-400 font-bold">₹{activeChat.price}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex max-w-[80%] flex-col ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-md ${msg.sender === 'me'
                                        ? 'bg-primary text-black rounded-tr-sm'
                                        : 'bg-neutral-800 border border-white/10 text-gray-100 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-4 bg-neutral-900 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-black border border-white/20 rounded-full py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="absolute right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </>, document.body
            )}

            {/* Create Listing Modal Overlay */}
            {isCreateModalOpen && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="card-glass w-full max-w-lg bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out]">

                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="text-primary" /> Post New Item
                            </h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Item Title <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    placeholder="e.g. Engineering Mathematics Vol 1"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Price & Category Row */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹) <span className="text-primary">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                        placeholder="0"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    >
                                        <option value="Books">Books</option>
                                        <option value="Tech & Gear">Tech & Gear</option>
                                    </select>
                                </div>
                            </div>

                            {/* Condition & Image URL Row */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Condition</label>
                                    <select
                                        value={newItem.condition}
                                        onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    >
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    value={newItem.image}
                                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-2">Leave blank to use a default placeholder image.</p>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
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
