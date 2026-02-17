import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import {
    AlertCircle,
    ShieldAlert,
    CheckCircle2,
    Trash2,
    Users,
    LayoutDashboard,
    Wallet,
    MessageSquare,
    UserX,
    History
} from 'lucide-react';

interface Report {
    id: string;
    reporter_id: string;
    reported_user_id: string;
    reason: string;
    description: string;
    status: string;
    created_at: string;
    reporter: { full_name: string };
    reported: { full_name: string };
}

export default function ReportManagement() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseAdmin
                .from('reports')
                .select(`
                    *,
                    reporter:users!reporter_id(full_name),
                    reported:users!reported_user_id(full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const resolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
        try {
            const { error } = await supabaseAdmin
                .from('reports')
                .update({ status, resolved_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            setReports(reports.map(r => r.id === id ? { ...r, status } : r));
        } catch (error) {
            alert('Action failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0f0f17]">
            <aside className="w-20 lg:w-64 bg-[#12121a] border-r border-white/5 flex flex-col py-8 items-center lg:items-stretch">
                <a href="/" className="lg:px-8 mb-12 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <ShieldAlert className="text-white" size={20} />
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
                    <a href="/withdrawals" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
                        <Wallet size={20} />
                        <span className="hidden lg:block font-bold">Treasury Flow</span>
                    </a>
                    <a href="/reports" className="flex items-center space-x-3 px-4 py-3 bg-violet-600 text-white shadow-lg shadow-violet-900/40 rounded-xl">
                        <ShieldAlert size={20} />
                        <span className="hidden lg:block font-bold">Safety Feed</span>
                    </a>
                </nav>
            </aside>

            <main className="flex-grow p-8 overflow-y-auto">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Safety <span className="gradient-text">Feed</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Active moderation queue and protocol violations</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Queue Status</p>
                        <p className="text-2xl font-black text-violet-400">{reports.filter(r => r.status === 'pending').length} ACTIVE</p>
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reports.length === 0 ? (
                            <div className="admin-card text-center py-20 border-dashed border-white/10">
                                <History size={48} className="text-gray-800 mx-auto mb-4" />
                                <p className="text-gray-600 font-black uppercase tracking-widest text-xs italic">System Clear. No violations detected.</p>
                            </div>
                        ) : (
                            reports.map((r) => (
                                <div key={r.id} className={`admin-card border-l-4 ${r.status === 'pending' ? 'border-l-pink-600' : 'border-l-gray-800 opacity-60'}`}>
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-grow">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${r.status === 'pending' ? 'bg-pink-600 text-white animate-pulse' : 'bg-white/5 text-gray-500'}`}>
                                                    {r.status}
                                                </div>
                                                <span className="text-xs font-bold text-gray-500">{new Date(r.created_at).toLocaleString()}</span>
                                            </div>

                                            <h4 className="text-xl font-bold mb-2 flex items-center">
                                                <MessageSquare size={18} className="mr-2 text-violet-500" />
                                                {r.reason}
                                            </h4>

                                            <p className="text-gray-400 text-sm mb-6 bg-white/[0.02] p-4 rounded-xl border border-white/5 italic">
                                                "{r.description || 'No additional details provided.'}"
                                            </p>

                                            <div className="flex items-center space-x-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Reporter Agent</p>
                                                    <p className="text-sm font-bold text-gray-300">{r.reporter?.full_name || 'Node_X'}</p>
                                                </div>
                                                <div className="h-8 w-px bg-white/5"></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1 italic">Subject Node</p>
                                                    <p className="text-sm font-bold text-red-400 underline decoration-pink-500/30 underline-offset-4">{r.reported?.full_name || 'Target_Y'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end min-w-[200px]">
                                            {r.status === 'pending' ? (
                                                <div className="flex flex-col space-y-3 w-full">
                                                    <button
                                                        onClick={() => resolveReport(r.id, 'dismissed')}
                                                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5"
                                                    >
                                                        Dismiss False Alert
                                                    </button>
                                                    <button
                                                        onClick={() => resolveReport(r.id, 'resolved')}
                                                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                                                    >
                                                        <UserX size={16} className="mr-2" />
                                                        Enforce Resolution
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-500 font-black uppercase tracking-widest text-sm space-x-2">
                                                    <CheckCircle2 size={20} />
                                                    <span>Secured</span>
                                                </div>
                                            )}
                                        </div>
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
