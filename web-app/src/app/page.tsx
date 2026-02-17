"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Search,
    Video,
    Gamepad2,
    Zap,
    ShieldCheck,
    Smartphone,
    ChevronRight,
    Star,
    CheckCircle2,
    X,
    Play
} from 'lucide-react';
import { Pricing } from '@/components/Pricing';
import Head from 'next/head';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <div className="bg-[#121218] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                            {title}
                        </h3>
                        {children}
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [showWaitlist, setShowWaitlist] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWaitlistSubmit = (e) => {
        e.preventDefault();
        alert(`Thanks! ${email} has been added to our priority waitlist.`);
        setShowWaitlist(false);
        setEmail('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white overflow-hidden font-sans">
            <Head>
                <title>SoulMatch - AI Dating & Social</title>
                <meta name="description" content="Find your soul match in 60 seconds." />
            </Head>

            {/* Waitlist Modal */}
            <Modal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} title="Join the Elite List">
                <p className="text-gray-400 mb-6">Be the first to experience the future of connection. Early access members get a verified badge!</p>
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full btn-premium py-3 rounded-xl font-bold">
                        Secure My Spot
                    </button>
                </form>
            </Modal>

            {/* Demo Modal */}
            <Modal isOpen={showDemo} onClose={() => setShowDemo(false)} title="Watch Demo">
                <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-secondary-900/20"></div>
                    <Play size={48} className="text-white opacity-50" />
                    <p className="absolute bottom-4 text-xs text-gray-500 font-mono uppercase tracking-widest">Demo Video Loading...</p>
                </div>
                <p className="mt-4 text-sm text-gray-400 text-center">Full walkthrough coming soon to YouTube.</p>
            </Modal>

            {/* Download Modal */}
            <Modal isOpen={showDownload} onClose={() => setShowDownload(false)} title="Get the App">
                <p className="text-gray-400 mb-6 text-center">SoulMatch is currently in exclusive beta. Choose your platform to pre-order.</p>
                <div className="space-y-4">
                    <button className="w-full bg-[#1a1a1f] hover:bg-[#25252b] border border-white/5 rounded-xl p-4 flex items-center justify-center transition-all group">
                        <Smartphone className="mr-3 text-gray-400 group-hover:text-white" />
                        <span className="font-bold">App Store (iOS)</span>
                    </button>
                    <button className="w-full bg-[#1a1a1f] hover:bg-[#25252b] border border-white/5 rounded-xl p-4 flex items-center justify-center transition-all group">
                        <CheckCircle2 className="mr-3 text-gray-400 group-hover:text-primary-400" />
                        <span className="font-bold">Google Play Store</span>
                    </button>
                </div>
            </Modal>


            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-morphism py-4 shadow-2xl shadow-primary-900/10' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Heart className="text-white fill-white" size={20} />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent italic tracking-tighter">
                            SoulMatch
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#features" className="hover:text-white hover:glow-text transition-all duration-300">Features</a>
                        <a href="#how-it-works" className="hover:text-white hover:glow-text transition-all duration-300">Process</a>
                        <a href="#pricing" className="hover:text-white hover:glow-text transition-all duration-300">Pricing</a>
                    </div>

                    <button
                        onClick={() => setShowDownload(true)}
                        className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Download App
                    </button>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-hero-pattern">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[100px] -ml-40 -mb-20"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-morphism mb-8 border border-white/10 hover:border-primary-500/50 transition-colors cursor-default"
                            >
                                <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-200">AI Matchmaking Engine V2.0</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]"
                            >
                                Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-pink-500 to-secondary-500 animate-gradient-x">Soul Match</span> <br />in 60 seconds
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-medium"
                            >
                                Experience the world's most intelligent social ecosystem.
                                <span className="text-white font-bold block mt-2">AI Compatibility • Real-Time Games • Secure Video</span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-6 mb-24 w-full sm:w-auto"
                            >
                                <button
                                    onClick={() => setShowWaitlist(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-pink-600 rounded-full font-black text-lg shadow-lg shadow-primary-600/40 hover:shadow-primary-600/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                                >
                                    Join the Waitlist
                                    <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => setShowDemo(true)}
                                    className="px-8 py-4 font-bold glass-morphism rounded-full hover:bg-white/10 transition-all flex items-center justify-center group border border-white/10 hover:border-white/30"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <Play size={14} className="ml-1 fill-black" />
                                    </div>
                                    Watch Demo
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative w-full max-w-5xl"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[2.5rem] blur opacity-30 animate-pulse-slow"></div>
                                <div className="glass-morphism rounded-[2rem] p-4 overflow-hidden border border-white/10 relative">
                                    <div className="bg-[#121218] rounded-3xl w-full h-[300px] md:h-[600px] flex flex-col items-center justify-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">

                                        {/* Placeholder UI for Visual Impact */}
                                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-8">
                                            <div className="w-24 h-6 bg-white/10 rounded-full"></div>
                                            <div className="flex space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                                <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/50 flex items-center justify-center">
                                                    <Heart className="text-primary-500 fill-primary-500" size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 text-center z-10">
                                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary-500 mx-auto mb-6 relative shadow-[0_0_50px_rgba(236,72,153,0.3)]">
                                                <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                                    <span className="text-5xl">👤</span>
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-500 rounded-full border-4 border-[#121218] flex items-center justify-center">
                                                    <Check size={20} className="text-black stroke-[4]" />
                                                </div>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black mb-2">Sarah, 24</h3>
                                            <div className="flex items-center justify-center space-x-2 text-primary-400 font-bold uppercase tracking-widest text-sm mb-8">
                                                <Zap size={14} className="fill-current" />
                                                <span>98% Match</span>
                                            </div>

                                            <div className="flex justify-center gap-6">
                                                <div className="w-16 h-16 rounded-full bg-[#1a1a20] border border-white/5 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 text-gray-500">
                                                    <X size={32} />
                                                </div>
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-primary-500/30">
                                                    <Heart className="text-white fill-white" size={32} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Background Elements */}
                                        <div className="absolute -left-20 top-1/2 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px]"></div>
                                        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-secondary-600/10 rounded-full blur-[80px]"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 border-y border-white/5 bg-gradient-to-r from-black via-[#0f0f13] to-black">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            {[
                                { val: "500K+", label: "Active Souls" },
                                { val: "93%", label: "Success Rate" },
                                { val: "2M+", label: "Matches Made" },
                                { val: "4.9", label: "App Rating" },
                            ].map((stat, i) => (
                                <div key={i} className="group cursor-default">
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-secondary-400 transition-all duration-300">
                                        {stat.val}
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold group-hover:text-gray-300 transition-colors">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative bg-[#0a0a0f]">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary-500 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-primary-500"></span>
                                    Next-Gen Discovery
                                </h2>
                                <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                                    Dating re-engineered <br />for the <span className="text-gradient">modern era.</span>
                                </h3>
                            </div>
                            <p className="max-w-md text-gray-400 text-lg font-medium">
                                Forget endless swiping. Our platforms prioritizes high-value interactions powered by deep-learning compatibility logic.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="text-yellow-400" />,
                                    title: "Neural Matching",
                                    desc: "Proprietary algorithms analyze 50+ personality markers to predict chemistry before you start chatting."
                                },
                                {
                                    icon: <Gamepad2 className="text-green-400" />,
                                    title: "Social Gaming",
                                    desc: "Break the ice instantly. Challenge matches to Ludo, Truth or Dare, or Quizzes directly in-chat."
                                },
                                {
                                    icon: <ShieldCheck className="text-blue-400" />,
                                    title: "Tier-1 Verify",
                                    desc: "Mandatory biometric liveness checks ensures a bot-free environment. 100% human, 0% spam."
                                },
                                {
                                    icon: <Smartphone className="text-primary-400" />,
                                    title: "Native Fluidity",
                                    desc: "Built on a high-performance React Native core for 60fps animations and instant interactions."
                                },
                                {
                                    icon: <Video className="text-purple-400" />,
                                    title: "HD Video Calls",
                                    desc: "Crystal clear, low-latency video dating built right in. See the real them without leaving the app."
                                },
                                {
                                    icon: <Star className="text-orange-400" />,
                                    title: "Creator Levels",
                                    desc: "Unlock premium tools and earn real value by becoming a top-tier community contributor."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-10 rounded-[2rem] bg-[#121218] border border-white/5 hover:border-primary-500/30 transition-all group hover:shadow-2xl hover:shadow-primary-900/10"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#1a1a20] flex items-center justify-center mb-8 group-hover:bg-primary-500/10 transition-colors">
                                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black mb-4 group-hover:text-white transition-colors text-gray-200">{feature.title}</h4>
                                    <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-32 bg-[#0d0d12]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary-500 mb-4 inline-block px-4 py-2 rounded-full bg-primary-500/10">The Algorithmic Flow</h2>
                            <h3 className="text-4xl md:text-6xl font-black mt-6">From Sign-up to Soulmate</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connector Line */}
                            <div className="absolute top-24 left-1/6 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-primary-900 to-transparent hidden md:block"></div>

                            {[
                                { step: "01", title: "Holistic Profile", desc: "Sync your interests, biometrics, and voice intro to build a 3D digital persona." },
                                { step: "02", title: "Smart Discovery", desc: "Our engine filters out incompatibility, serving you only high-potential matches." },
                                { step: "03", title: "Interactive Dating", desc: "Don't just chat. Play, watch, and connect through shared digital experiences." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center relative z-10">
                                    <div className="w-24 h-24 rounded-3xl rotate-45 bg-[#121218] border border-white/10 flex items-center justify-center mb-10 shadow-xl group hover:border-primary-500 transition-colors duration-500">
                                        <div className="-rotate-45 w-full h-full flex items-center justify-center">
                                            <span className="text-3xl font-black bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">{item.step}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                                    <p className="text-gray-500 max-w-xs leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Placeholder with Action Hook */}
                <div onClick={() => setShowDownload(true)}>
                    <Pricing />
                </div>

                {/* CTA Section */}
                <section className="py-32 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-600/5 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-[#121218] py-24 px-8 rounded-[3rem] border border-white/5 max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight relative z-10">
                                Stop searching. <br />Start <span className="text-gradient">matching.</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium relative z-10">
                                The algorithm is ready for you. Available now on all major platforms.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                                <button
                                    onClick={() => setShowDownload(true)}
                                    className="flex items-center justify-center px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10"
                                >
                                    <Smartphone className="mr-3 fill-black text-black" size={20} />
                                    Download for iOS
                                </button>
                                <button
                                    onClick={() => setShowDownload(true)}
                                    className="flex items-center justify-center px-10 py-5 bg-black text-white font-black rounded-2xl border border-white/20 hover:bg-white/5 transition-all transform hover:-translate-y-1"
                                >
                                    <CheckCircle2 size={20} className="mr-3 text-primary-500" />
                                    Get on Android
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 border-t border-white/5 bg-[#050508]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-8">
                                <Heart className="text-primary-500 fill-primary-500" size={24} />
                                <span className="text-2xl font-black italic tracking-tighter text-white">SoulMatch</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                                The world's most intelligent social app. Designed for humans, powered by state-of-the-art AI.
                            </p>
                            <div className="flex space-x-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors cursor-pointer text-gray-500">
                                        <Heart size={16} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {[
                            { title: "Platform", links: ["How it works", "Games Lobby", "AI Intelligence", "Creator Perks"] },
                            { title: "Company", links: ["Our Story", "Careers", "Press Kit", "Contact"] },
                            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Safety Center"] }
                        ].map((section, idx) => (
                            <div key={idx}>
                                <h5 className="font-bold mb-8 uppercase text-xs tracking-widest text-white">{section.title}</h5>
                                <ul className="space-y-4 text-sm text-gray-500 font-bold">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}><a href="#" className="hover:text-primary-400 transition-colors block hover:translate-x-1 duration-200">{link}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-widest pt-8 border-t border-white/5">
                        <p>© 2026 SoulMatch Technologies Inc. All rights reserved.</p>
                        <div className="flex space-x-8 mt-4 md:mt-0">
                            <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper icons
import { Check } from 'lucide-react';
