import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Hammer, Quote, LayoutDashboard, Settings } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import ReportForm from '../components/ReportForm';
import ReportsList from '../components/ReportsList';
import { AuthContext } from '../context/AuthContext';
import MapDashboard from '../components/MapDashboard';

const Home = () => {
  const [reports, setReports] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchReports = async () => {
    try {
      const res = await axios.get('${import.meta.env.VITE_API_URL}/api/reports');
      setReports(res.data);
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => { 
    fetchReports(); 
  }, []);

  const solvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. Navbar: Tags Balanced Here */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-black italic text-xl shadow-md">CL</div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
            CIVICLENS <span className="text-blue-600 italic">AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-blue-50/50 pl-4 pr-2 py-1.5 rounded-full border border-blue-100">
              <div className="flex flex-col items-center leading-tight px-2">
                <span className="text-[9px] uppercase tracking-[0.15em] text-blue-600 font-black">✨ Citizen Hero</span>
                <span className="text-sm font-bold text-slate-800 tracking-tight">{user.name}</span>
              </div>
              
              {user.role === 'admin' && (
                <Link 
                  to="/admin-control" 
                  className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-full font-medium transition-all shadow-md active:scale-95 text-xs"
                >
                  <Settings size={14} />
                  Admin Panel
                </Link>
              )}

              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md active:scale-95 text-xs"
              >
                <LayoutDashboard size={14} />
                My Dashboard
              </Link>

              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link to="/login" className="text-slate-600 text-sm font-bold hover:text-blue-600 transition-all">
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative pt-20 pb-16 px-4 bg-gradient-to-b from-blue-50 to-transparent text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14}/> AI-Powered Urban Maintenance
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            Better Infrastructure, <br/> 
            <span className="text-blue-600">Stronger Communities.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto italic">
            "Your eyes see the problem, our AI initiates the solution. Together, let's build a city that works for everyone."
          </p>
        </div>
      </header>

      {/* 3. Stats Section */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Users size={28}/></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Reports</p>
            <p className="text-3xl font-black text-slate-800">{reports.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600"><Hammer size={28}/></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Issues Resolved</p>
            <p className="text-3xl font-black text-slate-800">{solvedCount}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 text-white">
          <div className="bg-white/10 p-4 rounded-2xl"><Quote size={28}/></div>
          <p className="text-sm font-medium leading-tight">"Innovation is the bridge between a problem and its resolution."</p>
        </div>
      </div>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 space-y-2">
          <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            Civic Issue Heatmap
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </h3>
          <p className="text-slate-500">Explore reported issues across the city in real-time.</p>
        </div>
        <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-blue-100 h-[450px]">
          <MapDashboard reports={reports} />
        </div>
      </section>

      {/* 4. Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 sticky top-28 flex flex-col items-start">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3 w-full max-w-[350px]">
              Report New Issue <span className="h-1.5 w-12 bg-blue-600 rounded-full"></span>
            </h3>
            
              <ReportForm onReportSuccess={fetchReports} />
            </div>
         

          <div className="lg:col-span-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              Live Activity
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </h3>
            <ReportsList 
              reports={reports.filter(r => r.status !== 'Resolved')} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;