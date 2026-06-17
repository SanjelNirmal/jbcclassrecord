import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Template } from '../types';
import { Plus, Settings } from 'lucide-react';

export default function TemplatesList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTemplates().then(data => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Printing Templates</h1>
          <p className="text-gray-500 mt-2">Calibrate coordinates for pre-printed forms</p>
        </div>
        <Link
          to="/templates/new"
          className="bg-[#0097B2] text-white px-5 py-2.5 rounded-lg hover:bg-[#00869e] flex items-center shadow-sm transition-all focus:ring-4 focus:ring-cyan-500/30 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Template
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#0097B2]">
              <Settings className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-gray-900">No templates configured</p>
            <p className="mt-1">Add your first template to get started</p>
          </div>
        ) : (
          templates.map(template => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all group">
              <div className="h-48 bg-slate-50 flex items-center justify-center relative border-b border-gray-50/50">
                {template.image_url ? (
                  <img src={template.image_url} alt={template.name} className="object-contain h-full w-full opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                  <span className="text-gray-400 font-medium pb-2 border-b-2 border-gray-200">No Base Image</span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 truncate" title={template.name}>{template.name}</h3>
                  <p className="text-sm font-mono text-gray-500 mt-1.5 flex items-center">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs mr-2 border border-gray-200">{template.width}px</span> × 
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs ml-2 border border-gray-200">{template.height}px</span>
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                  <Link
                    to={`/templates/${template.id}`}
                    className="text-[#0097B2] hover:text-[#007a90] font-medium text-sm flex items-center transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1.5" /> Calibrate Tracking
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
