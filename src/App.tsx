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
import Auth from './pages/Auth';
import Footer from './components/Footer';
import { FileText, Settings, Home, LogOut } from 'lucide-react';
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
              <div className="flex items-center space-x-2">
                <FileText className="text-[#0097B2] w-6 h-6" />
                <span className="font-bold text-xl text-gray-900">JBC Class Record</span>
              </div>
              <nav className="flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-[#0097B2] flex items-center space-x-1 hover:font-medium transition-colors">
                  <Home className="w-4 h-4" /> <span>Dashboard</span>
                </Link>
                <Link to="/templates" className="text-gray-600 hover:text-[#0097B2] flex items-center space-x-1 hover:font-medium transition-colors">
                  <Settings className="w-4 h-4" /> <span>Templates</span>
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 hover:text-red-500 flex items-center space-x-1 ml-4 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> <span>Logout</span>
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
