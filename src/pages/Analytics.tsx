import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Activity, BookOpen, Clock, FileText, CheckCircle2, TrendingUp, Calendar as CalendarIcon, Award } from 'lucide-react';
import { parse, differenceInMinutes } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ recordRows: any[], records: any[] }>({ recordRows: [], records: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: records, error: err1 } = await supabase.from('records').select('*');
        if (err1) throw err1;
        
        const { data: rows, error: err2 } = await supabase.from('record_rows').select('*, records(month)');
        if (err2) throw err2;

        setData({ records: records || [], recordRows: rows || [] });
      } catch (err) {
        console.error("Error fetching analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const rows = data.recordRows;
    const records = data.records;

    const totalRecords = records.length;
    const totalClasses = rows.length;

    let totalMinutes = 0;
    const subjectsMap: Record<string, number> = {};
    const monthsMap: Record<string, number> = {};
    const monthRecordMap: Record<string, number> = {};

    rows.forEach(r => {
      // Calculate duration
      if (r.start_time && r.end_time) {
        try {
          const start = parse(r.start_time, 'hh:mm a', new Date());
          const end = parse(r.end_time, 'hh:mm a', new Date());
          const diff = differenceInMinutes(end, start);
          if (diff > 0 && !isNaN(diff)) totalMinutes += diff;
        } catch (e) {}
      }

      // Subject frequency
      if (r.subject) {
        subjectsMap[r.subject] = (subjectsMap[r.subject] || 0) + 1;
      }

      // Monthly classes
      const rMonth = r.records?.month || 'Unknown';
      monthsMap[rMonth] = (monthsMap[rMonth] || 0) + 1;
    });

    records.forEach(r => {
       monthRecordMap[r.month] = (monthRecordMap[r.month] || 0) + 1;
    });

    const totalTeachingHours = (totalMinutes / 60).toFixed(1);
    const totalSubjectsCovered = Object.keys(subjectsMap).length;

    const subjectDistribution = Object.entries(subjectsMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    const monthlyTrends = Object.entries(monthsMap).map(([month, classes]) => ({ month, classes }));
    const recordMonthlyTrends = Object.entries(monthRecordMap).map(([month, count]) => ({ month, records: count }));

    const mostTaughtSubject = subjectDistribution.length > 0 ? subjectDistribution[0].name : 'N/A';
    
    const sortedMonths = [...monthlyTrends].sort((a,b) => b.classes - a.classes);
    const mostActiveMonth = sortedMonths.length > 0 ? sortedMonths[0].month : 'N/A';

    const averageTeachingHours = totalClasses > 0 ? (totalMinutes / 60 / totalClasses).toFixed(2) : '0';

    return {
      totalRecords,
      totalClasses,
      totalTeachingHours,
      totalSubjectsCovered,
      subjectDistribution,
      monthlyTrends,
      recordMonthlyTrends,
      mostTaughtSubject,
      mostActiveMonth,
      averageTeachingHours,
      top5Subjects: subjectDistribution.slice(0, 5)
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0097B2]"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, subtitle }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
      <div className="p-3 rounded-xl bg-cyan-50 text-[#0097B2]">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-green-600 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#0097B2]" /> Performance Analytics
        </h1>
        <p className="text-gray-500 mt-2">Insights and reporting on your teaching activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Records" value={stats.totalRecords} icon={<FileText size={24} />} subtitle="Documents Created" />
        <StatCard title="Classes Completed" value={stats.totalClasses} icon={<CheckCircle2 size={24} />} subtitle="Total Sessions Logged" />
        <StatCard title="Teaching Hours" value={stats.totalTeachingHours} icon={<Clock size={24} />} subtitle={`Avg. ${stats.averageTeachingHours}h per class`} />
        <StatCard title="Subjects Covered" value={stats.totalSubjectsCovered} icon={<BookOpen size={24} />} subtitle={`Top: ${stats.mostTaughtSubject}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0097B2]" /> Monthly Class Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{fill: '#6b7280'}} />
                <YAxis tick={{fill: '#6b7280'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="classes" stroke="#0097B2" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#0097B2]" /> Records Created Per Month
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.recordMonthlyTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{fill: '#6b7280'}} />
                <YAxis tick={{fill: '#6b7280'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="records" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0097B2]" /> Subject Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.top5Subjects}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.top5Subjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {stats.top5Subjects.map((item, index) => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length]}}></div>
                   <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                 </div>
                 <span className="font-medium">{item.value} classes</span>
               </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-[#002147] rounded-2xl shadow-sm p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Performance Summary</h3>
            <p className="text-cyan-100 opacity-90 mb-6 max-w-lg">A quick overview of your highest productivity points.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
                 <p className="text-cyan-200 text-sm font-medium mb-1 uppercase tracking-wider">Most Active Month</p>
                 <p className="text-2xl font-bold">{stats.mostActiveMonth}</p>
                 <p className="text-sm opacity-80 mt-1">Highest frequency of completed classes</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
                 <p className="text-cyan-200 text-sm font-medium mb-1 uppercase tracking-wider">Most Taught Subject</p>
                 <p className="text-2xl font-bold truncate">{stats.mostTaughtSubject}</p>
                 <p className="text-sm opacity-80 mt-1">Core focus of your teaching sessions</p>
              </div>
            </div>
          </div>
          {/* Abstract graphic */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
            <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#0097B2" d="M47.7,-67.2C60.7,-58.5,69.5,-42.8,75.1,-26.3C80.7,-9.8,83.1,7.5,77.7,21.8C72.2,36.2,59,47.7,44.7,55.5C30.3,63.4,15.2,67.6,-1.1,69.2C-17.3,70.7,-34.6,69.7,-48.5,61.4C-62.4,53.2,-72.8,37.8,-76.3,21.3C-79.9,4.9,-76.6,-12.5,-68.2,-26.2C-59.8,-39.8,-46.3,-49.7,-32.1,-57.8C-17.8,-65.9,-2.8,-72.1,13.2,-70.7C29.2,-69.3,46.5,-59.8,47.7,-67.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
