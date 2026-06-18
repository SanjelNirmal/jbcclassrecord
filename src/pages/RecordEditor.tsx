import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { ClassRecord, RecordRow, Template } from '../types';
import { Save, Plus, Trash2, ArrowLeft, Copy, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
  
  // Auto-save statuses
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftDetected, setDraftDetected] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const isInitialLoad = useRef(true);
  const [currentId, setCurrentId] = useState<string | null>(effectiveId || null);

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

    const checkDraft = () => {
      const draftStr = localStorage.getItem('jbc_record_draft');
      if (draftStr && !effectiveId) {
        setDraftDetected(true);
      }
    };

    if (effectiveId) {
      api.getRecord(Number(effectiveId)).then(data => {
        if (isDuplicate) {
          const duplicatedRows = data.rows?.map(r => {
             const { id, ...rest } = r; 
             return rest; 
          });
          setRecord({ ...data, id: undefined, created_at: undefined, rows: duplicatedRows });
          checkDraft();
        } else {
          setRecord(data);
        }
        setLoading(false);
        isInitialLoad.current = false;
        setMounted(true);
      });
    } else {
      checkDraft();
      setLoading(false);
      isInitialLoad.current = false;
      setMounted(true);
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [id, effectiveId, isDuplicate]);

  const loadDraft = () => {
    const draftStr = localStorage.getItem('jbc_record_draft');
    if (draftStr) {
      try {
        const parsed = JSON.parse(draftStr);
        setRecord(parsed);
        setCurrentId(parsed.id || null);
        setMessage({ text: 'Draft restored successfully.', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
    setDraftDetected(false);
  };

  const clearDraft = () => {
    localStorage.removeItem('jbc_record_draft');
    setDraftDetected(false);
  };

  const getComputedRecord = useCallback((r: ClassRecord) => {
    const getOrdinal = (lvl: string) => {
      const numMatch = lvl.match(/\d+/);
      if(!numMatch) return '';
      const n = parseInt(numMatch[0]);
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    const computedLevel = 'BACHELOR';
    const computedProgramYear = `${r.program} ${getOrdinal(r.academic_level || '')} ${r.academic_year}`;
    return {
      ...r,
      level: computedLevel,
      program_year: computedProgramYear
    };
  }, []);

  const performSave = useCallback(async (isAutoSave = false) => {
    if (!record.template_id) return;
    
    setSaveStatus('saving');
    
    try {
      const recordToSave = getComputedRecord(record);

      if (currentId) {
        await api.updateRecord(Number(currentId), recordToSave);
      } else {
        const { id: newId } = await api.createRecord(recordToSave);
        setCurrentId(String(newId));
        // Update URL without reloading to avoid duplicates on refresh
        window.history.replaceState(null, '', `/records/${newId}`);
      }
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      localStorage.removeItem('jbc_record_draft');
    } catch (err) {
      console.error(err);
      setSaveStatus('failed');
      if (!isAutoSave) {
        setMessage({ text: 'Failed to save record.', type: 'error' });
      }
      // Keep draft in local storage if backend failed
      localStorage.setItem('jbc_record_draft', JSON.stringify({ ...record, id: currentId }));
    }
  }, [record, currentId, getComputedRecord]);

  // Debounced save on field change
  useEffect(() => {
    if (!mounted || isInitialLoad.current) return;
    
    setSaveStatus('idle');
    localStorage.setItem('jbc_record_draft', JSON.stringify({ ...record, id: currentId }));

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      performSave(true);
    }, 2000); // 2 seconds debounce

  }, [record]); // watch record changes

  // Auto save every 30 seconds
  useEffect(() => {
    if (!mounted) return;
    
    autoSaveTimerRef.current = setInterval(() => {
      if (saveStatus !== 'saving') {
        performSave(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimerRef.current!);
  }, [mounted, performSave, saveStatus]);

  const handleSmartPopulate = (prog: string, level: string) => {
    setRecord(r => ({ ...r, program: prog, academic_level: level }));
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

  const handleTimeAction = (index: number) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    setRecord(r => {
      const newRows = [...(r.rows || [])];
      if (!newRows[index].start_time) {
        newRows[index] = { ...newRows[index], start_time: timeString };
      } else if (!newRows[index].end_time) {
        newRows[index] = { ...newRows[index], end_time: timeString };
      }
      return { ...r, rows: newRows };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await performSave(false);
    setSaving(false);
    if (saveStatus !== 'failed') {
       setMessage({ text: 'Record saved successfully.', type: 'success' });
       setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {draftDetected && (
         <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-between">
           <div className="flex items-center text-orange-800">
             <AlertCircle className="w-5 h-5 mr-3" />
             <p className="font-medium text-sm">We found an unfinished draft of your record.</p>
           </div>
           <div className="flex gap-3">
             <button onClick={clearDraft} className="text-orange-700 hover:text-orange-900 text-sm font-medium">Discard Draft</button>
             <button onClick={loadDraft} className="bg-orange-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-orange-700 transition-colors">Restore Draft</button>
           </div>
         </div>
      )}

      {message && (
        <div className={`mb-4 p-4 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{currentId ? 'Edit Class Record' : 'New Class Record'}</h1>
        </div>

        {/* Save Status Indicators */}
        <div className="flex items-center text-sm font-medium px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-4 h-4 text-[#0097B2] animate-spin mr-2" />
              <span className="text-gray-600">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && lastSaved && (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-gray-600">
                Draft Saved
                <span className="font-normal text-gray-400 ml-1">
                  at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </>
          )}
          {saveStatus === 'failed' && (
            <>
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-600">Save Failed. Draft stored locally.</span>
            </>
          )}
          {saveStatus === 'idle' && !lastSaved && (
             <>
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-500">Unsaved Changes</span>
            </>
          )}
          {saveStatus === 'idle' && lastSaved && (
            <>
              <Clock className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-gray-500">Unsaved Changes</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Header Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
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
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
              value={record.program}
              onChange={e => handleSmartPopulate(e.target.value, record.academic_level || '')}
            >
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level / Sem</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
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
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
              value={record.academic_year}
              onChange={e => setRecord({ ...record, academic_year: e.target.value })}
            >
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
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
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.date} onChange={e => handleChangeRow(idx, 'date', e.target.value)} placeholder="03-04" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-16 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.period} onChange={e => handleChangeRow(idx, 'period', e.target.value)} placeholder="1st" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" list="subjectList" className="w-40 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.subject} onChange={e => handleChangeRow(idx, 'subject', e.target.value)} placeholder="Subject" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-full min-w-[200px] border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.topic} onChange={e => handleChangeRow(idx, 'topic', e.target.value)} placeholder="Topic details..." />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.start_time} onChange={e => handleChangeRow(idx, 'start_time', e.target.value)} placeholder="6:30 AM" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-20 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.end_time} onChange={e => handleChangeRow(idx, 'end_time', e.target.value)} placeholder="7:15 AM" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" className="w-16 border-gray-300 rounded bg-transparent focus:bg-white focus:ring-[#0097B2] text-sm py-1 px-2 transition-colors" value={row.pedagogy} onChange={e => handleChangeRow(idx, 'pedagogy', e.target.value)} placeholder="1" />
                  </td>
                  <td className="px-4 py-2 flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => handleTimeAction(idx)}
                      className={`text-[11px] px-2 py-1 rounded font-medium min-w-[70px] ${
                        !row.start_time
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : !row.end_time
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      title={!row.start_time ? "Stamp Start Time" : !row.end_time ? "Stamp End Time" : "Time Stamped"}
                    >
                      {!row.start_time ? 'Punch In' : !row.end_time ? 'Punch Out' : 'Done'}
                    </button>
                    <button onClick={() => handleRemoveRow(idx)} className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50">
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
          disabled={saving || !record.template_id || saveStatus === 'saving'}
          className="bg-[#0097B2] text-white px-6 py-2.5 rounded-md hover:bg-[#00869e] flex items-center shadow-sm disabled:opacity-50 transition-colors font-medium border border-transparent"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save & Sync'}
        </button>
        {currentId && (
          <button
             onClick={() => navigate(`/records/${currentId}/print`)}
             className="bg-green-600 text-white px-6 py-2.5 rounded-md hover:bg-green-700 flex items-center shadow-sm transition-colors font-medium border border-transparent"
           >
             Proceed to Print
           </button>
        )}
      </div>
    </div>
  );
}
