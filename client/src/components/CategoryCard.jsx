import React from 'react';

const CategoryCard = ({ title, description, image }) => (
  <div className="group cursor-pointer">
    {/* Image Container */}
    <div className="aspect-[4/5] bg-gray-100 dark:bg-stone-800 overflow-hidden rounded-lg mb-4 relative transition-colors duration-300">
      <img 
        src={image || "https://placehold.co/400x500?text=Category"} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    {/* Text Content */}
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-stone-300 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-stone-400 leading-relaxed">
        {description}
      </p>
      <button className="text-sm font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-stone-400 transition-colors">
        Shop now →
      </button>
    </div>
  </div>
);

export default CategoryCard;