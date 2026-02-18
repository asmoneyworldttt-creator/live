import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
    {
        name: "Standard",
        price: "Free",
        features: ["Basic Discovery", "Ad-supported", "Standard Swipes", "Public Profile"],
        cta: "Start for Free",
        popular: false
    },
    {
        name: "Premium",
        price: "$9.99/mo",
        features: ["AI Smart Match", "Ad-free Experience", "Unlimited Swipes", "Priority Support", "Mini-game Invites"],
        cta: "Go Premium",
        popular: true
    },
    {
        name: "VIP",
        price: "$24.99/mo",
        features: ["All Premium Features", "Direct Video Calling", "Stealth Mode", "Profile Boost 2x", "Creator Earnings Support"],
        cta: "Join the Elite",
        popular: false
    }
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4">Choose your journey</h2>
                    <p className="text-gray-400">Simple pricing for authentic connections.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`p-10 rounded-3xl glass-morphism border ${plan.popular ? 'border-primary-500 scale-105' : 'border-white/5'} relative flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-primary-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black mb-8">{plan.price}</div>
                            <ul className="space-y-4 mb-12 flex-grow">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center text-gray-400 text-sm">
                                        <Check size={16} className="text-primary-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signup" className={`block w-full py-4 text-center rounded-full font-bold transition-all ${plan.popular ? 'bg-primary-500 text-white' : 'glass-morphism text-white hover:bg-white/10'}`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
