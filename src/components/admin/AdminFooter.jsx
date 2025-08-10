import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/Lyvo_no_bg.png" 
                alt="Lyvo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lyvo</h3>
              <p className="text-sm text-gray-600">Co-Living Platform</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div><a href="#" className="hover:text-red-600 transition-colors">Support</a></div>
              <div><a href="#" className="hover:text-red-600 transition-colors">Privacy</a></div>
              <div><a href="#" className="hover:text-red-600 transition-colors">Terms</a></div>
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>admin@lyvo.com</div>
              <div>+44 20 7998 7571</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Lyvo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 