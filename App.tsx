import React, { useState } from 'react';
import { EngineVariant, AIRCRAFT_DATA } from './types';
import { PlaneCalculator } from './components/PlaneCalculator';

export default function App() {
  const [variant, setVariant] = useState<EngineVariant>('CEO');

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              AeroTanker
            </h1>
            <p className="text-slate-500 text-sm mt-1">Fuel Tankering & Weight Calculator</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setVariant('CEO')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                variant === 'CEO' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              CEO Engine
            </button>
            <button
              onClick={() => setVariant('NEO')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                variant === 'NEO' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              NEO Engine
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PlaneCalculator 
            model="A320" 
            variant={variant} 
            limits={AIRCRAFT_DATA[variant].A320} 
          />
          <PlaneCalculator 
            model="A321" 
            variant={variant} 
            limits={AIRCRAFT_DATA[variant].A321} 
          />
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-xs py-4">
          <p>Ensure all inputs are in metric tons. Verification of load sheet data is mandatory before use.</p>
        </div>
      </div>
    </div>
  );
}