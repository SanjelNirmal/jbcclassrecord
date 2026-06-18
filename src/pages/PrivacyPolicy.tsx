import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="w-8 h-8 text-[#0097B2]" />
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 prose max-w-none text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 mt-0">1. Information Collection</h2>
        <p>We collect information that you provide directly to us when using the JBC Class Record application, including class details, schedules, and analytics tracking.</p>
        
        <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Use of Information</h2>
        <p>Your data is used solely to generate reports, track your teaching hours, and allow PDF generation for your campus administration. We do not sell or share your data with third-party advertisers.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Data Security</h2>
        <p>We implement appropriate security measures to protect your information. Your authentication is securely managed, and database rules enforce Row Level Security, ensuring only you have access to your personal records.</p>
        
        <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Cookies and Local Storage</h2>
        <p>We use local storage strictly for functional purposes: saving your session and storing unsaved auto-drafts to prevent data loss. We do not use third-party tracking cookies.</p>
      </div>
    </div>
  );
}
