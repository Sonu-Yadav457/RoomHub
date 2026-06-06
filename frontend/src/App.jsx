import React, { useState } from 'react';
import Home from './pages/Home';
import DeptSelect from './pages/DeptSelect';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState('college');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const handleSelectCollege = (college) => {
    setSelectedCollege(college);
    setCurrentStep('department');
  };

  const handleSelectDept = (dept) => {
    setSelectedDept(dept);
    setCurrentStep('rooms');
  };

  const handleBackToColleges = () => {
    setSelectedCollege(null);
    setSelectedDept(null);
    setCurrentStep('college');
  };

  const handleBackToDepts = () => {
    setSelectedDept(null);
    setCurrentStep('department');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-955/50 backdrop-blur py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToColleges}>
          <span className="text-xl font-black tracking-wider text-emerald-400">JAC</span>
          <span className="text-xl font-bold tracking-tight text-slate-200">RoomHub</span>
        </div>
        {selectedCollege && (
          <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex gap-2">
            <span className="text-emerald-400 font-bold">{selectedCollege.shortCode}</span>
            {selectedDept && <span className="text-slate-400">/ {selectedDept.shortCode}</span>}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {currentStep === 'college' && (
          <Home onSelectCollege={handleSelectCollege} />
        )}

        {currentStep === 'department' && (
          <DeptSelect 
            college={selectedCollege} 
            onSelectDept={handleSelectDept} 
            onBack={handleBackToColleges} 
          />
        )}

        {currentStep === 'rooms' && (
          <Dashboard 
            college={selectedCollege}
            department={selectedDept} 
            onBack={handleBackToDepts} 
          />
        )}
      </main>
    </div>
  );
}

export default App; 