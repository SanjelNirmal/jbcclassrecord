import React from 'react';
import { Map, Home, Settings, BarChart2, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteMap() {
  const links = [
    { to: '/', label: 'Dashboard', icon: <Home className="w-5 h-5 text-gray-400" />, desc: 'Main overview of all your records' },
    { to: '/records/new', label: 'New Record', icon: <Plus className="w-5 h-5 text-gray-400" />, desc: 'Create a new class record with auto-save' },
    { to: '/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5 text-gray-400" />, desc: 'View your teaching performance and statistics' },
    { to: '/templates', label: 'Templates', icon: <Settings className="w-5 h-5 text-gray-400" />, desc: 'Manage printer and page calibration profiles' },
  ];

  const genericLinks = [
    { to: '/privacy', label: 'Privacy Policy', icon: <FileText className="w-5 h-5 text-gray-400" /> },
    { to: '/terms', label: 'Terms of Use', icon: <FileText className="w-5 h-5 text-gray-400" /> },
    { to: '/help', label: 'Help Center', icon: <FileText className="w-5 h-5 text-gray-400" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <Map className="w-8 h-8 text-[#0097B2]" />
        <h1 className="text-3xl font-bold text-gray-900">Site Map</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Application Features</h2>
           <ul className="space-y-4">
             {links.map((link, idx) => (
               <li key={idx}>
                 <Link to={link.to} className="flex items-start group">
                   <div className="mt-0.5 mr-3 group-hover:text-[#0097B2]">{link.icon}</div>
                   <div>
                     <span className="font-semibold text-gray-800 group-hover:text-[#0097B2] transition-colors">{link.label}</span>
                     <p className="text-sm text-gray-500 mt-0.5">{link.desc}</p>
                   </div>
                 </Link>
               </li>
             ))}
           </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Legal & Support</h2>
           <ul className="space-y-4">
             {genericLinks.map((link, idx) => (
               <li key={idx}>
                 <Link to={link.to} className="flex items-center group">
                   <div className="mr-3 group-hover:text-[#0097B2]">{link.icon}</div>
                   <span className="font-semibold text-gray-800 group-hover:text-[#0097B2] transition-colors">{link.label}</span>
                 </Link>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
