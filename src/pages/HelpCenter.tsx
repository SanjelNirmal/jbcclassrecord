import React from 'react';
import { HelpCircle, ChevronRight, FileText, Download, TrendingUp, Settings } from 'lucide-react';

export default function HelpCenter() {
  const guides = [
    {
      title: "Creating a New Class Record",
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      content: "To create a new record, click on the **New Class Record** button on your Dashboard. Select your Template, Program, Academic Year, and Month. As you type, your draft will be automatically saved in the background every 30 seconds."
    },
    {
      title: "Printing & Exporting to PDF",
      icon: <Download className="w-6 h-6 text-green-500" />,
      content: "After saving a record, click 'Proceed to Print' or open an existing record and click Print. You will enter the Print Preview layout. From here, you can click the 'Print' button to use your system dialogue, or 'Export PDF' to download the document."
    },
    {
      title: "Importing Data (CSV/Excel)",
      icon: <Download className="w-6 h-6 text-purple-500" />,
      content: "On the dashboard, click the 'Import CSV' button. An upload modal will appear. You can upload an Excel (.xlsx) or CSV file. The file should have columns matching: date, period, subject, topic, start_time, end_time, and pedagogy. Invalid rows will be flagged."
    },
    {
      title: "Understanding Analytics",
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
      content: "Visit the Analytics page to see your overall teaching progress. It calculates your total teaching hours automatically by subtracting your entered end_time and start_time values. It also shows a breakdown of your most taught subjects."
    },
    {
      title: "Configuring Print Templates",
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      content: "Template calibration is necessary if your printed output doesn't align correctly on A4 paper. Head to the 'Templates' page. You can adjust the top offset, font sizes, and container width directly and click to apply them globally to your print views."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8 text-[#0097B2]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">How can we help you?</h1>
        <p className="text-gray-500 mt-3 max-w-lg">Learn how to effectively use the JBC Class Record platform to manage, export, and track your teaching sessions.</p>
      </div>

      <div className="space-y-6">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
            <div className="p-3 bg-gray-50 rounded-lg shrink-0">
              {guide.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {guide.content.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-800">{part}</strong> : part
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#0097B2]/10 border border-[#0097B2]/20 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Still need assistance?</h3>
        <p className="text-gray-600 mb-6">If you encounter unexpected errors or need additional support, feel free to reach out directly to the developer.</p>
        <a 
          href="https://facebook.com/sanjelnirmal" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-[#0097B2] rounded-lg text-white font-medium hover:bg-[#00869e] transition-colors"
        >
          Message Support <ChevronRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
