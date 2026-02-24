import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Users, Ticket, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import { dashboardService, DashboardMetrics } from '../../services/dashboardService';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="text-success text-sm font-medium flex items-center gap-1">
                    <TrendingUp size={14} /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-white">{value}</p>
    </div>
);

const Analytics: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            const data = await dashboardService.getDashboardMetrics(days);
            setMetrics(data);
            setLoading(false);
        };
        fetchMetrics();
    }, [days]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-400 font-medium tracking-wide">Loading Dashboard Metrics...</p>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-red-400 font-medium bg-red-400/10 px-6 py-4 rounded-xl border border-red-400/20">
                    Failed to load dashboard metrics. Ensure the server is online.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Analytics</h1>
                    <p className="text-slate-400 text-sm">Performance overview of your loyalty program</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2 outline-none focus:border-primary text-white"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Customers" value={metrics.totalCustomers.toLocaleString()} icon={Users} color="primary" />
                <StatCard title="Active Offers" value={metrics.activeOffers.toLocaleString()} icon={Ticket} color="accent" />
                <StatCard title="Total Redemptions" value={metrics.totalRedemptions.toLocaleString()} icon={CheckCircle} color="success" />
                <StatCard title="Pending Redemptions" value={metrics.pendingRedemptions.toLocaleString()} icon={TrendingUp} color="info" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Weekly Engagement</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.engagementChart}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D82818" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D82818" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #2A2E36', borderRadius: '8px' }}
                                    itemStyle={{ color: '#D82818' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#D82818" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Redemptions vs Reveals</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.redemptionChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #2A2E36', borderRadius: '8px' }}
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                />
                                <Bar dataKey="reveals" fill="#F0D880" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="redemptions" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
