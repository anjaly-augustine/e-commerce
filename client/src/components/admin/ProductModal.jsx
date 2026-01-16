import React from 'react';
import { X, UploadCloud, Info } from 'lucide-react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

const ProductModal = ({ isOpen, onClose, onSubmit, form, setForm, isEditing }) => {
    if (!isOpen) return null;

    const handleUploadChange = (e) => {
        console.log('Full event:', e);
        const cdnUrl = e.detail?.cdnUrl ||
            e.cdnUrl ||
            e.allEntries?.[0]?.cdnUrl ||
            e.data?.cdnUrl;

        if (cdnUrl) {
            setForm({ ...form, images: cdnUrl });
            console.log('Image URL set:', cdnUrl);
        } else {
            console.error('Could not find CDN URL in event:', e);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 transition-colors">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-stone-50 dark:border-stone-800 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-stone-400 dark:text-stone-500 text-xs uppercase tracking-widest font-semibold mt-1">
                            {isEditing ? 'Modify existing inventory' : 'Create a new catalog item'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* General Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                            <Info size={16} /> General Information
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase ml-2">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Nike Air Max 270"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 outline-none transition-all font-medium text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase ml-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 outline-none transition-all font-medium text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase ml-2">Available Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 outline-none transition-all font-medium text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                            <UploadCloud size={16} /> Product Media
                        </h3>
                        <div className="p-8 border-2 border-dashed border-stone-100 dark:border-stone-700 rounded-[2rem] bg-stone-50 dark:bg-stone-800 flex flex-col items-center justify-center text-center transition-colors">
                            <FileUploaderRegular
                                pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
                                maxLocalFileSizeBytes={10000000}
                                multiple={false}
                                imgOnly={true}
                                sourceList="local, url, camera"
                                className="uc-stone"
                                onChange={handleUploadChange}
                            />
                            {form.images ? (
                                <div className="mt-8 animate-in fade-in zoom-in-95">
                                    <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase mb-3">Active Preview</p>
                                    <div className="relative group">
                                        <img
                                            src={form.images}
                                            className="w-48 h-48 object-cover rounded-3xl border-4 border-white dark:border-stone-700 shadow-2xl"
                                            alt="Product"
                                        />
                                        <button
                                            onClick={() => setForm({ ...form, images: '' })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 dark:text-stone-500 mt-4 max-w-[200px]">
                                    Drag and drop your product image or click to browse
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase ml-2">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Running, Lifestyle, Basketball"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 outline-none transition-all font-medium text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase ml-2">Description</label>
                            <textarea
                                rows="4"
                                placeholder="Describe the features and materials..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 outline-none transition-all font-medium resize-none text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-2xl font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="flex-[2] py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-xl active:scale-[0.98]"
                        >
                            {isEditing ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;