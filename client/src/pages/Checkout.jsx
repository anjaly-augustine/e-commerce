import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, ShieldCheck, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form State
  const [shippingData, setShippingData] = useState({
    address: '', city: '', zipCode: '', phone: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await api.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.items?.length === 0) navigate('/shop');
      setCart(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const token = localStorage.getItem('token');

    try {
      await api.post(
        '/orders/checkout',
        { shippingDetails: shippingData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrderComplete(true);
      window.dispatchEvent(new Event('cartUpdated'));
      setTimeout(() => navigate('/profile'), 3000);
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0c0a09]">
      <Loader2 className="animate-spin text-stone-600 dark:text-stone-400" size={48} />
    </div>
  );

  if (orderComplete) return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-[#0c0a09]">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-2">Order Confirmed!</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Thank you for your purchase. Redirecting to your orders...</p>
      <Loader2 className="animate-spin text-stone-300 dark:text-stone-600" />
    </div>
  );

  const subtotal = cart?.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] font-['Inter',sans-serif] transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-6 lg:px-16">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-4xl font-light text-stone-900 dark:text-white">Checkout</h1>
          <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6 text-stone-900 dark:text-white">
                <MapPin size={24} />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="md:col-span-2 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-stone-900 dark:focus:border-white transition-colors text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-stone-900 dark:focus:border-white transition-colors text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-stone-900 dark:focus:border-white transition-colors text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                />
              </form>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 text-stone-900 dark:text-white">
                <CreditCard size={24} />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <div className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-white rounded-2xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-stone-100 dark:bg-stone-800 rounded flex items-center justify-center font-bold text-xs text-stone-900 dark:text-white">
                    CASH
                  </div>
                  <span className="font-medium text-stone-900 dark:text-white">Cash on Delivery</span>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-stone-900 dark:border-white"></div>
              </div>
              <p className="mt-4 text-sm text-stone-400 dark:text-stone-500 flex items-center gap-2">
                <ShieldCheck size={16} /> Secure checkout powered by SSL encryption
              </p>
            </section>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 shadow-xl shadow-stone-200/50 dark:shadow-black/20 sticky top-24 border border-transparent dark:border-stone-800 transition-colors duration-300">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Order Summary</h3>

              <div className="space-y-4 mb-8 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {cart?.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-xl shrink-0 p-2 transition-colors">
                      <img src={item.productId.images} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-stone-900 dark:text-white line-clamp-1">{item.productId.name}</h4>
                      <p className="text-xs text-stone-400 dark:text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">₹{(item.productId.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-stone-100 dark:border-stone-800">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-stone-900 dark:text-white pt-3">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-8 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
                {!isProcessing && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;