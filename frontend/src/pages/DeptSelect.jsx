import React, { useState, useEffect } from 'react';
import { ArrowLeft, Layers } from 'lucide-react';

function DeptSelect({ college, onSelectDept, onBack }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchDepartments = async () => {
      try {
        // Query the specific API route designed for the selected college's ID
        const response = await fetch(`${API_URL}/departments/college/${college._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch department listings for this campus.');
        }
        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (college?._id) {
      fetchDepartments();
    }
  }, [college]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 border-slate-700"></div>
        <p className="text-slate-400 text-sm">Querying branches for {college.shortCode}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center max-w-md mx-auto my-12">
        <p className="font-bold">Error Accessing Departments</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={onBack} className="mt-4 text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-200 hover:bg-slate-700">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto">
      {/* BACK NAVIGATION ACTION ROW */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
        Back to Campuses
      </button>

      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {college.name}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select an academic branch division below to explore live classroom occupancy states.
        </p>
      </div>

      <h2 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-4 px-1">
        Available Branches
      </h2>

      {/* DEPARTMENTS SELECTION GRID */}
      {departments.length === 0 ? (
        <p className="text-slate-500 text-sm bg-slate-950/20 border border-slate-800 p-8 rounded-2xl text-center">
          No branches mapped to this college yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {departments.map((dept) => (
            <div
              key={dept._id}
              onClick={() => onSelectDept(dept)}
              className="bg-slate-950/30 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all flex items-center gap-4 group shadow-md"
            >
              <div className="bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 h-11 w-11 rounded-lg flex items-center justify-center transition-colors shadow-inner shrink-0">
                <Layers size={18} />
              </div>
              
              <div>
                <span className="text-xs font-black text-emerald-400/80 tracking-wider block">
                  {dept.shortCode}
                </span>
                <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors mt-0.5 line-clamp-1">
                  {dept.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeptSelect;