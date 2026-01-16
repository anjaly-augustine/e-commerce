import React from 'react';
import { ShoppingBag, Users, Package } from 'lucide-react';

const AdminNavBtn = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all w-full
            ${active 
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-lg' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
            }`}
    >
        {icon} {label}
    </button>
);

const AdminNav = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-full lg:w-64 flex flex-col gap-2">
            <h2 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-4 mb-4">
                Admin Panel
            </h2>
            <AdminNavBtn 
                icon={<ShoppingBag size={20} />} 
                label="Orders" 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')} 
            />
            <AdminNavBtn 
                icon={<Users size={20} />} 
                label="Users" 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
            />
            <AdminNavBtn 
                icon={<Package size={20} />} 
                label="Products" 
                active={activeTab === 'products'} 
                onClick={() => setActiveTab('products')} 
            />
        </aside>
    );
};

export default AdminNav;