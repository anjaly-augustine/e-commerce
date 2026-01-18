import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, Filter, Loader2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    // Sort Logic
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    setFilteredProducts(result);
  }, [activeCategory, sortBy, products]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a09] font-['Roboto',sans-serif] transition-colors duration-300">
      <Navbar />

      {/* Hero / Header Section */}
      <div className="w-full bg-gray-50 dark:bg-stone-900 py-16 px-16 border-b border-gray-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Shop All Shoes</h1>
          <p className="text-lg text-gray-600 dark:text-stone-400">Performance, style, and comfort in every step.</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="sticky top-20 z-40 bg-white dark:bg-[#0c0a09] border-b border-gray-200 dark:border-stone-800 py-6 px-16 transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={20} className="text-gray-400 dark:text-stone-500 shrink-0" />
            {['All', 'Men', 'Women', 'Kids', 'Sports'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-zinc-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-zinc-200 dark:hover:bg-stone-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm text-gray-500 dark:text-stone-400 italic">
              {filteredProducts.length} Products Found
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-stone-900 dark:text-stone-100"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="px-16 py-20 bg-white dark:bg-[#0c0a09] transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="animate-spin text-zinc-400 dark:text-stone-500 mb-4" size={48} />
              <p className="text-zinc-500 dark:text-stone-400 font-medium tracking-wide">
                Fetching the collection...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-40">
              <p className="text-red-500 dark:text-red-400 text-xl mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  color={product.color}
                  price={product.price}
                  image={product.images}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-40">
              <p className="text-gray-400 dark:text-stone-500 text-2xl font-light">
                No shoes found matching "{activeCategory}"
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;