import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext); // Context se setUser nikal liya
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Backend ko request bhejo
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // 2. Token aur User ko LocalStorage mein save karo
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // 3. Context ko update karo (Taaki poori App ko pata chal jaye)
            setUser(res.data.user);

            // 4. Dashboard par bhej do
            alert("Login Successful!");
            navigate('/'); 
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login to CivicLens</h2>
                <input 
                    type="email" placeholder="Email" 
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" placeholder="Password" 
                    className="w-full p-2 mb-6 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    Login
                </button>
                <p className="text-center mt-6 text-sm text-slate-500">
  Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
</p>
            </form>
        </div>
    );
};

export default Login;