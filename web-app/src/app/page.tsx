"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Search,
    MessageCircle,
    Video,
    Gamepad2,
    Zap,
    ShieldCheck,
    Smartphone,
    ChevronRight,
    Star,
    Download,
    CheckCircle2
} from 'lucide-react';
import { Pricing } from '@/components/Pricing';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-morphism py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Heart className="text-primary-500 fill-primary-500" size={32} />
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
                            SoulMatch
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-primary-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary-400 transition-colors">How it Works</a>
                        <a href="#testimonials" className="hover:text-primary-400 transition-colors">Stories</a>
                    </div>

                    <button className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95">
                        Download App
                    </button>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -mr-64 -mt-32 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-600/10 rounded-full blur-[100px] -ml-40 -mb-20"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-morphism mb-8 border border-white/5"
                            >
                                <Zap size={16} className="text-primary-400" />
                                <span className="text-xs font-bold tracking-widest uppercase text-primary-200">AI Matchmaking is Live</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-5xl md:text-8xl font-black mb-6 tracking-tight"
                            >
                                Find your <span className="text-gradient">Soul Match</span> <br />in 60 seconds
                            </motion.h1>

                            <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                                Experience the world's most intelligent social app. AI compatibility,
                                real-time games, and authentic conversations designed for true connections.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-20">
                                <button className="btn-premium">
                                    Join the Waitlist
                                    <ChevronRight size={20} className="ml-2" />
                                </button>
                                <button className="px-8 py-4 font-bold glass-morphism rounded-full hover:bg-white/10 transition-all flex items-center justify-center">
                                    <Video size={20} className="mr-2 text-primary-400" />
                                    Watch Demo
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative w-full max-w-4xl"
                            >
                                <div className="glass-morphism rounded-3xl p-4 overflow-hidden border border-white/10 shadow-2xl skew-x-1 transform hover:skew-x-0 transition-transform duration-700">
                                    <div className="bg-[#121218] rounded-2xl w-full h-[300px] md:h-[500px] flex items-center justify-center">
                                        <Heart className="text-primary-500/10 fill-primary-500/10" size={200} />
                                        <span className="absolute text-primary-400 font-bold opacity-50 tracking-widest uppercase">Visual Preview Placeholder</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2">500K+</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Active Members</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2">98%</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Match Accuracy</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2">2M+</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Games Played</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2">24/7</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Safety Support</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary-500 mb-4 italic">Next-Gen Discovery</h2>
                                <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                    Beyond simple swiping. <br />Engage with <span className="text-primary-400">intelligence.</span>
                                </h3>
                            </div>
                            <p className="max-w-md text-gray-500 text-lg">
                                Every interaction is powered by our proprietary Neural Match Engine™ to ensure quality over quantity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="text-yellow-400" />,
                                    title: "AI Compatibility",
                                    desc: "Our AI analyzes personality, interests, and goals to provide a detailed match score before you even say hello."
                                },
                                {
                                    icon: <Gamepad2 className="text-green-400" />,
                                    title: "Mini-Games Lobby",
                                    desc: "Break the ice with multiplayer games like Ludo and Spin the Wheel. Fun is built-in to every match."
                                },
                                {
                                    icon: <ShieldCheck className="text-blue-400" />,
                                    title: "Zero-Bot Policy",
                                    desc: "Biometric verification ensures you only talk to real, authenticated users. A safer, cleaner community."
                                },
                                {
                                    icon: <Smartphone className="text-primary-400" />,
                                    title: "Native Speed",
                                    desc: "A lightning-fast React Native engine ensures everything from video calls to games runs smoothly."
                                },
                                {
                                    icon: <Search className="text-purple-400" />,
                                    title: "Smart Search",
                                    desc: "Advanced filters let you find exactly who you're looking for by interests, hobbies, or location."
                                },
                                {
                                    icon: <Star className="text-orange-400" />,
                                    title: "Creator Economy",
                                    desc: "Top performers can earn coins and build followings, creating a sustainable ecosystem for everyone."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-10 rounded-3xl glass-morphism border border-white/5 hover:border-primary-500/30 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary-500/20 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                                    <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-32 bg-white/[0.01]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary-500 mb-4 italic">The Process</h2>
                            <h3 className="text-4xl md:text-6xl font-black">How SoulMatch works</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            <div className="absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>

                            {[
                                { step: "01", title: "Create Profile", desc: "Share your passions, goals, and a few photos to help our AI understand you." },
                                { step: "02", title: "Smart Discovery", desc: "Review AI-recommended profiles with deep compatibility breakdowns." },
                                { step: "03", title: "Start Playing", desc: "Jump into a game or a video call. Authentic connections start with action." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center relative z-10">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-2xl font-black mb-8 shadow-xl shadow-primary-500/20">
                                        {item.step}
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                                    <p className="text-gray-500 max-w-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Pricing />

                {/* CTA Section */}
                <section className="py-32 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-600/10 pointer-events-none"></div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="glass-morphism py-20 px-8 rounded-3xl border border-white/10 max-w-5xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">Ready to find your <br /><span className="text-gradient">forever?</span></h2>
                            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                                Join thousands of others who matched today. Available now on iOS and Android.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button className="flex items-center justify-center px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all transform hover:-translate-y-1">
                                    <Smartphone className="mr-3" />
                                    Get for iOS
                                </button>
                                <button className="flex items-center justify-center px-10 py-5 bg-black text-white font-black rounded-2xl border border-white/20 hover:bg-white/5 transition-all transform hover:-translate-y-1">
                                    <CheckCircle2 size={18} className="mr-3 text-primary-400" />
                                    Google Play
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-8">
                                <Heart className="text-primary-500 fill-primary-500" size={24} />
                                <span className="text-xl font-black italic">SoulMatch</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                The world's most intelligent social app. Designed for humans, powered by AI.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-8 h-8 rounded-full glass-morphism border border-white/5"></div>
                                <div className="w-8 h-8 rounded-full glass-morphism border border-white/5"></div>
                                <div className="w-8 h-8 rounded-full glass-morphism border border-white/5"></div>
                            </div>
                        </div>

                        {[
                            { title: "Platform", links: ["How it works", "Games Lobby", "AI Intelligence", "Creator Perks"] },
                            { title: "Company", links: ["Our Story", "Privacy Policy", "Terms of Service", "Security"] },
                            { title: "Support", links: ["Help Center", "Contact Us", "Report a Bug", "Trust & Safety"] }
                        ].map((section, idx) => (
                            <div key={idx}>
                                <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400 font-black">{section.title}</h5>
                                <ul className="space-y-4 text-sm text-gray-500 font-bold">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}><a href="#" className="hover:text-primary-400 transition-colors">{link}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-widest">
                        <p>© 2026 SoulMatch Technologies Inc.</p>
                        <div className="flex space-x-8 mt-4 md:mt-0">
                            <a href="#">Status</a>
                            <a href="#">Guidelines</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
