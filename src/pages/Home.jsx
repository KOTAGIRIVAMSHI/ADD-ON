import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, ArrowRight, Zap, ShieldCheck, Users } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full flex-grow flex flex-col pt-10 pb-20 fade-in">

            {/* Hero Section */}
            <section className="relative w-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-16 min-h-[85vh]">

                {/* Background Ambient Animations */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
                    <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
                    <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-10%] left-[35%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
                </div>

                {/* Left Text Content */}
                <div className="flex-1 flex flex-col items-start text-left z-10 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-primary text-sm font-semibold mb-8 animate-[fade-in_0.5s_ease-out_0.2s_both]">
                        <Zap size={16} className="text-primary fill-primary/20" />
                        <span>Now with JNTUH Study Materials!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-heading text-white leading-[1.1] tracking-tight mb-8 animate-[fade-in_0.5s_ease-out_0.4s_both]">
                        Your Campus.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-200">
                            Upgraded.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed animate-[fade-in_0.5s_ease-out_0.6s_both]">
                        A premium, localized platform to buy/sell used gear and access an extensive library of B.Tech study materials across all branches.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-[fade-in_0.5s_ease-out_0.8s_both]">
                        <Link to="/study-materials" className="btn-primary flex items-center justify-center gap-2 group">
                            Browse Materials
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/marketplace" className="btn-secondary flex items-center justify-center">
                            Marketplace
                        </Link>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-8 md:gap-12 animate-[fade-in_0.5s_ease-out_1s_both]">
                        <div>
                            <p className="text-3xl font-heading font-bold text-white mb-1">50+</p>
                            <p className="text-sm text-gray-400">PDF Notes</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div>
                            <p className="text-3xl font-heading font-bold text-white mb-1">6+</p>
                            <p className="text-sm text-gray-400">Branches</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div>
                            <p className="text-3xl font-heading font-bold text-white mb-1">24/7</p>
                            <p className="text-sm text-gray-400">Access</p>
                        </div>
                    </div>
                </div>

                {/* Right Visual Content */}
                <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center animate-[fade-in_1s_ease-out_0.5s_both]">

                    {/* Floating Cards Graphic */}
                    <div className="relative w-full max-w-md h-full min-h-[400px]">
                        {/* Card 1 */}
                        <div className="absolute top-[10%] left-0 right-10 card-glass p-6 md:p-8 hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 shadow-2xl z-20">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <BookOpen className="text-primary" size={28} />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-2">Vault Access</h3>
                            <p className="text-gray-400 text-sm">Organized PDFs, handwritten notes, and important questions.</p>
                        </div>

                        {/* Card 2 */}
                        <div className="absolute bottom-[10%] left-10 right-0 bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-2xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 z-10">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <ShoppingBag className="text-gray-300" size={28} />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-2">Student Trades</h3>
                            <p className="text-gray-400 text-sm">Save money. Buy textbooks and equipment directly from seniors.</p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Feature Grid Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">Built for the <span className="text-primary">Modern Student</span>.</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Skip the chaotic WhatsApp groups. Find exactly what you need with our fast, reliable, and beautifully designed tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        {
                            icon: <BookOpen size={24} className="text-primary" />,
                            title: "Smart syllabus mapping",
                            desc: "Don't waste time looking for R22 or R18 materials. Our vault is tagged and structured exactly how you study."
                        },
                        {
                            icon: <ShieldCheck size={24} className="text-primary" />,
                            title: "Verified campus network",
                            desc: "Trade gear safely with real students from your college. No scammers, no shipping fees, just hand-to-hand trust."
                        },
                        {
                            icon: <Users size={24} className="text-primary" />,
                            title: "Community driven",
                            desc: "Upload your topper notes, request specific previous year papers, and help the junior batches succeed."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="card-glass p-8 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;
