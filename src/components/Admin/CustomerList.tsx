import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Phone, Calendar, User } from 'lucide-react';

const MOCK_CUSTOMERS = [
    { id: 1, name: 'Rahul Sharma', phone: '9876543210', visits: 12, lastVisit: '2026-02-14', totalReveals: 8 },
    { id: 2, name: 'Priya Patel', phone: '9123456789', visits: 5, lastVisit: '2026-02-15', totalReveals: 4 },
    { id: 3, name: 'Amit Kumar', phone: '8877665544', visits: 22, lastVisit: '2026-02-10', totalReveals: 15 },
    { id: 4, name: 'Sneha Gupta', phone: '7766554433', visits: 2, lastVisit: '2026-02-16', totalReveals: 2 },
    { id: 5, name: 'Vikram Singh', phone: '9988776655', visits: 8, lastVisit: '2026-02-12', totalReveals: 6 },
];

const CustomerList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Customer Database</h1>
                    <p className="text-slate-400 text-sm">Manage and track your customer engagement</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-brand-orange text-sm"
                        />
                    </div>
                    <button className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Visits</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Reveals</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_CUSTOMERS.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                                                <User size={18} />
                                            </div>
                                            <span className="font-medium text-white">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700">
                                            {customer.visits}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{customer.totalReveals}</td>
                                    <td className="px-6 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(customer.lastVisit).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Showing 5 of 1,284 customers</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerList;
