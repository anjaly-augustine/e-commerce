import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminNav from '../components/admin/AdminNav';
import { OrderTable, UserTable, ProductTable } from '../components/admin/AdminTables';
import ProductModal from '../components/admin/ProductModal';
import { Loader2, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', price: '', description: '', category: '', stock: '', images: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const endpoint = activeTab === 'users' ? 'users' : activeTab === 'orders' ? 'orders' : 'products';

        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            const fetchedData = result.data || result;
            setData(Array.isArray(fetchedData) ? fetchedData : []);
        } catch (err) {
            toast.error(`Failed to fetch ${activeTab}`);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (title, onConfirm) => {
        Swal.fire({
            title,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1c1917',
            cancelButtonColor: '#a8a29e',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
            background: document.documentElement.classList.contains('dark') ? '#1c1917' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f5f5f4' : '#1c1917',
        }).then((result) => {
            if (result.isConfirmed) onConfirm();
        });
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const endpoint = activeTab === 'users' ? 'users' : 'products';
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success(`${activeTab.slice(0, -1)} deleted`);
                fetchData();
            }
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                toast.success('Status updated');
                fetchData();
            }
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleProductSubmit = async () => {
        const token = localStorage.getItem('token');
        const productData = {
            ...productForm,
            price: Number(productForm.price),
            stock: Number(productForm.stock),
            images: Array.isArray(productForm.images)
                ? productForm.images
                : [productForm.images]
        };

        try {
            const url = editingProduct
                ? `http://localhost:3000/products/${editingProduct._id}`
                : 'http://localhost:3000/products';

            const response = await fetch(url, {
                method: editingProduct ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                toast.success(editingProduct ? 'Product updated' : 'Product added');
                setShowProductModal(false);
                fetchData();
            }
        } catch (err) {
            toast.error('Save failed');
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            stock: product.stock,
            images: product.images.join(', ')
        });
        setShowProductModal(true);
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] font-['Inter',sans-serif] transition-colors duration-300">
            <Toaster position="top-right" />
            <Navbar />

            <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12 flex flex-col lg:flex-row gap-10">
                <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="flex-1">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-4xl font-light text-stone-900 dark:text-white capitalize tracking-tight">{activeTab}</h1>
                            <p className="text-stone-500 dark:text-stone-400 mt-1">Management dashboard for your {activeTab}.</p>
                        </div>

                        {activeTab === 'products' && (
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setProductForm({ name: '', price: '', description: '', category: '', stock: '', images: '' });
                                    setShowProductModal(true);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={20} /> Add Product
                            </button>
                        )}
                    </div>

                    <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-black/20 overflow-hidden transition-colors duration-300">
                        {isLoading ? (
                            <div className="p-32 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-stone-300 dark:text-stone-600" size={48} />
                                <p className="text-stone-400 dark:text-stone-500 font-medium">Loading {activeTab}...</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500">
                                {activeTab === 'orders' && (
                                    <OrderTable data={data} onStatusUpdate={handleStatusUpdate} />
                                )}
                                {activeTab === 'users' && (
                                    <UserTable data={data} onDelete={(id) => confirmDelete("Delete User?", () => handleDelete(id))} />
                                )}
                                {activeTab === 'products' && (
                                    <ProductTable
                                        data={data}
                                        onEdit={openEditModal}
                                        onDelete={(id) => confirmDelete("Delete Product?", () => handleDelete(id))}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ProductModal
                isOpen={showProductModal}
                onClose={() => setShowProductModal(false)}
                onSubmit={handleProductSubmit}
                form={productForm}
                setForm={setProductForm}
                isEditing={!!editingProduct}
            />

            <Footer />
        </div>
    );
};

export default AdminDashboard;