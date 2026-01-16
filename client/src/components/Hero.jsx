import React from 'react';

const Hero = () => (
  <section className="w-full px-6 md:px-16 py-12 md:py-20 bg-white dark:bg-[#0c0a09] transition-colors duration-300">
    <div className="max-w-7xl mx-auto border border-gray-200 dark:border-stone-800 flex flex-col md:flex-row items-stretch overflow-hidden transition-colors duration-300">
      
      {/* Text Content */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-start gap-8 bg-gray-50 dark:bg-stone-900 transition-colors duration-300">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white font-['Roboto']">
            Find your perfect stride today
          </h1>
          <p className="text-lg text-gray-600 dark:text-stone-400 max-w-md font-['Roboto']">
            Every step matters. Discover shoes built for how you move, from morning runs to evening walks.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <a href="/products">
            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-normal hover:bg-gray-800 dark:hover:bg-stone-200 transition-all duration-200 cursor-pointer">
              Shop now
            </button>
          </a>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 min-h-87.5 md:h-160 bg-gray-200 dark:bg-stone-800">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
          alt="Premium running shoes"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
);

export default Hero;