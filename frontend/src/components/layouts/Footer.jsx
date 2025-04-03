import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#938e89] text-[#d9dae0] pt-16 pb-8 w-full mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-800">
          <div className="flex flex-col items-center text-center">
            <Truck size={32} className="text-[#a96446] mb-4" />
            <h3 className="text-lg font-medium mb-2">Fast Delivery</h3>
            <p className="text-[#ccc9c8]">
              Free shipping on all orders over $50
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard size={32} className="text-[#a96446] mb-4" />
            <h3 className="text-lg font-medium mb-2">Secure Payment</h3>
            <p className="text-[#ccc9c8]">100% secure payment processing</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={32} className="text-[#a96446] mb-4" />
            <h3 className="text-lg font-medium mb-2">Quality Guarantee</h3>
            <p className="text-[#ccc9c8]">30-day money-back guarantee</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopEase</h3>
            <p className="text-[#a96446]-400 mb-6">
              Your one-stop destination for high-quality products at affordable
              prices. Making online shopping easier since 2020.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ccc9c8] hover:text-[#a96446] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ccc9c8] hover:text-[#a96446] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ccc9c8] hover:text-[#a96446] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  About Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#e0dedc] hover:text-[#a96446] transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin
                  size={20}
                  className="text-[#a96446] flex-shrink-0 mt-1"
                />
                <span className="text-[#e0dedc]">
                  5th Avenue, Kochi, Ernakulam
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-[#a96446] flex-shrink-0" />
                <span className="text-[#e0dedc]">9249957098</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-[#a96446] flex-shrink-0" />
                <span className="text-[#e0dedc]">support@ceramica.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-[#e0dedc] mb-4">
              Get 10% off your first order and stay updated with our latest
              offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-2 px-4 bg-[#fff4eeb9] border border-white-700 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-900 placeholder-gray-700"
              />
              <button className="bg-[#c36f4cbe] hover:bg-[#000000] text-white py-2 px-6 rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="text-[#e0dedc] border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#e0dedc] text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy-policy"
              className="text-[#e0dedc] hover:text-[#a96446] text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-[#e0dedc] hover:text-[#a96446] text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="text-[#e0dedc] hover:text-[#a96446] text-sm"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
