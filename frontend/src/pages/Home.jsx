import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Hammer, Quote, LayoutDashboard, Settings, Menu, X, LogOut } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import ReportForm from '../components/ReportForm';
import ReportsList from '../components/ReportsList';
import { AuthContext } from '../context/AuthContext';
import MapDashboard from '../components/MapDashboard';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Hamburger state
  const [visibleCount, setVisibleCount] = useState(5); // Mobile activity list limit
  const { user, logout } = useContext(AuthContext);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`);
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
      
      {/* 1. Navbar Section */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-black italic text-xl shadow-md">CL</div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-slate-800 uppercase">
            CIVICLENS <span className="text-blue-600 italic">AI</span>
          </h1>
        </div>

        {/* Desktop Links (Badi screens ke liye - hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-4">
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

        {/* Mobile Hamburger Button Trigger */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-700 p-2 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 bg-white border-b border-slate-200 shadow-xl z-40 p-5 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          {user ? (
            <div className="flex flex-col space-y-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Logged In As</p>
                  <p className="text-base font-bold text-slate-800">{user.name}</p>
                </div>
                <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">Citizen</span>
              </div>

              {user.role === 'admin' && (
                <Link 
                  to="/admin-control" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium text-sm shadow-sm"
                >
                  <Settings size={16} /> Admin Panel
                </Link>
              )}

              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium text-sm shadow-sm"
              >
                <LayoutDashboard size={16} /> My Dashboard
              </Link>

              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 py-3 rounded-xl font-bold text-sm transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold bg-slate-50"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center bg-slate-900 text-white py-3 rounded-xl text-sm font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2. Hero Section */}
      <header className="relative pt-12 md:pt-20 pb-12 md:pb-16 px-4 bg-gradient-to-b from-blue-50 to-transparent text-center">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14}/> AI-Powered Urban Maintenance
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Better Infrastructure, <br/> 
            <span className="text-blue-600">Stronger Communities.</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto italic px-2">
            "Your eyes see the problem, our AI initiates the solution. Together, let's build a city that works for everyone."
          </p>
        </div>
      </header>

      {/* 3. Stats Section */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 -mt-4 md:-mt-8 relative z-10">
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
          <div className="bg-blue-100 p-3 md:p-4 rounded-2xl text-blue-600"><Users size={24}/></div>
          <div>
            <p className="text-xs md:text-sm font-medium text-slate-400">Total Reports</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800">{reports.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
          <div className="bg-green-100 p-3 md:p-4 rounded-2xl text-green-600"><Hammer size={24}/></div>
          <div>
            <p className="text-xs md:text-sm font-medium text-slate-400">Issues Resolved</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800">{solvedCount}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-5 md:p-6 rounded-3xl shadow-xl flex items-center gap-5 text-white">
          <div className="bg-white/10 p-3 md:p-4 rounded-2xl"><Quote size={24}/></div>
          <p className="text-xs md:text-sm font-medium leading-tight">"Innovation is the bridge between a problem and its resolution."</p>
        </div>
      </div>

      {/* Map Heatmap Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-6 md:mb-8 space-y-1 md:space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            Civic Issue Heatmap
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </h3>
          <p className="text-sm text-slate-500">Explore reported issues across the city in real-time.</p>
        </div>
        <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl shadow-blue-100 h-[300px] md:h-[450px]">
          <MapDashboard reports={reports} />
        </div>
      </section>

      {/* 4. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 w-full">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3 w-full">
              Report New Issue <span className="h-1.5 flex-1 max-w-[100px] bg-blue-600 rounded-full"></span>
            </h3>
            <div className="bg-white p-2 rounded-2xl md:bg-transparent md:p-0 shadow-sm md:shadow-none border border-slate-100 md:border-none">
              <ReportForm onReportSuccess={fetchReports} />
            </div>
          </div>
         
          {/* Right Column: Live Activity Feed */}
          <div className="lg:col-span-7 w-full mt-4 lg:mt-0">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 md:mb-8 flex items-center gap-3">
              Live Activity
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </h3>

            {/* Smart Conditional Rendering for Mobile vs Desktop List Limit */}
            {(() => {
              const activeReports = reports.filter(r => r.status !== 'Resolved');
              
              return (
                <div className="space-y-6">
                  {/* Laptop View: Direct Full List Render */}
                  <div className="hidden lg:block">
                    <ReportsList reports={activeReports} />
                  </div>

                  {/* Mobile View: Sliced Limited List Render */}
                  <div className="block lg:hidden">
                    <ReportsList reports={activeReports.slice(0, visibleCount)} />
                  </div>

                  {/* Dynamic See More / See Less Actions for Mobile */}
                  {activeReports.length > 5 && (
                    <div className="block lg:hidden text-center mt-4">
                      {visibleCount < activeReports.length ? (
                        <button 
                          onClick={() => setVisibleCount(activeReports.length)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm border border-blue-200 w-full"
                        >
                          See More ({activeReports.length - visibleCount} more)
                        </button>
                      ) : (
                        <button 
                          onClick={() => setVisibleCount(5)}
                          className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95 w-full"
                        >
                          See Less
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

        </div>
      </main>
    </div>
  );
}

export default Home;