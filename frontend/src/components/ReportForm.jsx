import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Camera, Upload, Loader2, MapPin, User, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import imageCompression from 'browser-image-compression';
// Leaflet Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ setLocation, fetchAddress }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
      fetchAddress(lat, lng);
    },
  });
  return null;
};

const ReportForm = ({ onReportSuccess }) => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [location, setLocation] = useState({ lat: 26.9124, lng: 75.7873 });
  const [address, setAddress] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    phone: ''
  });
  
  

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name || "Address not found");
    } catch (err) { console.error(err); }
  };

  const handleDetectLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          fetchAddress(coords.lat, coords.lng);
          setLoading(false);
        },
        (err) => { setLoading(false); alert("Please enable GPS!"); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => { handleDetectLocation(); }, []);

  
  
const handleImageUpload = async (event) => {
  const f = event.target.files[0]; // Fix: event.target.target.files nahi hoga
  if (!f) return;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(f, options);
    setFile(compressedFile);
    setPreview(URL.createObjectURL(compressedFile));
  } catch (error) {
    
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactInfo.phone)) {
      return alert("Phone is not Valid!");
    }

    if (!file) return alert("File is not uploaded?");
   
    
    setLoading(true);

   
    const formData = new FormData();
    formData.append('image', file);
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());
    formData.append('address', address);
    formData.append('userName', contactInfo.name);
    formData.append('phone', contactInfo.phone);
    if (user) formData.append('userId', user._id || user.id);

    try {
      await axios.post('${import.meta.env.VITE_API_URL}/api/test-ai', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Report submitted successfully! 🎉");
      setFile(null); setPreview(null);
      if (onReportSuccess) onReportSuccess();
    } catch (err) { alert("Submission failed!"); } finally { setLoading(false); }
  };

 
    return (
  <div className="w-full max-w-[420px] mx-auto bg-white p-7 rounded-[2.5rem] shadow-lg border border-slate-50">
    <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
      <Camera className="text-blue-600" size={20} />
      Report New Issue
    </h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload - Balanced Size */}
     <div className="border-2 border-dashed border-slate-200 rounded-2xl p-3 text-center bg-slate-50">
        {preview ? (
          <div className="relative">
            <img id="ai-preview" src={preview} alt="Preview" className="w-full h-52 object-cover rounded-2xl shadow-sm" />
            <button 
              type="button" 
              onClick={() => {setFile(null); setPreview(null);}} 
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-[10px]"
            >✕</button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center py-2">
            <Upload className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-gray-500 text-xs font-medium">Upload Photo</span>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        )}
      </div>

      {/* Map - Fixed Height to match Dashboard Cards */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Location</label>
        <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner">
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={18} 
            style={{ height: '100%', width: '100%' }}
            key={`${location.lat}-${location.lng}`}
          >
            <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
            <Marker position={[location.lat, location.lng]} draggable={true} />
            <MapClickHandler setLocation={setLocation} fetchAddress={fetchAddress} />
          </MapContainer>
        </div>
      </div>

      {/* Inputs - Simple & Clean */}
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none cursor-not-allowed" 
            value={contactInfo.name} 
            readOnly 
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-400 outline-none transition-all" 
            value={contactInfo.phone} 
            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
            required 
          />
        </div>
      </div>

      <button 
        disabled={loading} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:bg-gray-300"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  </div>
)
};

export default ReportForm;