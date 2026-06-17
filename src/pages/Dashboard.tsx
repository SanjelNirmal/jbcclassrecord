import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ClassRecord } from '../types';
import { Plus, Printer } from 'lucide-react';

export default function Dashboard() {
  const [records, setRecords] = useState<ClassRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your class records for printing</p>
        </div>
        <Link
          to="/records/new"
          className="bg-[#0097B2] text-white px-5 py-2.5 rounded-lg hover:bg-[#00869e] flex items-center shadow-sm transition-all focus:ring-4 focus:ring-cyan-500/30 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Class Record
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 bg-slate-50/50">
          <h2 className="text-xl font-bold text-gray-900">Recent Records</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#0097B2]">
              <Printer className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-gray-900">No records found</p>
            <p className="mt-1">Create your first class record to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {records.map(record => (
              <li key={record.id} className="hover:bg-slate-50/80 p-6 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    <span className="text-[#0097B2]">{record.level}</span> <span className="text-gray-300 mx-2">•</span> {record.program_year} <span className="text-gray-300 mx-2">•</span> {record.month}
                  </h3>
                  <p className="text-sm font-mono text-gray-500 mt-2">
                    Created: {new Date(record.created_at || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <Link
                    to={`/records/${record.id}`}
                    className="flex-1 sm:flex-none text-center text-gray-600 hover:text-[#0097B2] font-medium text-sm px-4 py-2 rounded-lg hover:bg-cyan-50/50 border border-transparent hover:border-cyan-100 transition-all"
                  >
                    View / Edit
                  </Link>
                  <Link
                    to={`/records/${record.id}?duplicate=true`}
                    className="flex-1 sm:flex-none text-center text-gray-600 hover:text-green-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 transition-all"
                  >
                    Duplicate
                  </Link>
                  <Link
                    to={`/records/${record.id}/print`}
                    className="flex-1 sm:flex-none text-center bg-[#0097B2] text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#00869e] shadow-sm transition-all focus:ring-4 focus:ring-cyan-500/30 flex items-center justify-center"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Print
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
