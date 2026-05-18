import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            alert("Login Successful!");
            navigate('/'); 
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans">
            
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            <div className="w-full max-w-md space-y-8">
                {/* Brand Logo & Header */}
                <div className="text-center">
                    <div className="inline-block bg-blue-600 p-3 rounded-2xl text-white font-black italic text-2xl shadow-lg mb-4">
                        CL
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                        Welcome Back to <span className="text-blue-600">CivicLens</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Enter your details to access your citizen hero dashboard
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block pl-1">
                                Email Address
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="name@example.com" 
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 text-slate-800"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block pl-1">
                                Password
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 text-slate-800"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-8"
                        >
                            <LogIn size={16} />
                            Sign In
                        </button>
                    </form>

                    {/* Footer Links inside Card */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;