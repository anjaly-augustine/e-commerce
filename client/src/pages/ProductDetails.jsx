import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Loader2, Heart, Share2, Plus, Minus, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  // Cart-specific states
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const isLowStock = product?.stock > 0 && product?.stock < 10;

  // --- ADD TO CART HANDLER ---
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please sign in to add items to your cart.");
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await api.post('/cart', {
        productId: id,
        quantity: quantity
      });


      if (response.ok) {
        setAddSuccess(true);
        window.dispatchEvent(new Event('cartUpdated'));
        setTimeout(() => setAddSuccess(false), 2000);
      } else {
        throw new Error("Failed to add");
      }
    } catch (err) {
      alert("Error updating cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#0c0a09]">
      <Loader2 className="animate-spin text-stone-600 dark:text-stone-400" size={48} />
      <p className="text-stone-500 dark:text-stone-400 animate-pulse">Loading product details...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a09] font-['Inter',sans-serif] transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image Section */}
          <div className="bg-stone-100 dark:bg-stone-900 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-12 transition-colors duration-300">
            <img
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              src={product?.images || "https://placehold.co/600"}
              alt={product?.name}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                  {product?.name}
                </h1>
                <button className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                  <Heart className="text-stone-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400" size={24} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-2 py-1 rounded text-sm font-bold">
                  4.5 <Star size={14} fill="currentColor" className="ml-1" />
                </div>
                <span className="text-stone-500 dark:text-stone-400 text-sm">120 Reviews</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-4xl font-light text-stone-900 dark:text-white">
                ₹{product?.price?.toLocaleString()}
              </span>
              {isLowStock && (
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                  Only {product.stock} left in stock - order soon!
                </p>
              )}
            </div>

            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg border-l-4 border-stone-200 dark:border-stone-700 pl-4">
              {product?.description}
            </p>

            {/* Quantity and Actions */}
            <div className="space-y-6 pt-6 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-6">
                <span className="text-stone-900 dark:text-stone-100 font-semibold uppercase tracking-wider text-sm">
                  Quantity
                </span>
                <div className="flex items-center border-2 border-stone-200 dark:border-stone-700 rounded-xl">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-stone-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || product?.stock === 0}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold text-xl shadow-lg
                  ${addSuccess
                    ? 'bg-green-600 dark:bg-green-500 text-white'
                    : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-[0.98]'
                  }
                  ${(isAdding || product?.stock === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAdding ? (
                  <Loader2 className="animate-spin" />
                ) : addSuccess ? (
                  <Check />
                ) : (
                  <ShoppingCart />
                )}
                {isAdding ? 'Processing...' : addSuccess ? 'Added to Cart' : 'Add to Bag'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;