import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import {
    Users,
    Search,
    Filter,
    ShieldCheck,
    ShieldAlert,
    Ban,
    CheckCircle2,
    MoreVertical,
    ArrowLeft,
    LayoutDashboard,
    ShieldX
} from 'lucide-react';

interface User {
    id: string;
    full_name: string;
    username: string;
    email: string;
    role: string;
    is_verified: boolean;
    is_banned: boolean;
    coin_balance: number;
    created_at: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabaseAdmin
                .from('users')
                .update({ is_banned: !currentStatus })
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: !currentStatus } : u));
        } catch (error) {
            alert('Operation failed');
        }
    };

    const toggleVerify = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabaseAdmin
                .from('users')
                .update({ is_verified: !currentStatus })
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !currentStatus } : u));
        } catch (error) {
            alert('Verification update failed');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'creators') return matchesSearch && u.role === 'creator';
        if (filter === 'banned') return matchesSearch && u.is_banned;
        if (filter === 'verified') return matchesSearch && u.is_verified;
        return matchesSearch;
    });

    return (
        <div className="flex min-h-screen bg-[#0f0f17]">
            {/* Simple Sidebar Navigation */}
            <aside className="w-20 lg:w-64 bg-[#12121a] border-r border-white/5 flex flex-col py-8 items-center lg:items-stretch">
                <a href="/" className="lg:px-8 mb-12 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <Users className="text-white" size={20} />
                    </div>
                    <span className="hidden lg:block text-xl font-black italic">Admin</span>
                </a>

                <nav className="flex-grow space-y-4 lg:px-4">
                    <a href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
                        <LayoutDashboard size={20} />
                        <span className="hidden lg:block font-bold">Control Center</span>
                    </a>
                    <a href="/users" className="flex items-center space-x-3 px-4 py-3 bg-violet-600 text-white shadow-lg shadow-violet-900/40 rounded-xl">
                        <Users size={20} />
                        <span className="hidden lg:block font-bold">Neural Nodes</span>
                    </a>
                </nav>
            </aside>

            <main className="flex-grow p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-black mb-2">User <span className="gradient-text">Management</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Registry of all linked neural identities</p>
                    </div>

                    <div className="flex space-x-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search identity..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-violet-500 outline-none transition-all"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                        >
                            <option value="all">All Modes</option>
                            <option value="creators">Creators</option>
                            <option value="verified">Verified</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
                    </div>
                ) : (
                    <div className="admin-card">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="table-header">Identity & Protocol</th>
                                        <th className="table-header">Auth Status</th>
                                        <th className="table-header">Nodes Balance</th>
                                        <th className="table-header text-right">Direct Directives</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="table-cell">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-lg ${user.is_banned ? 'bg-red-900/20 text-red-500' : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400'}`}>
                                                        {user.full_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-200">{user.full_name || 'Anonymous'}</div>
                                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">@{user.username || 'unregistered'} • {user.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex space-x-4">
                                                    {user.is_verified ? (
                                                        <div className="flex items-center text-green-400 text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 size={12} className="mr-1" /> Primary Link
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Secondary</div>
                                                    )}

                                                    {user.is_banned && (
                                                        <div className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                            <Ban size={12} className="mr-1" /> Terminated
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <div className="font-black text-violet-400">🪙 {user.coin_balance.toLocaleString()}</div>
                                            </td>
                                            <td className="table-cell text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => toggleVerify(user.id, user.is_verified)}
                                                        className={`p-2 rounded-lg transition-all ${user.is_verified ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                                        title={user.is_verified ? "Revoke Verification" : "Verify User"}
                                                    >
                                                        <ShieldCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleBan(user.id, user.is_banned)}
                                                        className={`p-2 rounded-lg transition-all ${user.is_banned ? 'text-red-500 bg-red-500/10 shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'}`}
                                                        title={user.is_banned ? "Release Link" : "Terminate Link"}
                                                    >
                                                        <ShieldX size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
