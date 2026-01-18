import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // 1. Fetch Cart from Backend
  const fetchCart = async () => {
  try {
    setIsLoading(true);

    const { data } = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setCartItems(data.items || []);
  } catch (err) {
    setError("Failed to fetch cart");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setIsLoading(false);
      setError("Please log in to view your cart.");
    }
  }, [token]);

  // 2. Update Quantity
  const updateQuantity = async (productId, delta) => {
  try {
    await api.post(
      "/cart",
      { productId, quantity: delta },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    fetchCart();
  } catch (err) {
    console.error("Update failed", err);
  }
};

  

  // 3. Remove Item
  const removeItem = async (productId) => {
  try {
    await api.delete(`/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    fetchCart();
  } catch (err) {
    console.error("Remove failed", err);
  }
};


  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0c0a09]">
      <Loader2 className="animate-spin text-stone-600 dark:text-stone-400" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a09] font-['Roboto',sans-serif] transition-colors duration-300">
      <Navbar />

      <main className="max-w-360 mx-auto px-6 md:px-16 py-16">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-4 text-stone-900 dark:text-white">
          <ShoppingBag size={36} /> Your Cart
        </h1>

        {error && !cartItems.length ? (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-stone-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-stone-700">
            <p className="text-xl text-gray-500 dark:text-stone-400 mb-6">Your cart is empty.</p>
            <a href="/products" className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-stone-200 transition-colors">
              Browse Shoes
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">

            <div className="flex-1 space-y-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-6 p-6 bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-2xl shadow-sm transition-colors duration-300">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-stone-800 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.productId?.images || "https://placehold.co/400x500"}
                      alt={item.productId?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.productId?.name}</h3>
                        <p className="text-gray-500 dark:text-stone-400 text-sm">₹{item.productId?.price} per pair</p>
                      </div>
                      <p className="text-xl font-bold text-stone-900 dark:text-white">₹{(item.productId?.price || 0) * item.quantity}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId?._id, -1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors text-stone-900 dark:text-white"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium text-stone-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId?._id, 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors text-stone-900 dark:text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId?._id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-100">
              <div className="bg-gray-50 dark:bg-stone-900 rounded-3xl p-8 sticky top-24 border border-transparent dark:border-stone-800 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-6 text-stone-900 dark:text-white">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600 dark:text-stone-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-stone-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-stone-700 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                <a href="/checkout">
                  <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 dark:hover:bg-stone-200 transition-all shadow-lg">
                    Proceed to Checkout <ArrowRight />
                  </button>
                </a>
              </div>
            </div>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;