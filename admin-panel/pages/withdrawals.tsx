import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import {
    Wallet,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    Users,
    LayoutDashboard,
    ArrowUpRight
} from 'lucide-react';

interface Withdrawal {
    id: string;
    user_id: string;
    amount: number;
    method: string;
    destination: string;
    status: string;
    created_at: string;
    user: {
        full_name: string;
        email: string;
    }
}

export default function WithdrawalManagement() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseAdmin
                .from('withdrawals')
                .select('*, user:users(full_name, email)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWithdrawals(data || []);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const { error } = await supabaseAdmin
                .from('withdrawals')
                .update({ status: newStatus, processed_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: newStatus } : w));
        } catch (error) {
            alert('Action failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0f0f17]">
            <aside className="w-20 lg:w-64 bg-[#12121a] border-r border-white/5 flex flex-col py-8 items-center lg:items-stretch">
                <a href="/" className="lg:px-8 mb-12 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <Wallet className="text-white" size={20} />
                    </div>
                    <span className="hidden lg:block text-xl font-black italic">Admin</span>
                </a>

                <nav className="flex-grow space-y-4 lg:px-4">
                    <a href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
                        <LayoutDashboard size={20} />
                        <span className="hidden lg:block font-bold">Control Center</span>
                    </a>
                    <a href="/users" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
                        <Users size={20} />
                        <span className="hidden lg:block font-bold">Neural Nodes</span>
                    </a>
                    <a href="/withdrawals" className="flex items-center space-x-3 px-4 py-3 bg-violet-600 text-white shadow-lg shadow-violet-900/40 rounded-xl">
                        <Wallet size={20} />
                        <span className="hidden lg:block font-bold">Treasury Flow</span>
                    </a>
                </nav>
            </aside>

            <main className="flex-grow p-8 overflow-y-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black mb-2">Treasury <span className="gradient-text">Settlements</span></h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Processing outgoing liquidity to creators</p>
                </div>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {withdrawals.length === 0 ? (
                            <div className="admin-card text-center py-20">
                                <Clock size={48} className="text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No pending liquidity requests</p>
                            </div>
                        ) : (
                            withdrawals.map((w) => (
                                <div key={w.id} className="admin-card flex flex-col md:flex-row justify-between items-center group">
                                    <div className="flex items-center space-x-6 w-full md:w-auto mb-6 md:mb-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 ${w.status === 'pending' ? 'text-yellow-400' : w.status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                                            <ArrowUpRight size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-black text-xl text-gray-100">${w.amount.toFixed(2)}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${w.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : w.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {w.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter">
                                                {w.user?.full_name} • {w.method} • {w.destination}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                                        <div className="text-right mr-6 hidden md:block">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Requested</p>
                                            <p className="text-xs font-bold text-gray-400 lowercase italic">{new Date(w.created_at).toLocaleString()}</p>
                                        </div>

                                        {w.status === 'pending' && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleAction(w.id, 'rejected')}
                                                    className="px-6 py-2 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAction(w.id, 'approved')}
                                                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Approve Payment
                                                </button>
                                            </div>
                                        )}

                                        {w.status !== 'pending' && (
                                            <div className="w-40 text-center py-2 bg-white/5 rounded-xl border border-white/5 opacity-50">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Settled Integrity</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
