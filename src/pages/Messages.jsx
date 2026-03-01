import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Send, MessageSquare, Loader2, Clock, AlertTriangle, ShoppingBag, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    collection, query, where, orderBy, onSnapshot,
    addDoc, doc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const d = date instanceof Date ? date : date.toDate();
    const diff = Math.floor((now - d) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getExpiryInfo = (expiresAt) => {
    if (!expiresAt) return null;
    const expiry = expiresAt instanceof Date ? expiresAt : expiresAt.toDate();
    const msDiff = expiry - Date.now();
    if (msDiff <= 0) return { expired: true, label: 'Expired' };
    const hrs = Math.floor(msDiff / 3600000);
    const mins = Math.floor((msDiff % 3600000) / 60000);
    if (hrs > 0) return { expired: false, label: `${hrs}h ${mins}m left` };
    return { expired: false, label: `${mins}m left`, urgent: true };
};

// ─── Avatar Initials ──────────────────────────────────────────────────────────

const Avatar = ({ name, size = 'h-10 w-10', className = '' }) => {
    const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['from-violet-500 to-indigo-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-cyan-500 to-blue-500'];
    const colorIdx = (name || '').charCodeAt(0) % colors.length;
    return (
        <div className={`${size} rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-lg ${className}`}>
            {initials}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Messages = () => {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef();
    const inputRef = useRef();

    // ── Fetch Chats ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;

        const now = Date.now();
        let buyerChats = [];
        let sellerChats = [];

        const merge = () => {
            // Merge both lists, dedup by id, filter expired, sort by lastMessageAt desc
            const all = [...buyerChats, ...sellerChats];
            const seen = new Set();
            const unique = all.filter(c => {
                if (seen.has(c.id)) return false;
                seen.add(c.id);
                // Filter expired
                if (c.expiresAt) {
                    let expiry;
                    if (c.expiresAt instanceof Date) {
                        expiry = c.expiresAt;
                    } else if (c.expiresAt && typeof c.expiresAt.toDate === 'function') {
                        expiry = c.expiresAt.toDate();
                    } else if (typeof c.expiresAt === 'string') {
                        expiry = new Date(c.expiresAt);
                    } else {
                        return true; // Can't determine expiry, keep it
                    }
                    if (expiry <= now) return false;
                }
                return true;
            });
            unique.sort((a, b) => {
                const ta = a.lastMessageAt?.toDate?.()?.getTime() ?? 0;
                const tb = b.lastMessageAt?.toDate?.()?.getTime() ?? 0;
                return tb - ta;
            });
            setChats(unique);
            setLoadingChats(false);

            if (selectedChat) {
                const updated = unique.find(c => c.id === selectedChat.id);
                if (updated) setSelectedChat(updated);
                else setSelectedChat(null); // Chat expired — deselect
            }
        };

        const chatsRef = collection(db, 'chats');

        // No orderBy here — avoids composite index requirement. Sorting is done client-side in merge().
        const q1 = query(chatsRef, where('buyerId', '==', user.uid));
        const q2 = query(chatsRef, where('sellerId', '==', user.uid));

        const unsub1 = onSnapshot(q1, snap => {
            buyerChats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            merge();
        }, err => { console.error('chats q1 error:', err); setLoadingChats(false); });

        const unsub2 = onSnapshot(q2, snap => {
            sellerChats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            merge();
        }, err => { console.error('chats q2 error:', err); });

        return () => { unsub1(); unsub2(); };
    }, [user?.uid]);

    // ── Fetch Messages ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedChat) return;

        setLoadingMessages(true);
        const messagesRef = collection(db, 'chats', selectedChat.id, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [selectedChat?.id]);

    // ── Auto-scroll when messages change (only within messages container) ─────────────────────────────────────
    useEffect(() => {
        if (messages.length > 0 && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages]);

    // ── Send Message ──────────────────────────────────────────────────────────
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || sending) return;

        const text = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const messagesRef = collection(db, 'chats', selectedChat.id, 'messages');
            await addDoc(messagesRef, {
                text,
                senderId: user.uid,
                senderName: user.name,
                createdAt: serverTimestamp()
            });

            const chatRef = doc(db, 'chats', selectedChat.id);
            await updateDoc(chatRef, {
                lastMessage: text,
                lastMessageAt: serverTimestamp()
            });
        } catch (err) {
            console.error('Error sending message:', err);
            setNewMessage(text); // restore on error
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // ── Filtered Chats ────────────────────────────────────────────────────────
    const filteredChats = useMemo(() => {
        const q = searchQuery.toLowerCase();
        if (!q) return chats;
        return chats.filter(chat => {
            const other = chat.buyerId === user?.uid ? chat.sellerName : chat.buyerName;
            return other?.toLowerCase().includes(q) || chat.itemName?.toLowerCase().includes(q);
        });
    }, [chats, searchQuery, user?.uid]);

    // ── Message grouping (group by date) ─────────────────────────────────────
    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentDate = null;
        for (const msg of messages) {
            const d = msg.createdAt?.toDate?.();
            const label = d ? d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) : null;
            if (label && label !== currentDate) {
                groups.push({ type: 'date', label });
                currentDate = label;
            }
            groups.push({ type: 'message', msg });
        }
        return groups;
    }, [messages]);

    // ── Handle keyboard shortcut (Enter to send) ──────────────────────────────
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMessage(e);
        }
    };

    // ── Signed-out state ──────────────────────────────────────────────────────
    if (!user) {
        return (
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="card-glass p-16 max-w-md flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                        <MessageSquare size={36} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Sign in to view messages</h2>
                    <p className="text-gray-400 text-sm">Chat with buyers and sellers directly on the campus hub.</p>
                </div>
            </div>
        );
    }

    const expiryInfo = selectedChat?.expiresAt ? getExpiryInfo(selectedChat.expiresAt) : null;

    return (
        <div className="flex-grow flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="flex flex-1 h-full max-w-7xl mx-auto w-full p-2 md:p-4 gap-2 md:gap-4 min-h-0">

                {/* ── Sidebar ────────────────────────────────────────────── */}
                <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col min-h-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className="card-glass flex flex-col h-full min-h-0 overflow-hidden">

                        {/* Header */}
                        <div className="p-3 md:p-4 border-b border-white/10 flex-shrink-0">
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MessageCircle size={20} className="text-primary" />
                                    Messages
                                    {chats.length > 0 && (
                                        <span className="ml-1 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                            {chats.length}
                                        </span>
                                    )}
                                </h2>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder-gray-600"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loadingChats ? (
                                <div className="flex flex-col items-center justify-center py-10 md:py-16 gap-3">
                                    <Loader2 size={24} md:size={28} className="text-primary animate-spin" />
                                    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Loading</p>
                                </div>
                            ) : filteredChats.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 md:py-16 px-4 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                        <MessageSquare size={24} className="text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">
                                        {searchQuery ? 'No results found' : 'No conversations yet'}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                        {searchQuery ? 'Try a different search' : 'Go to the Marketplace and contact a seller!'}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {filteredChats.map(chat => {
                                        const otherName = chat.buyerId === user.uid ? (chat.sellerName || 'Seller') : (chat.buyerName || 'Buyer');
                                        const isActive = selectedChat?.id === chat.id;
                                        const exp = chat.expiresAt ? getExpiryInfo(chat.expiresAt) : null;

                                        return (
                                            <button
                                                key={chat.id}
                                                onClick={() => setSelectedChat(chat)}
                                                className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 border-b border-white/5 transition-all text-left group relative ${isActive
                                                    ? 'bg-primary/15 border-l-2 border-l-primary'
                                                    : 'hover:bg-white/5 border-l-2 border-l-transparent'
                                                    }`}
                                            >
                                                <Avatar name={otherName} size="h-9 w-9 md:h-11 md:w-11" />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <span className="text-sm font-bold text-white truncate">{otherName}</span>
                                                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                                                            {chat.lastMessageAt?.toDate ? formatTime(chat.lastMessageAt) : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate mb-1.5">{chat.lastMessage || 'No messages yet'}</p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 flex items-center gap-1">
                                                            <ShoppingBag size={9} className="text-gray-600" />
                                                            {chat.itemName}
                                                        </span>
                                                        {exp && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium ${exp.urgent || exp.expired
                                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                }`}>
                                                                <Clock size={9} />
                                                                {exp.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
                            <p className="text-[10px] text-gray-600 text-center flex items-center justify-center gap-1">
                                <Clock size={10} className="text-amber-600" />
                                Chats auto-delete 24 hrs after creation
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Chat Window ────────────────────────────────────────── */}
                <div className={`flex-1 flex flex-col min-h-0 min-w-0 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChat ? (
                        <div className="card-glass flex flex-col h-full min-h-0 overflow-hidden">

                            {/* Chat Header */}
                            <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03] flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedChat(null)}
                                        className="md:hidden p-1 -ml-1 text-gray-400 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                    </button>
                                    <Avatar name={selectedChat.buyerId === user.uid ? selectedChat.sellerName : selectedChat.buyerName} size="h-9 w-9 md:h-10 md:w-10" />
                                    <div>
                                        <h3 className="text-sm font-bold text-white">
                                            {selectedChat.buyerId === user.uid ? selectedChat.sellerName : selectedChat.buyerName}
                                        </h3>
                                        <p className="text-[10px] text-primary flex items-center gap-1">
                                            <ShoppingBag size={9} />
                                            {selectedChat.itemName}
                                        </p>
                                    </div>
                                </div>

                                {/* Expiry badge in header */}
                                {expiryInfo && (
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${expiryInfo.urgent || expiryInfo.expired
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        <Clock size={12} />
                                        {expiryInfo.expired ? 'Chat expired' : `Expires in ${expiryInfo.label}`}
                                    </div>
                                )}
                            </div>

                            {/* Expiry warning banner */}
                            {expiryInfo && (expiryInfo.urgent || expiryInfo.expired) && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/5 border-b border-amber-500/10 text-amber-400 text-xs flex-shrink-0">
                                    <AlertTriangle size={14} />
                                    {expiryInfo.expired
                                        ? 'This chat has expired and will not receive new messages.'
                                        : `This chat expires soon — exchange contact details if needed!`}
                                </div>
                            )}

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-3 md:p-5 flex flex-col gap-1 md:gap-2 min-h-0">
                                {loadingMessages ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Loader2 size={28} className="text-primary animate-spin" />
                                    </div>
                                ) : groupedMessages.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <p className="text-gray-600 text-sm">No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    groupedMessages.map((item, idx) => {
                                        if (item.type === 'date') {
                                            return (
                                                <div key={`date-${idx}`} className="flex items-center gap-3 my-3">
                                                    <div className="flex-1 h-px bg-white/5" />
                                                    <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{item.label}</span>
                                                    <div className="flex-1 h-px bg-white/5" />
                                                </div>
                                            );
                                        }

                                        const { msg } = item;
                                        const isMine = msg.senderId === user.uid;
                                        // Check previous message to group bubbles
                                        const prevItem = groupedMessages[idx - 1];
                                        const prevMsg = prevItem?.type === 'message' ? prevItem.msg : null;
                                        const isGrouped = prevMsg && prevMsg.senderId === msg.senderId;

                                        return (
                                            <div key={msg.id || idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-3'}`}>
                                                {!isGrouped && !isMine && (
                                                    <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.senderName}</span>
                                                )}
                                                <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${isMine
                                                    ? 'bg-primary text-black font-medium rounded-2xl rounded-tr-sm shadow-lg shadow-primary/20'
                                                    : 'bg-neutral-800 text-gray-200 rounded-2xl rounded-tl-sm border border-white/5'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[10px] text-gray-600 mt-1 px-1">
                                                    {msg.createdAt?.toDate ? formatTime(msg.createdAt) : 'Sending...'}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={scrollRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-2 md:p-4 border-t border-white/10 bg-white/[0.02] flex-shrink-0">
                                {expiryInfo?.expired ? (
                                    <div className="text-center text-gray-600 text-sm py-2">This chat has expired.</div>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                                        <textarea
                                            ref={inputRef}
                                            rows={1}
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 md:py-3 px-3 md:px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner resize-none leading-relaxed placeholder-gray-600"
                                            style={{ maxHeight: 100, overflowY: 'auto' }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="p-2 md:p-3 rounded-xl bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 flex-shrink-0"
                                        >
                                            {sending ? <Loader2 size={16} md:size={18} className="animate-spin" /> : <Send size={16} md:size={18} />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card-glass flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12 h-full">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-primary/10">
                                <MessageCircle size={32} md:size={44} className="text-primary/30" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Your Conversations</h3>
                            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                                Select a chat from the sidebar, or head to the Marketplace and contact a seller to start a new conversation.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs text-amber-500/70">
                                <Clock size={12} />
                                <span>All chats auto-delete after 24 hours</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
