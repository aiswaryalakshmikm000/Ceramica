
import React from 'react';
import { Check, Award, Leaf } from 'lucide-react';

const ProductFeatures = () => {
  const features = [
    { 
      icon: <Check size={18} className="text-ceramic-green" />, 
      label: "Handmade with Care",
      description: "Each piece is carefully crafted by skilled artisans ensuring uniqueness and quality."
    },
    { 
      icon: <Award size={18} className="text-ceramic-yellow" />, 
      label: "Premium Quality",
      description: "Made with the finest materials and attention to detail for exceptional durability."
    },
    { 
      icon: <Leaf size={18} className="text-ceramic-green" />, 
      label: "Natural Materials",
      description: "Environmentally friendly materials sourced responsibly from sustainable resources."
    }
  ];

  return (
    <div className="mt-12 py-6 border-t border-b border-ceramic-gray-light animate-fade-in">
      <h3 className="text-xl font-medium text-ceramic-dark mb-6">Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex items-start space-x-3 p-4 rounded-lg transition-all duration-300
                     hover:bg-ceramic-gray-light/30"
          >
            <div className="mt-1">{feature.icon}</div>
            <div>
              <h4 className="font-medium text-ceramic-dark">{feature.label}</h4>
              <p className="text-sm text-ceramic-dark/70 mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;