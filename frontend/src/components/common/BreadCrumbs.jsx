import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex pb-5 pt-8">
      <ol className="flex items-center space-x-1 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index === items.length - 1 ? (
              <li className="text-ceramic-dark/60 font-medium">{item.label}</li>
            ) : (
              <>
                <li>
                  <Link 
                    to={item.href} 
                    className="text-ceramic-dark/60 hover:text-ceramic-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} className="text-ceramic-dark/40" />
                </li>
              </>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;