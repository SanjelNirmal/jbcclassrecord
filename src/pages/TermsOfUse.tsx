import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <FileText className="w-8 h-8 text-[#0097B2]" />
        <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 prose max-w-none text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 mt-0">1. Acceptance of Terms</h2>
        <p>By accessing and using the JBC Class Record system, you agree to comply with and be bound by these Terms of Use. This application is provided for educational and administrative tracking purposes.</p>
        
        <h2 className="text-xl font-semibold text-gray-900 mt-6">2. User Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your login credentials. You agree that all data entered into the system is accurate and reflects actual class sessions and hours taught.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">3. System Usage & Limitations</h2>
        <p>The platform is provided "as is" without warranty. While we strive to maintain 99% uptime, we are not liable for incidental data losses. We strongly recommend regularly exporting your data to CSV or PDF formats.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Intellectual Property</h2>
        <p>The system architecture, design interfaces, and functional logic are owned by the developer (Nirmal Sanjel). You may use the software for its intended purpose but you may not duplicate or resell the software service.</p>
      </div>
    </div>
  );
}
