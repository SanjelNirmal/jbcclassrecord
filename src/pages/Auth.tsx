import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, BookOpen, Layers, Users, MapPin, Mail, Phone, Github, Globe } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ type: 'error', text: error.message });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* Left Column - Illustration & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-slate-50 flex-col items-center justify-center p-12 relative overflow-hidden border-r border-gray-100">
          {/* Decorative background shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            <div className="absolute top-24 -right-24 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          </div>
          
          <div className="z-10 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
              <img src="/favicon.png" alt="JBC Class Record Logo" className="w-16 h-16 rounded-xl" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              JBC Class Record
            </h2>
            <p className="text-lg text-gray-600 max-w-sm mb-12">
              Transforming classroom administration into a seamless, digital experience.
            </p>
            
            <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
              <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center border border-gray-50">
                <Layers className="w-6 h-6 text-[#0097B2] mb-2" />
                <span className="text-sm font-medium text-gray-700">Records</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center border border-gray-50">
                <Users className="w-6 h-6 text-[#0097B2] mb-2" />
                <span className="text-sm font-medium text-gray-700">Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Interactive Login & Developer Info */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="md:hidden flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                <img src="/favicon.png" alt="JBC Class Record Logo" className="w-10 h-10 rounded-lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                JBC Class Record
              </h2>
              <p className="text-sm text-gray-500 px-4">
                Transforming classroom administration into a seamless, digital experience.
              </p>
            </div>

            <div className="mb-10 lg:mb-12">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back !
              </h2>
              <p className="mt-2 text-gray-500">
                Lets get you Logged in
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 px-4 py-3 bg-gray-50 border border-transparent rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent transition-all sm:text-sm"
                      placeholder="nirmal@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <LogIn className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 px-4 py-3 bg-gray-50 border border-transparent rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent transition-all sm:text-sm"
                      placeholder="••••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0097B2] focus:ring-[#0097B2] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                    Remember Me !
                  </label>
                </div>
                <div className="text-sm">
                  <a href="mailto:hackingwithnirmal@gmail.com?subject=Help needed with JBC Class Record Management" className="font-medium text-[#0097B2] hover:text-cyan-700">
                    Need Help?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#0097B2] hover:bg-[#00869e] focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Processing...' : 'Login'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  New user? <a href="mailto:hackingwithnirmal@gmail.com" className="font-medium text-[#0097B2] hover:text-cyan-700">Contact admin for new registration.</a>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Developer Information</h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100/50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Nirmal Sanjel</h4>
                  <p className="text-xs text-[#0097B2] font-medium mb-3">BCA STUDENT</p>
                  
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" />
                      Dhapakhel-24, Lalitpur
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                      <a href="mailto:hackingwithnirmal@gmail.com" className="hover:text-[#0097B2]">hackingwithnirmal@gmail.com</a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                      +977 9848744321
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                   <a href="https://github.com/SanjelNirmal" className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors shadow-sm" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                   <a href="https://nirmalsanjel.com.np/" className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-[#0097B2] transition-colors shadow-sm" title="Website">
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 italic border-l-2 border-[#0097B2] pl-3 py-1">
                "This platform was personally developed to manage class records at Jana Bhawana Campus. Feel free to reach out for support or feedback."
              </p>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
