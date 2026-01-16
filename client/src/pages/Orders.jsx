import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/orders/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        const currentStatus = status ? status.toLowerCase() : 'pending';

        switch (currentStatus) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            default: return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
        }
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0c0a09]">
            <Loader2 className="animate-spin text-stone-600 dark:text-stone-400" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] font-['Inter',sans-serif] transition-colors duration-300">
            <Navbar />
            <main className="max-w-5xl mx-auto py-16 px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-light text-stone-900 dark:text-white tracking-tight">Your Orders</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-2">Track and manage your recent purchases.</p>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center gap-2 text-stone-900 dark:text-white font-semibold hover:underline"
                    >
                        Continue Shopping <ChevronRight size={18} />
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-stone-900 rounded-4xl p-20 text-center border border-stone-100 dark:border-stone-800 shadow-sm transition-colors duration-300">
                        <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-stone-300 dark:text-stone-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-medium text-stone-900 dark:text-white">No orders yet</h2>
                        <p className="text-stone-500 dark:text-stone-400 mt-2 mb-8">When you buy something, it will appear here.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-all"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white dark:bg-stone-900 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                {/* Order Header */}
                                <div className="bg-stone-50 dark:bg-stone-800 px-8 py-6 flex flex-wrap justify-between items-center gap-4 border-b border-stone-100 dark:border-stone-700 transition-colors duration-300">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold mb-1">Order Placed</p>
                                            <p className="text-sm font-semibold text-stone-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold mb-1">Total Amount</p>
                                            <p className="text-sm font-semibold text-stone-900 dark:text-white">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold mb-1">Order ID</p>
                                            <p className="text-sm font-mono text-stone-500 dark:text-stone-400 uppercase">#{order._id.slice(-8)}</p>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                                        {order.status === 'delivered' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                        {order.status}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-8">
                                    <div className="divide-y divide-stone-50 dark:divide-stone-800">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="py-6 first:pt-0 last:pb-0 flex items-center gap-6">
                                                <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-2xl p-2 shrink-0 border border-stone-100 dark:border-stone-700">
                                                    <img
                                                        src={item.productId?.images || 'https://placehold.co/100'}
                                                        alt={item.productId?.name}
                                                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-stone-900 dark:text-white">{item.productId?.name || 'Product no longer available'}</h4>
                                                    <p className="text-sm text-stone-500 dark:text-stone-400">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-stone-900 dark:text-white">₹{(item.productId?.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer Actions */}
                                <div className="px-8 py-6 bg-white dark:bg-stone-900 border-t border-stone-50 dark:border-stone-800 flex justify-end">
                                    <button className="text-sm font-bold text-stone-900 dark:text-white border-2 border-stone-900 dark:border-white px-6 py-2.5 rounded-xl hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all">
                                        View Invoice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Orders;