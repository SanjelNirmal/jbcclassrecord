import React from 'react';
import { Github, Youtube, Instagram, Facebook, Globe, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          
          <div className="flex-1 max-w-md">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Developer</h3>
            <p className="text-gray-900 font-medium">Nirmal Sanjel</p>
            <p className="text-sm text-gray-500 mb-3">BCA STUDENT</p>
            <p className="text-sm text-gray-600 italic border-l-2 border-blue-500 pl-3">
              "This platform was personally developed to manage class records at Jana Bhawana Campus. Feel free to reach out for support or feedback."
            </p>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Contact info</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                Dhapakhel-24, Lalitpur
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <a href="mailto:hackingwithnirmal@gmail.com" className="hover:text-blue-600 transition-colors">
                  hackingwithnirmal@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                +977 9848744321
              </li>
            </ul>
          </div>

          <div className="flex-1 md:text-right">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Connect</h3>
            <div className="flex space-x-4 md:justify-end">
              <a href="https://github.com/SanjelNirmal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@nirmalsanjel07" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/shree_kishori_jiu_ka_daas" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/nirmalsanjel071" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://nirmalsanjel.com.np/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors" title="Personal Website">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
