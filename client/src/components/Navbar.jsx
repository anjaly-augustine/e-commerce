import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, Menu, X, LogOut, User, LayoutDashboard, Package, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Ensure this path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchUserData();
    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [location.pathname]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setUser(result.data);
    } catch (err) {
      setUser(null);
    }
  };

  const updateCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setCartCount(0);
    try {
      const response = await fetch('http://localhost:3000/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-obsidian-bg backdrop-blur-md border-b border-stone-100 dark:border-stone-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-20 px-6 md:px-12 flex justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center gap-12">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-stone-900 dark:bg-stone-100 flex items-center justify-center rounded-xl transition-transform group-hover:rotate-12">
              <span className="text-white dark:text-stone-900 font-black text-xs">SW</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-stone-900 dark:text-white">ShoeWave</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/products" className="text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors uppercase tracking-widest">Shop</a>
            {user?.role === 'admin' && (
              <a href="/admin" className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 uppercase tracking-widest">
                <LayoutDashboard size={16} /> Admin
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:scale-105 transition-all border border-stone-100 dark:border-stone-800"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="h-8 w-px bg-stone-100 dark:bg-stone-800 mx-1 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="h-12 px-5 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
                  <div className="w-6 h-6 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white dark:text-stone-900" />
                  </div>
                  <span className="text-sm font-bold text-stone-900 dark:text-white hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-stone-400 group-hover:rotate-180 transition-transform" />
                </button>

                {/* Dropdown Card */}
                <div className="absolute top-full right-0 w-56 pt-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-2xl rounded-[1.5rem] p-2 overflow-hidden">
                    <DropdownItem icon={<User size={16} />} label="My Profile" href="/profile" />
                    <DropdownItem icon={<Package size={16} />} label="My Orders" href="/orders" />
                    <div className="h-px bg-stone-50 dark:bg-stone-800 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                className="relative h-12 w-12 sm:w-auto sm:px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg active:scale-95"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:block font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full border-2 border-white dark:border-stone-950 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <a href="/login">
              <button className="h-12 px-8 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-bold hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg">
                Sign In
              </button>
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-stone-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-stone-950 border-b border-stone-100 dark:border-stone-900 p-6 space-y-4 animate-in slide-in-from-top-4">
          <a href="/products" className="block text-stone-600 dark:text-stone-400 font-medium py-2 uppercase tracking-widest text-xs">Shop All</a>
          {user?.role === 'admin' && (
            <a href="/admin" className="block text-amber-600 font-bold py-2 uppercase tracking-widest text-xs">Admin Dashboard</a>
          )}
          <div className="h-px bg-stone-100 dark:bg-stone-900" />
          <button
            onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}
            className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> View Cart ({cartCount})
          </button>
        </div>
      )}
    </nav>
  );
};

const DropdownItem = ({ icon, label, href }) => (
  <a href={href} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white rounded-xl transition-colors">
    {icon} {label}
  </a>
);

export default Navbar;