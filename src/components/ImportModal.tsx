import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileType, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ total: number, success: number, failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      if (jsonData.length > 0) {
        const cols = jsonData[0] as string[];
        // Filter out empty rows
        const rows = jsonData.slice(1).filter((row: any) => row.length > 0).map((row: any) => {
          let rowData: any = {};
          cols.forEach((col, idx) => {
            rowData[col] = row[idx];
          });
          // Set validation status
          rowData._isValid = !!(rowData.date && rowData.subject); // Basic validation
          return rowData;
        });
        
        setColumns(cols);
        setData(rows);
        setSummary(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    setLoading(true);
    let success = 0;
    let failed = 0;

    try {
      // Create a dummy record header for imported rows if needed,
      // or assume we need to import these rows for a specific record.
      // Wait, "Import directly into record_rows table." 
      // This implies we either must have a record, or we create one dummy.
      // Let's create one master record for CSV imports to attach them
      const { id: recordId } = await api.createRecord({
        level: 'IMPORTED',
        program_year: 'CSV IMPORT',
        month: 'ALL',
        program: 'IMPORT',
        academic_level: 'IMPORT',
        academic_year: 'IMPORT',
        template_id: 1, // Default or mock
        rows: []
      });

      const rowsToInsert = data.map(row => ({
        record_id: recordId,
        date: String(row.date || ''),
        period: String(row.period || ''),
        subject: String(row.subject || ''),
        topic: String(row.topic || ''),
        start_time: String(row.start_time || ''),
        end_time: String(row.end_time || ''),
        pedagogy: String(row.pedagogy || '')
      }));

      for (const row of rowsToInsert) {
        if (!row.date || !row.subject) {
          failed++;
          continue;
        }

        const { error } = await supabase.from('record_rows').insert(row);
        if (error) failed++;
        else success++;
      }

      setSummary({ total: data.length, success, failed });
      if (success > 0) onSuccess();
    } catch (err) {
      console.error('Import failed', err);
      alert('Failed to import data entirely.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Import Class Records
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!data.length && !summary && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileType className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-1">Click to Upload CSV or XLSX</p>
              <p className="text-sm text-gray-500">Columns should include: date, period, subject, topic...</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {data.length > 0 && !summary && (
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-semibold text-gray-800">Preview Data ({data.length} rows)</h3>
                <button onClick={() => setData([])} className="text-sm text-gray-500 underline">Clear Data</button>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-center w-10">Valid</th>
                      {columns.map(c => <th key={c} className="px-3 py-2 font-medium">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((row, i) => (
                      <tr key={i} className={row._isValid ? 'hover:bg-gray-50' : 'bg-red-50'}>
                        <td className="px-3 py-2 text-center">
                          {row._isValid ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <AlertCircle className="w-4 h-4 text-red-500 mx-auto" title="Missing required fields (date, subject)" />}
                        </td>
                        {columns.map(c => (
                          <td key={c} className="px-3 py-2">
                             <input 
                               type="text" 
                               value={row[c] || ''} 
                               onChange={(e) => {
                                 const newData = [...data];
                                 newData[i][c] = e.target.value;
                                 newData[i]._isValid = !!(newData[i].date && newData[i].subject);
                                 setData(newData);
                               }}
                               className="bg-transparent w-full border-none p-0 focus:ring-0"
                             />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary && (
            <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-2xl font-bold mb-2">Import Complete</h3>
               <div className="flex justify-center gap-8 mt-6">
                 <div><p className="text-3xl font-bold text-gray-800">{summary.total}</p><p className="text-sm text-gray-500">Total Rows</p></div>
                 <div><p className="text-3xl font-bold text-green-600">{summary.success}</p><p className="text-sm text-green-700">Successful</p></div>
                 <div><p className="text-3xl font-bold text-red-600">{summary.failed}</p><p className="text-sm text-red-700">Failed</p></div>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          {data.length > 0 && !summary && (
            <button 
              onClick={handleImport}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Confirm Import'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
