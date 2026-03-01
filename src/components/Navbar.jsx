import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingBag, Menu, X, LibraryBig, Calendar, Car, ChevronDown, User, LogOut, Settings, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [campusLifeOpen, setCampusLifeOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const { user, logout, setIsAuthModalOpen, unreadCount } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={18} /> },
        { name: 'Messages', path: '/messages', icon: <MessageSquare size={18} /> },
        { name: 'Study Materials', path: '/study-materials', icon: <BookOpen size={18} /> }
    ];

    const campusLifeLinks = [
        { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
        { name: 'Ride Sharing', path: '/ride-sharing', icon: <Car size={18} /> }
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <LibraryBig className="text-primary group-hover:text-primary-hover transition-colors" size={28} />
                    <span className="font-heading font-bold text-2xl tracking-tight text-white">
                        Campus<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const isMessages = link.path === '/messages';
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors relative group
                  ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                            >
                                {link.icon && <span>{link.icon}</span>}
                                {link.name}
                                {isMessages && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-3 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                                <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300 rounded-full
                  ${isActive ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`}></span>
                            </Link>
                        )
                    })}

                    {/* Campus Life Dropdown */}
                    <div
                        className="relative group py-2 z-50"
                        onMouseEnter={() => setCampusLifeOpen(true)}
                        onMouseLeave={() => setCampusLifeOpen(false)}
                    >
                        <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${campusLifeOpen ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
                            Campus Life <ChevronDown size={16} className={`transition-transform ${campusLifeOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`absolute top-full right-0 pt-2 transition-all duration-200 ${campusLifeOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                            <div className="bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden w-52 flex flex-col p-2">
                                {campusLifeLinks.map(link => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors group/link ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <span className={`${isActive ? 'text-primary' : 'text-gray-500 group-hover/link:text-primary transition-colors'}`}>{link.icon}</span>
                                            {link.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <Link
                                    to="/marketplace"
                                    state={{ openCreateModal: true }}
                                    className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Plus size={18} />
                                    Sell
                                </Link>

                                <div
                                    className="relative group py-2 z-50"
                                    onMouseEnter={() => setProfileOpen(true)}
                                    onMouseLeave={() => setProfileOpen(false)}
                                >
                                    <button className="flex items-center gap-3 pl-4 border-l border-white/10">
                                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-primary/30 shadow-lg hover:border-primary transition-all" />
                                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <div className={`absolute top-full right-0 pt-2 transition-all duration-200 ${profileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                        <div className="bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden w-56 flex flex-col p-2">
                                            <div className="px-4 py-3 border-b border-white/5 mb-1">
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-primary uppercase font-bold tracking-wider mt-0.5">{user.branch} • {user.year}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <User size={16} className="text-gray-500" /> My Profile
                                            </Link>
                                            <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full text-left">
                                                <Settings size={16} className="text-gray-500" /> Settings
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors w-full text-left"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 transition-all duration-300 overflow-hidden md:hidden z-40 ${mobileMenuOpen ? 'max-h-[85vh] overflow-y-auto py-4' : 'max-h-0 py-0 border-transparent'}`}>
                <div className="container mx-auto px-6 flex flex-col gap-2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const isMessages = link.path === '/messages';
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center justify-between gap-3 p-3 rounded-xl font-medium transition-all
                  ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    {link.icon && <span>{link.icon}</span>}
                                    {link.name}
                                </div>
                                {isMessages && unreadCount > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}

                    {/* Campus Life Mobile Section */}
                    <div className="pt-4 pb-2 mt-2 border-t border-white/10">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-3 mb-2 block">Campus Life</span>
                        <div className="flex flex-col gap-2">
                            {campusLifeLinks.map(link => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all
                          ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.icon && <span>{link.icon}</span>}
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {user ? (
                        <div className="pt-4 pb-2 mt-2 border-t border-white/10">
                            <div className="flex items-center gap-3 p-3 mb-2">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-primary/30" />
                                <div>
                                    <p className="text-sm font-bold text-white">{user.name}</p>
                                    <p className="text-[10px] text-primary uppercase font-bold">{user.branch} • {user.year}</p>
                                </div>
                            </div>
                            <Link
                                to="/marketplace"
                                state={{ openCreateModal: true }}
                                className="flex items-center gap-3 p-3 rounded-xl font-medium text-primary bg-primary/10 border border-primary/20 mb-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Plus size={18} /> Post an Item
                            </Link>
                            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-300 hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>
                                <User size={18} /> My Profile
                            </Link>
                            <button
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 w-full text-left"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn-primary w-full mt-4"
                            onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
