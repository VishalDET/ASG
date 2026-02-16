import React from 'react';
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
import { Users, Ticket, CheckCircle, TrendingUp } from 'lucide-react';

const MOCK_DATA = [
    { name: 'Mon', visits: 45, reveals: 38, redemptions: 12 },
    { name: 'Tue', visits: 52, reveals: 42, redemptions: 18 },
    { name: 'Wed', visits: 48, reveals: 40, redemptions: 15 },
    { name: 'Thu', visits: 61, reveals: 55, redemptions: 22 },
    { name: 'Fri', visits: 85, reveals: 78, redemptions: 45 },
    { name: 'Sat', visits: 120, reveals: 110, redemptions: 65 },
    { name: 'Sun', visits: 98, reveals: 90, redemptions: 50 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-brand-green text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> {trend}
            </span>
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-white">{value}</p>
    </div>
);

const Analytics: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Analytics</h1>
                    <p className="text-slate-400 text-sm">Performance overview of your loyalty program</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2 outline-none focus:border-brand-orange">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Customers" value="1,284" icon={Users} color="brand-blue" trend="+12%" />
                <StatCard title="Cards Scratched" value="856" icon={Ticket} color="brand-orange" trend="+8%" />
                <StatCard title="Total Redemptions" value="234" icon={CheckCircle} color="brand-green" trend="+15%" />
                <StatCard title="Redemption Rate" value="27.3%" icon={TrendingUp} color="purple-500" trend="+4%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-6">Weekly Engagement</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_DATA}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-6">Redemptions vs Reveals</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Bar dataKey="reveals" fill="#f97316" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="redemptions" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
