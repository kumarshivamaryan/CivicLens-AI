import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMyReports = async () => {
    if (!user?.id) {
      setLoading(false); // Agar ID nahi hai, toh loading band karo
      return;
    }

     // <-- YEH ADD KARO
       // <-- AUR YEH BHI


    try {

      const res = await axios.get(`http://localhost:5000/api/reports/user/${user.id}`);
        
      setMyReports(res.data);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false); // API call khatam hone par loading band
    }
  };

  fetchMyReports();
}, [user?.id]);

  // Status ke hisaab se color badalne ke liye helper function
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
          <p className="text-gray-600">Track the status of the issues you've reported, Shivam.</p>
        </header>

        

        {myReports.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">You haven't filed any reports yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myReports.map((report) => (
              <div key={report._id} className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
                {/* Image Section */}
                <img 
                  src={report.imageUrl} 
                  alt={report.category} 
                  className="w-full h-48 object-cover"
                />
                
                {/* Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
                    {report.category}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {report.description}
                  </p>

                  <div className="pt-4 border-t flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {report.priority} Priority
                    </div>
                    <button className="text-blue-600 hover:underline">
                      View Details
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