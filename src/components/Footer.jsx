import React from "react";
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Sign In', href: '/login' },
  ];

  const services = [
    { name: 'Co-Living Spaces', href: '#' },
    { name: 'Community Building', href: '#' },
    { name: 'Events & Activities', href: '#' },
    { name: '24/7 Support', href: '#' },
    { name: 'Premium Amenities', href: '#' },
  ];

  const policies = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                 <img 
                   src="/Lyvo_no_bg.png" 
                   alt="Lyvo Logo" 
                   className="w-full h-full object-contain"
                 />
               </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Lyvo+</span>
                <span className="text-xs text-gray-400 font-medium">Co-Living Platform</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering communities through innovative co-living solutions. 
              Join us in creating meaningful connections and sustainable living spaces.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link 
                  key={social.name} 
                  to={social.href} 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href} 
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-200">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">
                  hello@lyvoplus.com
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-200">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-200 mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Lyvo+. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              {policies.map((policy) => (
                <Link 
                  key={policy.name} 
                  to={policy.href} 
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:underline"
                >
                  {policy.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;