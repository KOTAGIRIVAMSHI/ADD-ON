import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
            setIsAuthModalOpen(false);
        } catch (err) {
            console.error(err);
            // Friendly error messages
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    setError('Invalid email or password.');
                    break;
                default:
                    setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"
                onClick={() => setIsAuthModalOpen(false)}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-[scale-in_0.3s_ease-out]">
                {/* Header Image/Pattern */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-emerald-500/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 z-10">
                        <ShieldCheck className="text-primary" size={32} />
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {isLogin ? 'Welcome Back' : 'Join CampusHub'}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAuthModalOpen(false)}
                            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <User className="text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Mail className="text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="College Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                            />
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm py-3 px-4 rounded-xl animate-[fade-in_0.2s_ease-out]">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-semibold hover:underline transition-all"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AuthModal;
