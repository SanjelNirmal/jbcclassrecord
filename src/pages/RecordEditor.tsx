import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { ClassRecord, RecordRow, Template } from '../types';
import { Save, Plus, Trash2, ArrowLeft, Copy } from 'lucide-react';
import { PROGRAMS, ACADEMIC_YEARS, NEPALI_MONTHS, SUBJECT_MAPPING } from '../data/academicData';

export default function RecordEditor() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isDuplicate = new URLSearchParams(location.search).get('duplicate') === 'true';
  const effectiveId = isDuplicate ? null : id;
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error'} | null>(null);
  
  const [record, setRecord] = useState<ClassRecord>({
    level: 'BACHELOR',
    program_year: '',
    month: NEPALI_MONTHS[0],
    program: PROGRAMS[0],
    academic_level: 'Semester 1',
    academic_year: ACADEMIC_YEARS[0],
    template_id: 0,
    rows: []
  });

  useEffect(() => {
    api.getTemplates().then(data => {
      setTemplates(data);
      if (data.length > 0 && !record.template_id) {
        setRecord(r => ({ ...r, template_id: data[0].id! }));
      }
    });

    if (id) {
      api.getRecord(Number(id)).then(data => {
        if (isDuplicate) {
          const duplicatedRows = data.rows?.map(r => {
             const { id, ...rest } = r; 
             return rest; 
          });
          setRecord({ ...data, id: undefined, created_at: undefined, rows: duplicatedRows });
        } else {
          setRecord(data);
        }
        setLoading(false);
      });
    }
  }, [id, isDuplicate]);

  const handleSmartPopulate = (prog: string, level: string) => {
    const subjects = SUBJECT_MAPPING[prog]?.[level] || [];
    if (subjects.length > 0) {
      setRecord(r => ({
        ...r,
        program: prog,
        academic_level: level,
        rows: subjects.map((sub, idx) => ({
          date: r.rows?.[idx]?.date || '',
          period: r.rows?.[idx]?.period || '',
          subject: sub,
          topic: r.rows?.[idx]?.topic || '',
          start_time: r.rows?.[idx]?.start_time || '',
          end_time: r.rows?.[idx]?.end_time || '',
          pedagogy: r.rows?.[idx]?.pedagogy || ''
        }))
      }));
    } else {
      setRecord(r => ({ ...r, program: prog, academic_level: level }));
    }
  };

  const handleAddRow = () => {
    setRecord(r => ({
      ...r,
      rows: [
        ...(r.rows || []),
        { date: '', period: '', subject: '', topic: '', start_time: '', end_time: '', pedagogy: '' }
      ]
    }));
  };

  const handleRemoveRow = (index: number) => {
    setRecord(r => {
      const newRows = [...(r.rows || [])];
      newRows.splice(index, 1);
      return { ...r, rows: newRows };
    });
  };

  const handleChangeRow = (index: number, field: keyof RecordRow, value: string) => {
    setRecord(r => {
      const newRows = [...(r.rows || [])];
      newRows[index] = { ...newRows[index], [field]: value };
      return { ...r, rows: newRows };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      
      const getOrdinal = (lvl: string) => {
        const numMatch = lvl.match(/\d+/);
        if(!numMatch) return '';
        const n = parseInt(numMatch[0]);
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      
      const computedLevel = 'BACHELOR';
      const computedProgramYear = `${record.program} ${getOrdinal(record.academic_level || '')} ${record.academic_year}`;
      
      const recordToSave = {
        ...record,
        level: computedLevel,
        program_year: computedProgramYear
      };

      if (effectiveId) {
         await api.updateRecord(Number(effectiveId), recordToSave);
         setMessage({ text: 'Record updated successfully.', type: 'success' });
         setTimeout(() => setMessage(null), 3000);
      } else {
        const { id: newId } = await api.createRecord(recordToSave);
        navigate(`/records/${newId}`);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to save record.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {message && (
        <div className={`mb-4 p-4 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message.text}
        </div>
      )}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{effectiveId ? 'Edit Class Record' : (isDuplicate ? 'Duplicate Class Record' : 'New Class Record')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Header Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={record.template_id}
              onChange={e => setRecord({ ...record, template_id: Number(e.target.value) })}
            >
              <option value={0} disabled>Select template</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={record.program}
              onChange={e => handleSmartPopulate(e.target.value, record.academic_level || '')}
            >
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level / Sem</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={record.academic_level}
              onChange={e => handleSmartPopulate(record.program || '', e.target.value)}
            >
              {Object.keys(SUBJECT_MAPPING[record.program || PROGRAMS[0]] || {}).map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={record.academic_year}
              onChange={e => setRecord({ ...record, academic_year: e.target.value })}
            >
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={record.month}
              onChange={e => setRecord({ ...record, month: e.target.value })}
            >
              {NEPALI_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Class Entries</h2>
          <button
            onClick={handleAddRow}
            className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Topic</th>
                <th className="px-4 py-3 font-medium">Start Time</th>
                <th className="px-4 py-3 font-medium">End Time</th>
                <th className="px-4 py-3 font-medium">Pedagogy</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(record.rows || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.date} onChange={e => handleChangeRow(idx, 'date', e.target.value)} placeholder="03-04" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-16 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.period} onChange={e => handleChangeRow(idx, 'period', e.target.value)} placeholder="1st" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" list="subjectList" className="w-40 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.subject} onChange={e => handleChangeRow(idx, 'subject', e.target.value)} placeholder="Subject" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-full border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.topic} onChange={e => handleChangeRow(idx, 'topic', e.target.value)} placeholder="Topic details..." />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.start_time} onChange={e => handleChangeRow(idx, 'start_time', e.target.value)} placeholder="6:30 AM" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.end_time} onChange={e => handleChangeRow(idx, 'end_time', e.target.value)} placeholder="7:15 AM" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-16 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-blue-500 text-sm py-1 px-2" value={row.pedagogy} onChange={e => handleChangeRow(idx, 'pedagogy', e.target.value)} placeholder="1" />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleRemoveRow(idx)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!record.rows || record.rows.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No entries yet. Click "Add Row" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <datalist id="subjectList">
        {SUBJECT_MAPPING[record.program || PROGRAMS[0]]?.[record.academic_level || '']?.map(s => <option key={s} value={s} />)}
      </datalist>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !record.template_id}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 flex items-center shadow-sm disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : (effectiveId ? 'Save Changes' : 'Save Record')}
        </button>
        {effectiveId && (
          <button
             onClick={() => navigate(`/records/${effectiveId}/print`)}
             className="bg-green-600 text-white px-6 py-2.5 rounded-md hover:bg-green-700 flex items-center shadow-sm transition-colors"
           >
             Proceed to Print
           </button>
        )}
      </div>
    </div>
  );
}
