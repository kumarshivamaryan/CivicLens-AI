// 🔥 RESPONSIVE CHANGE: Purane code mein useState aur useContext import nahi the, jisse code crash ho jata.
// Maine unhe yahan standard React library se import kiya hai responsive loaders chalane ke liye.
import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, AlertCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/user/${user.id}`);
        setMyReports(res.data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [user?.id]);

  // 🔥 UI CHANGE: Badges ke borders aur backgrounds ko soft (light premium look) kiya taaki mobile screen par chubhein nahi.
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'text-green-700 bg-green-50 border border-green-200';
      case 'pending': return 'text-amber-700 bg-amber-50 border border-amber-200';
      default: return 'text-blue-700 bg-blue-50 border border-blue-200';
    }
  };

  // 🔥 UI CHANGE: Priority ke hisab se alag-alag background badalna taaki mobile list mein important dikkat turant dikhe.
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-500 bg-orange-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center font-sans">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-500">Loading your citizen dashboard...</p>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans px-4 sm:px-6 py-6 md:py-10 relative">
      
      
      <div className="max-w-6xl mx-auto mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Main App
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
      
        <header className="mb-8 md:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ⚡ Citizen Analytics
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            My <span className="text-blue-600">Reports Dashboard</span>
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Track, monitor, and check statuses of issues you've filed, <span className="text-slate-800 font-bold">{user?.name || 'Shivam'}</span>.
          </p>
        </header>

        
        {myReports.length === 0 ? (
          
          <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-xl shadow-blue-100/40 text-center border border-slate-100 max-w-xl mx-auto space-y-4">
            <div className="bg-slate-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No reports found</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                You haven't reported any public infrastructure issues yet. Your dashboard is empty!
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-95"
            >
              File a Report Now
            </Link>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {myReports.map((report) => (
              
              <div 
                key={report._id} 
                className="bg-white rounded-[2rem] shadow-md shadow-slate-100 overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 group flex flex-col h-full"
              >
               
                <div className="relative overflow-hidden h-48 bg-slate-100 flex-shrink-0">
                  <img 
                    src={report.imageUrl} 
                    alt={report.category} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                
              
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-800 mb-2 capitalize tracking-tight">
                      {report.category}
                    </h3>
                    
                   
                    <p className="text-slate-500 text-sm line-clamp-3 font-medium mb-6">
                      {report.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-400">
                      ID: #{report._id?.slice(-6)}
                    </span>
                  
                    <button className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/btn">
                      View Details 
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;