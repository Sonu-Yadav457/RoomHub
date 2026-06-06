import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

function Dashboard({ college, department, onBack }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms/department/${department._id}`);
      if (!response.ok) {
        throw new Error('Failed to synchronize classroom records.');
      }
      const data = await response.json();
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (department?._id) {
      fetchRooms();
    }
  }, [department]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 border-slate-700"></div>
        <p className="text-slate-400 text-sm">Syncing live room logs for {department.shortCode}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center max-w-md mx-auto my-12">
        <p className="font-bold">Error Accessing Dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={onBack} className="mt-4 text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-200 hover:bg-slate-700">
          Go Back
        </button>
      </div>
    );
  }

  // Filter classrooms locally based entirely on the backend's automated timetable evaluation
  const emptyRooms = rooms.filter(room => !room.isOccupied);
  const occupiedRooms = rooms.filter(room => room.isOccupied);

  return (
    <div className="py-4">
      {/* HEADER ACTION NAVIGATION ROW */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Branches
        </button>
        <button onClick={fetchRooms} className="text-xs bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-emerald-400 p-2 rounded-xl flex items-center gap-1.5 transition-colors">
          <RefreshCw size={12} /> Refresh Data
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {college.shortCode} <span className="text-slate-500">/</span> {department.name}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Automated schedule analysis displaying real-time space availability based on college timetables.
        </p>
      </div>

      {/* DUAL-COLUMN LAYOUT DISTRIBUTION CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* COLUMN 1: EMPTY ROOMS AVAILABLE */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center px-1">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={16} /> Available Empty Rooms ({emptyRooms.length})
            </h2>
          </div>
          
          {emptyRooms.length === 0 ? (
            <p className="text-slate-500 text-sm bg-slate-950/10 border border-slate-800 border-dashed p-6 rounded-xl text-center">
              No empty rooms reported at this hour. Check other department blocks!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emptyRooms.map(room => (
                <div key={room._id} className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="text-xl font-black text-slate-100">{room.roomNumber}</h3>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md inline-block mt-1">Free Now</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMN 2: OCCUPIED ROOMS */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center px-1">
            <h2 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
              <XCircle size={16} /> Classes in Progress ({occupiedRooms.length})
            </h2>
          </div>

          {occupiedRooms.length === 0 ? (
            <p className="text-slate-500 text-sm bg-slate-950/10 border border-slate-800 border-dashed p-6 rounded-xl text-center">
              All classrooms are currently reported empty. Free real estate!
            </p>
          ) : (
            <div className="space-y-3">
              {occupiedRooms.map(room => (
                <div key={room._id} className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex justify-between items-center shadow-md">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-200">{room.roomNumber}</h3>
                      <span className="text-[9px] uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.2 rounded">In Use</span>
                    </div>
                    <p className="text-sm text-slate-400 font-semibold mt-1 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg line-clamp-1 italic">
                      {room.currentClass}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;