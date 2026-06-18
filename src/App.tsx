/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import RecordEditor from './pages/RecordEditor';
import PrintPreview from './pages/PrintPreview';
import TemplatesList from './pages/TemplatesList';
import TemplateCalibration from './pages/TemplateCalibration';
import Analytics from './pages/Analytics';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import SiteMap from './pages/SiteMap';
import HelpCenter from './pages/HelpCenter';
import Auth from './pages/Auth';
import Footer from './components/Footer';
import { FileText, Settings, Home, LogOut, BarChart2 } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-white shadow-sm border-b border-gray-100 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity shrink-0">
                  <img src="/favicon.png" alt="JBC Class Record Logo" className="w-8 h-8 rounded" />
                  <span className="font-bold text-lg sm:text-xl text-gray-900 hidden sm:block">JBC Class Record</span>
                </Link>
              </div>
              <nav className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto whitespace-nowrap">
                <Link to="/" className="text-gray-600 hover:text-[#0097B2] flex items-center space-x-1 hover:font-medium transition-colors">
                  <Home className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-[#0097B2] flex items-center space-x-1 hover:font-medium transition-colors">
                  <BarChart2 className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Analytics</span>
                </Link>
                <Link to="/templates" className="text-gray-600 hover:text-[#0097B2] flex items-center space-x-1 hover:font-medium transition-colors">
                  <Settings className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Templates</span>
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 hover:text-red-500 flex items-center space-x-1 sm:ml-4 transition-colors"
                >
                  <LogOut className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-1 print:p-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/records/new" element={<RecordEditor />} />
            <Route path="/records/:id" element={<RecordEditor />} />
            <Route path="/records/:id/print" element={<PrintPreview />} />
            <Route path="/templates" element={<TemplatesList />} />
            <Route path="/templates/new" element={<TemplateCalibration />} />
            <Route path="/templates/:id" element={<TemplateCalibration />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/sitemap" element={<SiteMap />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </main>
        
        {/* Do not show footer on print view */}
        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
