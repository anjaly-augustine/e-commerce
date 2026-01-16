import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';

const ProductCard = ({ id, name, color, price, image }) => {
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please sign in to add items to your cart.");
      window.location.href = '/login';
      return;
    }

    setAdding(true);
    try {
      const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id, 
          quantity: 1
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update cart");
      }
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-[250px] group">
      <Link to={`/products/${id}`} className="cursor-pointer">
        <div className="aspect-[3/4] bg-gray-100 dark:bg-stone-800 overflow-hidden rounded-lg transition-colors duration-300">
          <img 
            src={image || "https://placehold.co/400x500"} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        <div className="mt-4 text-center space-y-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:underline transition-colors">
            {name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-stone-400">{color}</p>
          <p className="text-xl font-semibold text-black dark:text-white">₹{price}</p>
        </div>
      </Link>

      <button 
        onClick={handleAddToCart}
        disabled={adding}
        className={`w-full py-2 border text-base font-medium transition-all flex justify-center items-center gap-2
          ${success 
            ? 'bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600' 
            : 'border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}
          ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {adding ? (
          <Loader2 className="animate-spin" size={20} />
        ) : success ? (
          <><Check size={20} /> Added</>
        ) : (
          'Add to cart'
        )}
      </button>
    </div>
  );
};

export default ProductCard;