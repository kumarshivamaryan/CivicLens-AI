import React from 'react';
import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

const ReportsList = ({ reports }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <AlertTriangle className="text-yellow-500" /> Recent Issues
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-500 italic">No reports found yet. Be the first to report!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} 
                className="group bg-white rounded-[2rem] p-4 border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/50">
              <img 
                src={report.imageUrl} 
                alt="Issue" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    report.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {report.priority}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 line-clamp-1">{report.description}</h3>
                
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>Verified Location</span>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> AI Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsList;