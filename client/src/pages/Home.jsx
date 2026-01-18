import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ShoppingCart, ChevronDown, Star, Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryData = [
        {
            title: "Men's shoes",
            description: "Performance and comfort for the active man.",
            image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800"
        },
        {
            title: "Women's shoes",
            description: "Style meets substance in every pair.",
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800"
        },
        {
            title: "Kids' shoes",
            description: "Growing feet need the right foundation.",
            image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800"
        },
        {
            title: "Sports shoes",
            description: "Built for athletes who demand more.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);

                const { data } = await api.get('/products');
                setProducts(data);

            } catch (err) {
                setError('Failed to fetch product data');
            } finally {
                setIsLoading(false);
            }
        };


        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0c0a09] font-['Roboto',sans-serif] transition-colors duration-300">
            <Navbar />
            <Hero />

            {/* Categories Section */}
            <section className="px-16 py-16 bg-white dark:bg-[#0c0a09] transition-colors duration-300">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <span className="text-base font-semibold text-stone-900 dark:text-stone-100">Categories</span>
                        <h2 className="text-5xl font-bold text-stone-900 dark:text-white">Shop by style</h2>
                        <p className="text-lg text-gray-600 dark:text-stone-400">Find what fits your lifestyle and needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categoryData.map((cat, index) => (
                            <CategoryCard
                                key={index}
                                title={cat.title}
                                description={cat.description}
                                image={cat.image}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals - DYNAMIC DATA FROM MONGODB */}
            <section className="px-16 py-12 bg-white dark:bg-[#0c0a09] transition-colors duration-300">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <span className="text-base font-semibold text-stone-900 dark:text-stone-100">New</span>
                        <h2 className="text-5xl font-bold text-black dark:text-white">Arrivals</h2>
                        <p className="text-lg text-gray-600 dark:text-stone-400">Fresh styles just landed. See what's new this season.</p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin mb-4 text-stone-900 dark:text-stone-100" size={48} />
                            <p className="text-stone-900 dark:text-stone-300">Loading your perfect stride...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 dark:text-red-400">
                            <p>Error: {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 underline hover:text-red-600 dark:hover:text-red-300"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        color={product.color}
                                        price={product.price}
                                        image={product.images || "https://placehold.co/400x500"}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 dark:text-stone-400">
                                    No products found in the database.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <a href="/products">
                            <button className="px-6 py-3 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                View all
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}