import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ClassRecord, Template, TemplateField, PrintingCoordinateData } from '../types';
import { Printer, ArrowLeft, Image as ImageIcon, EyeOff, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PrintPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ClassRecord | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<'overlay' | 'full'>('overlay');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      api.getRecord(Number(id)).then(r => {
        setRecord(r);
        return api.getTemplate(r.template_id);
      }).then(t => {
        setTemplate(t);
        if (t.coordinate_json) {
          try {
            setFields(JSON.parse(t.coordinate_json).fields);
          } catch(e) {}
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !template || !record) return;
    try {
      setIsGeneratingPdf(true);
      
      // We want to capture exactly what is shown in the print area right now.
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // 2x scale for better resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Determine orientation based on template width/height
      const orientation = template.width > template.height ? 'landscape' : 'portrait';
      
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [template.width, template.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, template.width, template.height);
      pdf.save(`ClassRecord_${record.level}_${record.program_year}_${record.month}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try printing instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading || !record || !template) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Non-printable Control Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Print Preview</h1>
            <p className="text-sm text-gray-500">
              {record.level} • {record.program_year} • {record.month}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
            <button
              onClick={() => setPrintMode('overlay')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${printMode === 'overlay' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Overlay (Text Only)
            </button>
            <button
              onClick={() => setPrintMode('full')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${printMode === 'full' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Full Print
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-50 font-medium flex items-center shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#0097B2] text-white px-6 py-2.5 rounded-md hover:bg-[#00869e] font-medium flex items-center shadow-sm transition-colors"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Now
          </button>
        </div>
      </div>

      {/* Print Document Area */}
      <div className="flex justify-center mt-8 print:m-0 print:p-0">
        <div 
          ref={printRef}
          className="print-container relative bg-white shadow-2xl overflow-hidden print:shadow-none print:bg-transparent"
          style={{ 
            width: template.width, 
            height: template.height,
          }}
        >
          {/* Background Image (conditionally hidden in print) */}
          {template.image_url && (
            <img 
              src={template.image_url} 
              alt="Background Template" 
              className={`w-full h-full object-fill pointer-events-none absolute inset-0 transition-opacity duration-300 ${printMode === 'overlay' ? 'opacity-30 print:hidden' : 'opacity-100 print:block'}`} 
            />
          )}

          {/* Absolute Positioned Data Overlay */}
          {fields.map(field => {
            if (field.isRepeating && record.rows) {
              return record.rows.map((row, rowIndex) => (
                <div
                  key={`${field.id}-${rowIndex}`}
                  className="absolute leading-none tracking-tight font-medium"
                  style={{
                    left: field.x,
                    top: field.y + (rowIndex * (field.rowSpacing || 30)),
                    width: field.width || 'auto',
                    fontSize: `${field.fontSize}px`,
                    fontFamily: field.fontFamily,
                    textAlign: field.align,
                    color: 'black'
                  }}
                >
                  {(row as any)[field.key] || ''}
                </div>
              ));
            } else {
              return (
                <div
                  key={field.id}
                  className="absolute leading-none font-bold"
                  style={{
                    left: field.x,
                    top: field.y,
                    width: field.width || 'auto',
                    fontSize: `${field.fontSize}px`,
                    fontFamily: field.fontFamily,
                    textAlign: field.align,
                    color: 'black'
                  }}
                >
                  {(record as any)[field.key] || ''}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
