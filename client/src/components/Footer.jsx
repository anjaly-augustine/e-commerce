import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#0c0a09] border-t border-gray-200 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-start items-start gap-16 lg:gap-32">
          
          {/* Brand & Newsletter Section */}
          <div className="w-full lg:w-[500px] flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center rounded-sm transition-colors">
                <span className="text-white dark:text-black font-bold text-xs tracking-tighter">SW</span>
              </div>
              <span className="text-xl font-bold font-['Roboto'] text-black dark:text-white">ShoeWave</span>
            </div>
            
            <p className="text-gray-600 dark:text-stone-400 text-base font-['Roboto'] leading-6">
              Get the latest shoe drops and exclusive offers delivered.
            </p>

            {/* Subscription Form */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-1 px-4 py-3 border border-black dark:border-white bg-white dark:bg-stone-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-['Roboto'] transition-colors"
                />
                <button className="px-6 py-3 border border-black dark:border-white bg-white dark:bg-stone-900 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 font-['Roboto'] text-base whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 dark:text-stone-500 text-xs font-['Roboto']">
                We respect your privacy and only send what matters.
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Shop Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-semibold font-['Roboto'] text-black dark:text-white">Shop</h4>
              <ul className="flex flex-col gap-2">
                {['All shoes', 'Men', 'Women', 'Kids', 'Sports'].map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-600 dark:text-stone-400 hover:text-black dark:hover:text-white hover:underline transition-all">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-semibold font-['Roboto'] text-black dark:text-white">Support</h4>
              <ul className="flex flex-col gap-2">
                {['Contact us', 'Returns', 'Shipping', 'Size guide', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-600 dark:text-stone-400 hover:text-black dark:hover:text-white hover:underline transition-all">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Column */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h4 className="text-base font-semibold font-['Roboto'] text-black dark:text-white">Follow us</h4>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {[
                  { name: 'Facebook', Icon: Facebook },
                  { name: 'Instagram', Icon: Instagram },
                  { name: 'X', Icon: Twitter },
                  { name: 'LinkedIn', Icon: Linkedin },
                  { name: 'Youtube', Icon: Youtube },
                ].map((social) => (
                  <a 
                    key={social.name} 
                    href="#" 
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-stone-400 hover:text-black dark:hover:text-white group transition-all"
                  >
                    <social.Icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-20 flex flex-col gap-8">
          <div className="w-full h-[1px] bg-gray-200 dark:bg-stone-800" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500 dark:text-stone-500 font-['Roboto']">
              © {currentYear} ShoeWave Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 dark:text-stone-400 underline hover:text-black dark:hover:text-white decoration-gray-300 dark:decoration-stone-600 underline-offset-4">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 dark:text-stone-400 underline hover:text-black dark:hover:text-white decoration-gray-300 dark:decoration-stone-600 underline-offset-4">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 dark:text-stone-400 underline hover:text-black dark:hover:text-white decoration-gray-300 dark:decoration-stone-600 underline-offset-4">Cookies Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;