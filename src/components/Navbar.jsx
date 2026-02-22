import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingBag, Menu, X, LibraryBig, Calendar, Car, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [campusLifeOpen, setCampusLifeOpen] = useState(false);
    const location = useLocation();

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
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors relative group
                  ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                            >
                                {link.icon && <span>{link.icon}</span>}
                                {link.name}
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

                    <button className="btn-primary">Sign In</button>
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

                    <button className="btn-primary w-full mt-4">Sign In</button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
