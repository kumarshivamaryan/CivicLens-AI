import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- NUCLEAR FIX: Override Global Leaflet Icons ---
delete L.Icon.Default.prototype._getIconUrl;


L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// ------------------------------------------------

function SetViewOnClick({ reports }) {
  const map = useMap();
  useEffect(() => {
    const pendingReports = reports.filter(r => 
      r.status !== 'Resolved' && r.location?.coordinates?.length === 2
    );
    if (pendingReports.length > 0) {
      const bounds = pendingReports.map(r => [
        r.location.coordinates[1], 
        r.location.coordinates[0]
      ]);
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14 });
    }
  }, [reports, map]);
  return null;
}

const MapDashboard = ({ reports }) => {
  const defaultPos = [26.9124, 75.7873];

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-0">
      <MapContainer 
        center={defaultPos} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        <SetViewOnClick reports={reports} />

        {reports.map((report) => {
          const isPending = report.status !== 'Resolved';
          const coords = report.location?.coordinates;

          if (isPending && coords?.length === 2) {
            return (
              <Marker 
                key={report._id} 
                position={[coords[1], coords[0]]}
              >
                <Popup>
                  <div className="p-1 text-center min-w-[120px]">
                    <img src={report.imageUrl} alt="issue" className="w-full h-24 object-cover rounded-lg mb-2" />
                    <p className="font-bold text-xs">{report.category}</p>
                    <p className="text-[10px] text-red-600 font-black uppercase mt-1">Status: {report.status}</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapDashboard;