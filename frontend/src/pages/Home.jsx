import React, { useState, useEffect } from 'react';
import { School } from 'lucide-react';

function Home({ onSelectCollege }) {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchColleges = async () => {
      try {
        const response = await fetch(`${API_URL}/colleges`);
        if (!response.ok) {
          throw new Error('Failed to retrieve university records from database');
        }
        const data = await response.json();
        setColleges(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 border-slate-700"></div>
        <p className="text-slate-400 text-sm">Syncing with MongoDB Atlas cluster...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center max-w-md mx-auto my-12">
        <p className="font-bold">Database Error Connection Interrupted</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
          Find an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Empty Room</span> Instantly
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Crowdsourced, real-time classroom and lecture lab tracking across premium JAC Delhi campuses.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-xs uppercase font-bold tracking-widest text-slate-500 text-left mb-4 px-2">
          Select Your Campus
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colleges.map((college) => (
            <div
              key={college._id}
              onClick={() => onSelectCollege(college)}
              className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all group flex flex-col justify-between text-left min-h-[160px] shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-white">
                <School size={120} />
              </div>

              <div className="bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 h-12 w-12 rounded-xl flex items-center justify-center text-emerald-400 transition-colors shadow-inner">
                <School size={22} />
              </div>

              <div className="mt-4">
                <span className="text-xs font-bold tracking-widest text-emerald-400 block mb-1">
                  {college.shortCode}
                </span>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                  {college.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;