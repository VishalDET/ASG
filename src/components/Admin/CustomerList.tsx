import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, User, Loader2, AlertCircle } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types/customer';
import CustomerDetailModal from './CustomerDetailModal';

const CustomerList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const data = await customerService.getAllCustomers();
                setCustomers(data);
                setError(null);
            } catch (err) {
                setError('Failed to load customers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const filteredCustomers = customers.filter(customer => {
        const search = searchTerm.toLowerCase();
        return (
            customer.name?.toLowerCase().includes(search) ||
            customer.phone?.includes(searchTerm) ||
            customer.email?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
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
                <div className="overflow-x-auto text-[13px]">
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
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <p className="text-slate-400 font-medium">Fetching customer records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 text-red-400">
                                            <AlertCircle className="w-8 h-8" />
                                            <p>{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => handleViewCustomer(customer)}
                                        className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                    >
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
                                                <span className="text-white text-sm font-medium">{customer.phone || 'N/A'}</span>
                                                <span className="text-slate-500 text-[10px] break-all max-w-[120px]">{customer.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-300 text-xs capitalize">{customer.gender || 'Unknown'}</span>
                                                <span className="text-slate-500 text-[10px]">
                                                    {customer.dob ? new Date(customer.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No DOB'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md w-fit ${customer.foodPreference === 'veg' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                    {customer.foodPreference || 'N/A'}
                                                </span>
                                                <span className="text-slate-400 text-[10px] font-medium capitalize">{customer.alcoholPreference || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-white font-bold text-lg">{customer.visitCount}</p>
                                                <p className="text-slate-500 text-[9px] uppercase font-black">Visits</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        {customers.length > 0 ? `Total ${customers.length} customers recorded` : 'No customers recorded'}
                    </span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700">Next</button>
                    </div>
                </div>
            </div>
            <CustomerDetailModal
                customer={selectedCustomer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CustomerList;
