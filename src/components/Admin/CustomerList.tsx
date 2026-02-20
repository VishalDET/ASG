import React, { useState } from 'react';
import { Search, Filter, MoreVertical, User } from 'lucide-react';

const MOCK_CUSTOMERS = [
    { id: 1, name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', gender: 'male', dob: '1995-05-15', foodPreference: 'non-veg', alcoholPreference: 'Whiskey', visits: 12, lastVisit: '2026-02-14', totalReveals: 8 },
    { id: 2, name: 'Priya Patel', phone: '9123456789', email: 'priya@example.com', gender: 'female', dob: '1998-08-22', foodPreference: 'veg', alcoholPreference: 'Wine', visits: 5, lastVisit: '2026-02-15', totalReveals: 4 },
    { id: 3, name: 'Amit Kumar', phone: '8877665544', email: 'amit@example.com', gender: 'male', dob: '1990-12-01', foodPreference: 'non-veg', alcoholPreference: 'Beer', visits: 22, lastVisit: '2026-02-10', totalReveals: 15 },
    { id: 4, name: 'Sneha Gupta', phone: '7766554433', email: 'sneha@example.com', gender: 'female', dob: '2000-01-10', foodPreference: 'veg', alcoholPreference: 'None', visits: 2, lastVisit: '2026-02-16', totalReveals: 2 },
    { id: 5, name: 'Vikram Singh', phone: '9988776655', email: 'vikram@example.com', gender: 'male', dob: '1988-03-30', foodPreference: 'non-veg', alcoholPreference: 'Rum', visits: 8, lastVisit: '2026-02-12', totalReveals: 6 },
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
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary text-sm"
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
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Bio</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Preferences</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Engagement</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_CUSTOMERS.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                <User size={18} />
                                            </div>
                                            <span className="font-medium text-white">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">{customer.phone}</span>
                                            <span className="text-slate-500 text-[10px] break-all max-w-[120px]">{customer.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-300 text-xs capitalize">{customer.gender}</span>
                                            <span className="text-slate-500 text-[10px]">{new Date(customer.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md w-fit ${customer.foodPreference === 'veg' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                {customer.foodPreference}
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-medium">{customer.alcoholPreference}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-6">
                                            <div className="text-center">
                                                <p className="text-white font-bold">{customer.visits}</p>
                                                <p className="text-slate-500 text-[9px] uppercase font-black">Visits</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-bold">{customer.totalReveals}</p>
                                                <p className="text-slate-500 text-[9px] uppercase font-black">Reveals</p>
                                            </div>
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
