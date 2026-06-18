import React from 'react';
import { Github, Youtube, Instagram, Facebook, Globe, MapPin, Mail, Phone, FileText, Home, BarChart2, Settings, Plus, HelpCircle, MessageCircle, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Column 1: Branding and Socials */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-[#0097B2] mb-4">
              <img src="/favicon.png" alt="JBC Class Record Logo" className="w-8 h-8 rounded" />
              <span className="font-bold text-2xl text-gray-900">JBC Class Record</span>
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm leading-relaxed text-sm">
              Organize, manage, and export your class records efficiently. Built specifically to handle academic tracking and print formatting for Jana Bhawana Campus.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="https://facebook.com/sanjelnirmal" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:-translate-y-1" title="Facebook">
                <Facebook className="w-4 h-4 text-current" strokeWidth={2} fill="currentColor" />
              </a>
              <a href="https://youtube.com/@sanjelnirmal" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-[#FF0000] hover:text-white transition-all shadow-sm hover:-translate-y-1" title="YouTube">
                <Youtube className="w-4 h-4 text-current" strokeWidth={2} fill="currentColor" />
              </a>
              <a href="https://instagram.com/shree_kishori_jiu_ka_daas" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-[#E4405F] hover:text-white transition-all shadow-sm hover:-translate-y-1" title="Instagram">
                <Instagram className="w-4 h-4 text-current" strokeWidth={2} />
              </a>
              <a href="https://github.com/SanjelNirmal" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm hover:-translate-y-1" title="GitHub">
                <Github className="w-4 h-4 text-current" strokeWidth={2} fill="currentColor" />
              </a>
              <a href="https://nirmalsanjel.com.np/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-[#0097B2] hover:text-white transition-all shadow-sm hover:-translate-y-1" title="Personal Website">
                <Globe className="w-4 h-4 text-current" strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base">Platform</h3>
            <ul className="space-y-3 px-0">
              <li><Link to="/" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><Home className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Dashboard</span></Link></li>
              <li><Link to="/analytics" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><BarChart2 className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Analytics</span></Link></li>
              <li><Link to="/templates" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><Settings className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Templates</span></Link></li>
              <li><Link to="/records/new" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><Plus className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>New Record</span></Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base">Support</h3>
            <ul className="space-y-3 px-0">
              <li><Link to="/help" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Help Center</span></Link></li>
              <li><a href="https://facebook.com/sanjelnirmal" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Message @ Us</span></a></li>
              <li><a href="https://github.com/SanjelNirmal" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><BookOpen className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Documentation</span></a></li>
              <li><a href="mailto:hackingwithnirmal@gmail.com" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#0097B2] transition-colors group"><MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-[#0097B2] transition-colors"/><span>Feedback</span></a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-base">Contact Us</h3>
            <ul className="space-y-4 px-0">
              <li className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0 group-hover:bg-[#0097B2] transition-colors">
                  <Phone className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium text-sm text-gray-700">+977 9848744321</span>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3 shrink-0 group-hover:bg-[#0097B2] transition-colors">
                  <Mail className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <a href="mailto:hackingwithnirmal@gmail.com" className="font-medium text-sm text-gray-700 hover:text-[#0097B2] transition-colors">
                  hackingwithnirmal@gmail.com
                </a>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3 shrink-0 group-hover:bg-[#0097B2] transition-colors">
                  <MapPin className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium text-sm text-gray-700">Dhapakhel-24, Lalitpur</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Copyright by Nirmal Sanjel. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-600">
            <Link to="/privacy" className="hover:text-[#0097B2] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#0097B2] transition-colors">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-[#0097B2] transition-colors">Site Map</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
