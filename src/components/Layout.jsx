import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-black text-gray-100 overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <Navbar />
            <main className="flex-grow flex flex-col relative z-10 w-full pt-20">
                {/* Subtle background ambient light */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30"></div>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
