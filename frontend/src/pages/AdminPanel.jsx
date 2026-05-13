import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapDashboard from '../components/MapDashboard';
import { CheckCircle, Clock, AlertCircle, RefreshCcw } from 'lucide-react';

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
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
      await axios.patch(`http://localhost:5000/api/reports/${id}/status`, { status: newStatus }, 
        {
        headers: {
         
          Authorization: `Bearer ${token}` 
        }
    }
      );
      fetchReports(); // List aur Map ko refresh karne ke liye
    } catch (err) {
      alert("Update failed!");
    }
  };

  const deleteReport = async (id) => {
  if (window.confirm("Are you sure?")) {
    try {
      await axios.delete(`http://localhost:5000/api/reports/${id}`);
      // State update karo taaki UI se report gayab ho jaye
      setReports(reports.filter(report => report._id !== id));
      alert("Report Deleted!");
    } catch (err) {
      alert("Something went wrong!");
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Admin <span className="text-blue-600">Control Center</span>
          </h1>
          <button onClick={fetchReports} className="p-2 hover:rotate-180 transition-all">
            <RefreshCcw className="text-slate-400" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-12 h-[400px]">
             <MapDashboard reports={reports} />
          </div>

          {/* Reports Management Table */}
          <div className="lg:col-span-12 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-5">Issue</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Reported By</th>
                  <th className="p-5">Current Status</th>
                  <th className="p-5 text-right">Actions</th>
                  <th className="p-5">Contact Details</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={report.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <span className="font-bold text-slate-700">{report.category}</span>
                      </div>
                    </td>
            <td className="p-5">
  <div className="flex flex-col">
    <span className="font-bold text-slate-800">{report.userName}</span>
    <a 
      href={`tel:${report.phone}`} 
      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
    >
      📞 {report.phone}
    </a>
  </div>
</td>

                    <td className="px-6 py-4 max-w-xs">
  <div className="flex flex-col gap-1">
    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">📍 Exact Location</span>
    <p className="text-sm text-slate-600 leading-tight">
      {report.address} 
    </p>
  </div>
</td>
                    <td className="p-5 text-slate-500 font-medium">{report.userName || "Citizen"}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                          report.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button 
                        onClick={() => updateStatus(report._id, 'In Progress')}
                        className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                        title="Mark In Progress"
                      >
                        <Clock size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(report._id, 'Resolved')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button 
                         onClick={() => deleteReport(report._id)}
                                className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition"
                           >
                          Delete Report
                            </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;