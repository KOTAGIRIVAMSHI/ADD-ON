import React from 'react';
import { Link } from 'react-router-dom';
import { LibraryBig, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-neutral-950 border-t border-white/5 pt-20 pb-10 mt-20">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <LibraryBig className="text-primary" size={28} />
                            <span className="font-heading font-bold text-2xl tracking-tight text-white">
                                Campus<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                            Your localized campus platform for study materials, used books, and tech gear.
                            Empowering students to succeed together with a modern, fast experience.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-6 font-heading">Resources</h3>
                            <ul className="flex flex-col gap-4 text-sm text-gray-400">
                                <li><Link to="/study-materials" className="hover:text-primary transition-colors">Study Materials</Link></li>
                                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Branch Papers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Syllabus</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-6 font-heading">Platform</h3>
                            <ul className="flex flex-col gap-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-white font-semibold mb-6 font-heading">Legal</h3>
                            <ul className="flex flex-col gap-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} CampusHub. Crafted for students.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>Built with <span className="text-primary">React</span> & <span className="text-sky-500">Tailwind</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
