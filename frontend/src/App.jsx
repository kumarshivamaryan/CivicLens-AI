import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages & Components
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/Register';
import Footer from './components/Footer'; // 👈 Footer Import
// import Navbar from './components/Navbar'; // 👈 Navbar bhi yahan rakho

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex items-center justify-center h-screen font-bold text-blue-600 animate-pulse">
      Initialising CivicLens AI Systems...
    </div>
  );

  return (
    <Router>
      {/* 💡 Flex Container: Footer ko hamesha bottom par rakhne ke liye */}
      <div className="flex flex-col min-h-screen">
        
       
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            
  
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin-control" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </main>

       
        <Footer />
      </div>
    </Router>
  );
}

export default App;