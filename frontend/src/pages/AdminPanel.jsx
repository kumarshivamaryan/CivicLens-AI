import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapDashboard from '../components/MapDashboard';

import { CheckCircle, Clock, AlertCircle, RefreshCcw, Trash2, MapPin, Phone, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`);
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/reports/${id}/status`, { status: newStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      fetchReports(); 
    } catch (err) {
      alert("Update failed!");
    }
  };

  const deleteReport = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/reports/${id}`);
        setReports(reports.filter(report => report._id !== id));
        alert("Report Deleted!");
      } catch (err) {
        alert("Something went wrong!");
      }
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center font-sans">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-500">Loading Admin Control Center...</p>
      </div>
    );
  }

  return (
   
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans px-4 sm:px-8 py-6 md:py-10">
      
      <div className="max-w-7xl mx-auto mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Main App
        </Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
      
        <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-blue-100/20">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Admin <span className="text-blue-600">Control Center</span>
          </h1>
          <button onClick={fetchReports} className="p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all group active:scale-95 border border-slate-200">
            <RefreshCcw size={18} className="text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </header>

       
        <div className="h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl shadow-blue-100/40">
          <MapDashboard reports={reports} />
        </div>

        
        <div className="hidden lg:block bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 overflow-hidden border border-slate-100">
          <table className="w-full text-left border-collapse">
           
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-5">Issue Details</th>
                <th className="p-5">Reported By / Contact</th>
                <th className="p-5">Location (Address)</th>
                <th className="p-5">Current Status</th>
                <th className="p-5 text-right">Actions Panel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                  
                  
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={report.imageUrl} className="w-12 h-12 rounded-xl object-cover border bg-slate-50" alt="" />
                      <span className="font-extrabold text-slate-800 text-base capitalize">{report.category}</span>
                    </div>
                  </td>
                  
                 
                  <td className="p-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 text-sm">{report.userName || "Citizen Hero"}</span>
                      <a href={`tel:${report.phone}`} className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">
                        <Phone size={12} /> {report.phone || "No Phone"}
                      </a>
                    </div>
                  </td>

                  <td className="p-5 max-w-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate block" title={report.address}>
                        {report.address || "Coordinates Loaded"}
                      </span>
                    </div>
                  </td>

                 
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                      ${report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 
                        report.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {report.status || 'Pending'}
                    </span>
                  </td>

                 
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => updateStatus(report._id, 'In Progress')}
                        className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Mark In Progress"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        onClick={() => updateStatus(report._id, 'Resolved')}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => deleteReport(report._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Report"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="block lg:hidden space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md flex flex-col space-y-4">
              
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={report.imageUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border bg-slate-50 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-slate-800 capitalize text-base tracking-tight">{report.category}</h3>
                    <p className="text-xs text-slate-400 font-semibold">ID: #{report._id?.slice(-6)}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border
                  ${report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 
                    report.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-red-50 text-red-700 border-red-200'}`}>
                  {report.status || 'Pending'}
                </span>
              </div>

             
              <div className="space-y-2.5 text-xs font-medium border-t border-b border-slate-50 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 inline-flex items-center gap-1"><User size={12} /> Reported By:</span>
                  <span className="text-slate-700 font-bold">{report.userName || "Citizen Hero"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 inline-flex items-center gap-1"><Phone size={12} /> Contact No:</span>
                  <a href={`tel:${report.phone}`} className="text-blue-600 font-bold hover:underline">{report.phone || "N/A"}</a>
                </div>
                <div className="flex flex-col gap-1 pt-1 border-t border-dashed border-slate-100">
                  <span className="text-slate-400 inline-flex items-center gap-1"><MapPin size={12} /> Address String:</span>
                  <p className="text-slate-600 text-sm pl-4 leading-tight">{report.address || "Coordinates Fetched"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button 
                  onClick={() => updateStatus(report._id, 'In Progress')}
                  className="py-2.5 bg-amber-50 active:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-amber-100"
                >
                  <Clock size={14} /> Progress
                </button>
                <button 
                  onClick={() => updateStatus(report._id, 'Resolved')}
                  className="py-2.5 bg-green-50 active:bg-green-100 text-green-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-green-100"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
                <button 
                  onClick={() => deleteReport(report._id)}
                  className="py-2.5 bg-red-50 active:bg-red-100 text-red-500 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-red-100"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;