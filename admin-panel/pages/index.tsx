import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import {
    Users,
    Star,
    PhoneCall,
    TrendingUp,
    Wallet,
    AlertCircle,
    LayoutDashboard,
    ShieldCheck,
    CreditCard,
    LogOut,
    Bell,
    Search,
    Settings,
    Heart,
    Smartphone
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface DashboardStats {
    totalUsers: number;
    totalCreators: number;
    activeCalls: number;
    totalRevenue: number;
    pendingWithdrawals: number;
    todaySignups: number;
}

interface RecentUser {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    role: string;
    coin_balance: number;
    is_verified: boolean;
}

const mockChartData = [
    { name: 'Mon', signups: 120, revenue: 450 },
    { name: 'Tue', signups: 156, revenue: 520 },
    { name: 'Wed', signups: 189, revenue: 680 },
    { name: 'Thu', signups: 210, revenue: 750 },
    { name: 'Fri', signups: 345, revenue: 1200 },
    { name: 'Sat', signups: 420, revenue: 1500 },
    { name: 'Sun', signups: 380, revenue: 1350 },
];

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalCreators: 0,
        activeCalls: 0,
        totalRevenue: 2450.50, // Example
        pendingWithdrawals: 0,
        todaySignups: 0
    });
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [usersCount, creatorsCount, callsCount, withdrawalsData, todayUsers] = await Promise.all([
                supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
                supabaseAdmin.from('creator_profiles').select('*', { count: 'exact', head: true }),
                supabaseAdmin.from('calls').select('*', { count: 'exact', head: true }).eq('status', 'initiated'),
                supabaseAdmin.from('withdrawals').select('amount').eq('status', 'pending'),
                supabaseAdmin.from('users').select('*', { count: 'exact', head: true })
                    .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
            ]);

            const pendingTotal = withdrawalsData.data?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

            setStats(prev => ({
                ...prev,
                totalUsers: usersCount.count || 0,
                totalCreators: creatorsCount.count || 0,
                activeCalls: callsCount.count || 0,
                pendingWithdrawals: pendingTotal,
                todaySignups: todayUsers.count || 0
            }));

            const { data: users } = await supabaseAdmin
                .from('users')
                .select('id, full_name, email, created_at, role, coin_balance, is_verified')
                .order('created_at', { ascending: false })
                .limit(8);

            setRecentUsers(users || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400 font-bold tracking-widest uppercase text-xs">Synchronizing Neural Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0f0f17] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#12121a] border-r border-white/5 flex flex-col">
                <div className="p-8 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <HeartIcon className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black italic">SoulMatch</span>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <NavItem icon={<Users size={20} />} label="User Management" />
                    <NavItem icon={<ShieldCheck size={20} />} label="Moderation" badge="3" />
                    <NavItem icon={<CreditCard size={20} />} label="Withdrawals" />
                    <NavItem icon={<TrendingUp size={20} />} label="Analytics" />
                    <NavItem icon={<Settings size={20} />} label="System Settings" />
                </nav>

                <div className="p-6">
                    <button className="flex items-center space-x-3 text-gray-500 hover:text-red-400 transition-colors font-bold text-sm">
                        <LogOut size={18} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                {/* Header */}
                <header className="h-20 bg-[#12121a]/50 backdrop-blur-md border-b border-white/5 px-8 flex justify-between items-center sticky top-0 z-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search globally across nodes..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-violet-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 rounded-full text-[10px] flex items-center justify-center font-bold">5</span>
                        </button>
                        <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
                            <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-0.5 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-[#12121a] flex items-center justify-center text-[10px] font-black italic">ADM</div>
                            </div>
                            <span className="text-sm font-bold text-gray-300">Super Admin</span>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Welcome */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-black mb-2">Welcome Back, <span className="gradient-text">Commander</span></h2>
                        <p className="text-gray-500 font-medium">Platform efficiency is currently <span className="text-green-400">Optimal (98.4%)</span>. All systems nominal.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatItem icon={<Users />} label="Neural Nodes" value={stats.totalUsers} trend="+12% this week" color="text-blue-400" />
                        <StatItem icon={<Star />} label="Prime Creators" value={stats.totalCreators} trend="+4 active today" color="text-purple-400" />
                        <StatItem icon={<TrendingUp />} label="Matches Created" value="48.2K" trend="+820 today" color="text-pink-400" />
                        <StatItem icon={<Wallet />} label="Est. Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} trend="+15% organic growth" color="text-green-400" />
                    </div>

                    {/* Charts & Reports */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2 admin-card overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">Activity Overview</h3>
                                    <p className="text-xs text-gray-600 uppercase font-black tracking-widest mt-1">Real-time user telemetry</p>
                                </div>
                                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockChartData}>
                                        <defs>
                                            <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#161621', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="signups" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSignups)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="admin-card">
                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 mb-8 text-center italic">Critical Alerts</h3>
                            <div className="space-y-6">
                                <AlertItem icon={<AlertCircle size={18} className="text-red-400" />} title="Report #402" desc="Hate speech reported by User_22" time="2m ago" color="bg-red-500/10" />
                                <AlertItem icon={<Wallet size={18} className="text-yellow-400" />} title="Withdrawal Req" desc="User_89 requested $450.00" time="15m ago" color="bg-yellow-500/10" />
                                <AlertItem icon={<SmartphoneIcon size={18} className="text-blue-400" />} title="Sys Upgrade" desc="Node sync in 4 hours" time="Planned" color="bg-blue-500/10" />
                            </div>
                            <button className="w-full mt-10 py-3 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 uppercase tracking-widest font-black hover:bg-white/[0.02] hover:border-violet-500/50 transition-all">
                                View Command Log
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="admin-card">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black tracking-widest uppercase text-gray-400 italic">Recent Neural Links</h3>
                            <button className="text-xs font-black uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors">View All Nodes</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="table-header">Identity</th>
                                        <th className="table-header">Protocol</th>
                                        <th className="table-header">Status</th>
                                        <th className="table-header">Balance</th>
                                        <th className="table-header">Link Time</th>
                                        <th className="table-header text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="table-cell">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-black italic text-gray-400">
                                                        {user.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-200">{user.full_name}</div>
                                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${user.role === 'creator' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/10 text-gray-500'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                {user.is_verified ? (
                                                    <div className="flex items-center text-green-400 text-[10px] font-black uppercase tracking-widest">
                                                        <ShieldCheck size={12} className="mr-1" /> Verified
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Standard</div>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center text-yellow-400 font-bold">
                                                    <span className="mr-1">🪙</span> {user.coin_balance.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="table-cell text-gray-600 font-bold">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="table-cell text-right">
                                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-violet-500/20 text-violet-400 rounded-lg transition-colors"><EditIcon size={16} /></button>
                                                    <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><ShieldCheck size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, badge = "" }: { icon: any; label: string; active?: boolean; badge?: string }) {
    return (
        <a
            href="#"
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}`}
        >
            <div className="flex items-center space-x-3">
                <span className={active ? 'text-white' : 'text-gray-500 group-hover:text-violet-400 transition-colors'}>{icon}</span>
                <span className="text-sm font-bold">{label}</span>
            </div>
            {badge && (
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {badge}
                </span>
            )}
        </a>
    );
}

function StatItem({ icon, label, value, trend, color }: { icon: any; label: string; value: any; trend: string; color: string }) {
    return (
        <div className="admin-card">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-white/5 rounded-xl ${color}`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-green-400">{trend}</div>
            </div>
            <div className="text-2xl font-black mb-1">{value}</div>
            <div className="text-xs text-gray-600 uppercase font-black tracking-widest italic">{label}</div>
        </div>
    );
}

function AlertItem({ icon, title, desc, time, color }: { icon: any; title: string; desc: string; time: string; color: string }) {
    return (
        <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${color}`}>
                {icon}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-bold text-gray-200">{title}</span>
                    <span className="text-[10px] text-gray-600 font-bold italic">{time}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{desc}</p>
            </div>
        </div>
    );
}

// Minimal icons
const HeartIcon = ({ size, className }: any) => <Heart className={className} size={size} fill="currentColor" />;
const EditIcon = ({ size }: any) => <Settings size={size} />;
const SmartphoneIcon = ({ size, className }: any) => <Smartphone className={className} size={size} />;
