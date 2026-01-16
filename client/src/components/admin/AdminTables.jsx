import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

// --- ORDERS ---
export const OrderTable = ({ data, onStatusUpdate }) => (
    <table className="w-full text-left border-collapse">
        <thead className="bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700 transition-colors">
            <tr>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Order / Date</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Customer</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Amount</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Status</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
            {data.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-8 py-6">
                        <p className="font-bold text-stone-900 dark:text-white">#{order._id?.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                        <p className="font-medium text-stone-900 dark:text-white">{order.userId?.name || 'Guest'}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">{order.userId?.email}</p>
                    </td>
                    <td className="px-8 py-6 font-bold text-stone-900 dark:text-white">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-8 py-6">
                        <select
                            value={order.status}
                            onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                            className="bg-stone-100 dark:bg-stone-800 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none text-stone-900 dark:text-white transition-colors"
                        >
                            <option value="pending">PENDING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                        </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <Edit size={18} className="text-stone-300 dark:text-stone-600 inline cursor-pointer hover:text-stone-900 dark:hover:text-white transition-colors" />
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

// --- USERS ---
export const UserTable = ({ data, onDelete }) => (
    <table className="w-full text-left border-collapse">
        <thead className="bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700 transition-colors">
            <tr>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">User</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Role</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
            {data.map((user) => (
                <tr key={user._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-stone-900 dark:text-white">
                        {user.name}
                        <p className="text-xs text-stone-400 dark:text-stone-500 font-normal">{user.email}</p>
                    </td>
                    <td className="px-8 py-6 font-black uppercase text-[10px] text-stone-900 dark:text-white">{user.role}</td>
                    <td className="px-8 py-6 text-right">
                        <button 
                            onClick={() => onDelete(user._id)} 
                            className="text-red-300 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

// --- PRODUCTS ---
export const ProductTable = ({ data, onEdit, onDelete }) => (
    <table className="w-full text-left border-collapse">
        <thead className="bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700 transition-colors">
            <tr>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Product</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Price</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase">Stock</th>
                <th className="px-8 py-5 text-stone-400 dark:text-stone-500 font-bold text-xs uppercase text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
            {data.map((product) => (
                <tr key={product._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-8 py-6 flex items-center gap-4">
                        <img 
                            src={product.images?.[0]} 
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-stone-800" 
                            alt="" 
                        />
                        <span className="font-bold text-stone-900 dark:text-white">{product.name}</span>
                    </td>
                    <td className="px-8 py-6 font-bold text-stone-900 dark:text-white">₹{product.price}</td>
                    <td className="px-8 py-6 text-stone-900 dark:text-white">{product.stock} units</td>
                    <td className="px-8 py-6 text-right flex justify-end gap-3">
                        <button 
                            onClick={() => onEdit(product)} 
                            className="text-stone-300 dark:text-stone-600 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            onClick={() => onDelete(product._id)} 
                            className="text-red-300 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);