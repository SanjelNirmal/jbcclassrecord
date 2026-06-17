import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Template, TemplateField, PrintingCoordinateData } from '../types';
import { Save, ArrowLeft, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';

const DEFAULT_FIELDS: TemplateField[] = [
  { id: 'level', key: 'level', label: 'Level', x: 130, y: 270, fontSize: 14, fontFamily: 'Arial', align: 'left', width: 150 },
  { id: 'program_year', key: 'program_year', label: 'Program Year', x: 480, y: 270, fontSize: 14, fontFamily: 'Arial', align: 'left', width: 150 },
  { id: 'month', key: 'month', label: 'Month', x: 770, y: 270, fontSize: 14, fontFamily: 'Arial', align: 'left', width: 150 },
  { id: 'date', key: 'date', label: 'Date', x: 80, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'center', width: 50, isRepeating: true, rowSpacing: 75 },
  { id: 'period', key: 'period', label: 'Period', x: 150, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'center', width: 60, isRepeating: true, rowSpacing: 75 },
  { id: 'subject', key: 'subject', label: 'Subject', x: 230, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'left', width: 230, isRepeating: true, rowSpacing: 75 },
  { id: 'topic', key: 'topic', label: 'Topic', x: 480, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'left', width: 180, isRepeating: true, rowSpacing: 75 },
  { id: 'start_time', key: 'start_time', label: 'Start Time', x: 680, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'center', width: 60, isRepeating: true, rowSpacing: 75 },
  { id: 'end_time', key: 'end_time', label: 'End Time', x: 760, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'center', width: 70, isRepeating: true, rowSpacing: 75 },
  { id: 'pedagogy', key: 'pedagogy', label: 'Pedagogy', x: 850, y: 380, fontSize: 12, fontFamily: 'Arial', align: 'center', width: 90, isRepeating: true, rowSpacing: 75 },
];

export default function TemplateCalibration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [template, setTemplate] = useState<Template>({
    name: 'Class Record Landscape',
    width: 1123, // A4 Landscape width (96dpi)
    height: 794, // A4 Landscape height (96dpi)
    image_url: '',
    coordinate_json: JSON.stringify({ fields: DEFAULT_FIELDS } as PrintingCoordinateData)
  });

  const [fields, setFields] = useState<TemplateField[]>(DEFAULT_FIELDS);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.getTemplate(Number(id)).then(data => {
        setTemplate(data);
        if (data.coordinate_json) {
          try {
            setFields(JSON.parse(data.coordinate_json).fields);
          } catch(e) {}
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (id) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadTemplateImage(Number(id), formData);
      setTemplate(t => ({ ...t, image_url: res.image_url }));
    } else {
      // Must test save first, or just read it via URL object temporarily
      const url = URL.createObjectURL(file);
      setTemplate(t => ({ ...t, image_url: url, _file: file } as Template & { _file: File }));
    }
  };

  const handleSave = async () => {
    const updatedTemplate = {
      ...template,
      coordinate_json: JSON.stringify({ fields })
    };
    
    if (id) {
      await api.updateTemplate(Number(id), updatedTemplate);
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      const formData = new FormData();
      formData.append('name', template.name || 'New Template');
      formData.append('width', String(template.width));
      formData.append('height', String(template.height));
      formData.append('coordinate_json', updatedTemplate.coordinate_json);
      if ((template as any)._file) {
        formData.append('image', (template as any)._file);
      }
      
      const res = await api.createTemplate(formData);
      navigate(`/templates/${res.id}`);
    }
  };

  // Draggable logic
  const handleMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    setActiveField(fieldId);
  };

  const updateFieldCoord = (fieldId: string, dx: number, dy: number) => {
    setFields(prev => prev.map(f => {
      if (f.id === fieldId) {
        return { ...f, x: Math.max(0, f.x + dx), y: Math.max(0, f.y + dy) };
      }
      return f;
    }));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeField) {
        // Needs scaling consideration if container doesn't match native image pixels
        // Let's assume a straightforward 1:1 for simplicity or CSS scaled tracking
        updateFieldCoord(activeField, e.movementX, e.movementY);
      }
    };
    const handleMouseUp = () => setActiveField(null);
    if (activeField) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeField]);

  if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            className="text-xl font-bold text-gray-900 border-none outline-none focus:ring-0 w-64 bg-transparent"
            value={template.name}
            onChange={e => setTemplate({ ...template, name: e.target.value })}
            placeholder="Template Name..."
          />
        </div>
        <div className="flex items-center space-x-3">
          {saveMessage && (
            <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full">{saveMessage}</span>
          )}
          <label className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer flex items-center transition-colors">
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Base Image
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium flex items-center transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save Template
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col space-y-4">
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-2">Fields Configuration</h3>
          {fields.map(field => (
            <div key={field.id} className={`bg-white p-3 rounded-lg border text-sm shadow-sm ${activeField === field.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{field.label}</span>
                <button
                  onClick={() => setFields(fs => fs.filter(f => f.id !== field.id))}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-xs text-gray-500">X Position</label>
                  <input type="number" value={field.x} onChange={e => setFields(fs => fs.map(f => f.id === field.id ? {...f, x: Number(e.target.value)} : f))} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y Position</label>
                  <input type="number" value={field.y} onChange={e => setFields(fs => fs.map(f => f.id === field.id ? {...f, y: Number(e.target.value)} : f))} className="w-full border rounded px-2 py-1" />
                </div>
                {field.isRepeating && (
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Y Spacing (per row)</label>
                    <input type="number" value={field.rowSpacing} onChange={e => setFields(fs => fs.map(f => f.id === field.id ? {...f, rowSpacing: Number(e.target.value)} : f))} className="w-full border rounded px-2 py-1" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => setFields(fs => [...fs, { id: `field_${Date.now()}`, key: 'custom', label: 'New Field', x: 50, y: 50, width: 100, fontSize: 12, fontFamily: 'Arial', align: 'left' }])}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Field
          </button>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-200 relative p-8 flex justify-center">
          <div 
            ref={containerRef}
            className="bg-white shadow-2xl relative overflow-hidden ring-1 ring-gray-900/5 print-container"
            style={{ 
              width: template.width, 
              height: template.height,
            }}
          >
            {template.image_url && (
              <img src={template.image_url} alt="template" className="pointer-events-none opacity-60 w-full h-full object-fill absolute inset-0" />
            )}
            
            {/* Field nodes overlay */}
            {fields.map(field => (
              <div
                key={field.id}
                onMouseDown={(e) => handleMouseDown(e, field.id)}
                className={`absolute border border-blue-500 cursor-move bg-blue-50/80 group px-1 ${activeField === field.id ? 'ring-2 ring-blue-500 bg-blue-100/90 z-10' : ''}`}
                style={{
                  left: field.x,
                  top: field.y,
                  width: field.width || 'auto',
                  fontSize: `${field.fontSize}px`,
                  fontFamily: field.fontFamily,
                  textAlign: field.align,
                  whiteSpace: 'nowrap'
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-0 bg-blue-600 text-white text-[10px] px-1 rounded shadow whitespace-nowrap">
                  {field.label} ({Math.round(field.x)}, {Math.round(field.y)})
                </div>
                <span>{field.label} {field.isRepeating && <span className="text-[10px] text-blue-700">(row 1)</span>}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
