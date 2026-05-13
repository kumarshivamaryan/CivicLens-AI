import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { setUser } = useContext(AuthContext); // Context mein login wala function naya token save kar lega
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      // Register ke baad direct login
      localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
     setUser(res.data.user);
      window.location.href = "/"; // Direct home par bhej do
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Join <span className="text-blue-600">CivicLens</span></h2>
          <p className="text-slate-500 text-sm mt-2">Become a Citizen Hero today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;