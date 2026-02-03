import React, { useState } from 'react';
import { AircraftLimits, EngineVariant, CalculatorState } from '../types';
import { InputField } from './InputField';

interface PlaneCalculatorProps {
  model: 'A320' | 'A321';
  variant: EngineVariant;
  limits: AircraftLimits;
}

const INITIAL_STATE: CalculatorState = {
  taxi: '', // Start empty to match spreadsheet
  sector4: '',
  sector3: '',
  sector2: '',
  sector1: '',
  zfw: '',
  tripPlusTaxi: '',
};

export const PlaneCalculator: React.FC<PlaneCalculatorProps> = ({ model, variant, limits }) => {
  const [inputs, setInputs] = useState<CalculatorState>(INITIAL_STATE);

  const handleReset = () => {
    setInputs(INITIAL_STATE);
  };

  // Helper to parse float safely, handling potential comma usage
  const val = (str: string) => parseFloat(str.replace(',', '.')) || 0;

  // --- Calculations ---

  // 1. Handle Taxi Unit Conversion
  // Users typically enter Taxi in Tons (e.g., 0.200) but calculation is in Kg.
  // Heuristic: If taxi value is small (< 10), assume Tons and multiply by 1000.
  // If taxi value is large (>= 10), assume it's already in Kg (e.g. 200).
  const rawTaxi = val(inputs.taxi);
  const taxiKg = rawTaxi < 10 && rawTaxi > 0 ? rawTaxi * 1000 : rawTaxi;

  // 2. Tanker (Sum of Taxi + Sectors)
  // We round to nearest integer to avoid floating point artifacts
  const tanker = Math.round(
    taxiKg + 
    val(inputs.sector4) + 
    val(inputs.sector3) + 
    val(inputs.sector2) + 
    val(inputs.sector1)
  );

  // 3. TOW (Takeoff Weight) = ZFW + Tanker
  const tow = Math.round(val(inputs.zfw) + tanker);

  // 4. LWG (Landing Weight) = TOW - (Sector 1 Trip + Taxi)
  const lwg = Math.round(tow - val(inputs.tripPlusTaxi));

  // --- Robust Limit Handling ---
  // Ensure limits are treated as KG even if data source is Tons (e.g. < 1000)
  const mtowLimit = limits.mtow < 1000 ? limits.mtow * 1000 : limits.mtow;
  const mlwLimit = limits.mlw < 1000 ? limits.mlw * 1000 : limits.mlw;

  // 5. MLW Delta = LWG - MaxLandingWeight
  const mlwDelta = Math.round(lwg - mlwLimit);

  // 6. Tank Allowed Logic
  // Constraint A (Takeoff Limit): MTOW - ZFW
  // Constraint B (Landing Limit): MLW + (Trip Consumption) - ZFW
  const maxTankByMTOW = mtowLimit - val(inputs.zfw);
  const maxTankByMLW = mlwLimit + val(inputs.tripPlusTaxi) - val(inputs.zfw);
  
  // Calculate Tank Allowed even if ZFW is 0 (returns max theoretical capacity)
  const tankAllowed = Math.round(Math.min(maxTankByMTOW, maxTankByMLW));

  // 7. Delta Reduce ZFW
  const deltaReduceZfw = mlwDelta;

  const handleChange = (field: keyof CalculatorState, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Format as Integer for KG
  const formatNum = (num: number) => Math.round(num).toLocaleString('en-US').replace(/,/g, '');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-lg font-bold rounded shadow-sm text-white ${model === 'A320' ? 'bg-green-600' : 'bg-red-600'}`}>
            {model}
          </span>
          <span className="text-gray-500 font-medium text-sm tracking-wider">{variant}</span>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={handleReset}
                className="group flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                title="Reset all fields"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Reset</span>
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex gap-4 text-sm font-mono">
              <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">MTOW (KG)</span>
                  <span className="font-bold text-red-600">{formatNum(mtowLimit)}</span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">MLW (KG)</span>
                  <span className="font-bold text-red-600">{formatNum(mlwLimit)}</span>
              </div>
            </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col gap-6">
        
        {/* Row 1: Inputs & Weights */}
        <div className="grid grid-cols-6 gap-2">
            {/* Input Group */}
            <div className="col-span-6 lg:col-span-4 grid grid-cols-5 gap-2 pb-2 border-b lg:border-b-0 lg:border-r border-gray-100 pr-0 lg:pr-2">
              <InputField label="Taxi" value={inputs.taxi} onChange={(v) => handleChange('taxi', v)} placeholder="0.2" />
              <InputField label="Sec 4" value={inputs.sector4} onChange={(v) => handleChange('sector4', v)} />
              <InputField label="Sec 3" value={inputs.sector3} onChange={(v) => handleChange('sector3', v)} />
              <InputField label="Sec 2" value={inputs.sector2} onChange={(v) => handleChange('sector2', v)} />
              <InputField label="Sec 1" value={inputs.sector1} onChange={(v) => handleChange('sector1', v)} />
              <div className="col-span-5 text-[10px] text-gray-400 mt-1 pl-1">Input Taxi in Tons (e.g. 0.2), others in KG</div>
            </div>

            {/* Calculated Tanker */}
            <div className="col-span-2 lg:col-span-1 bg-gray-50 rounded p-2 flex flex-col justify-center items-center border border-gray-200">
                <span className="text-xs font-semibold text-cyan-600 uppercase">Tanker</span>
                <span className="text-lg font-mono font-bold text-gray-800">{formatNum(tanker)}</span>
            </div>

             {/* ZFW Input */}
            <div className="col-span-4 lg:col-span-1">
                 <InputField label="ZFW (KG)" value={inputs.zfw} onChange={(v) => handleChange('zfw', v)} className="h-full" />
            </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* Row 2: Trip & TOW/LWG Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            
            {/* TOW Result */}
            <div className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">TOW</span>
                    <span className="text-[10px] text-red-400">Max: {formatNum(mtowLimit)}</span>
                </div>
                <div className={`text-xl font-mono font-bold ${tow > mtowLimit ? 'text-red-600' : 'text-gray-800'}`}>
                    {formatNum(tow)}
                </div>
            </div>

             {/* Trip + Taxi Input (Yellow Box) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 relative shadow-sm">
                 <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 rounded-t"></div>
                 <label className="text-xs font-bold text-yellow-800 mb-1 block uppercase truncate">Sector 1 (Trip+Taxi)</label>
                 <input
                    type="number"
                    step="1"
                    value={inputs.tripPlusTaxi}
                    onChange={(e) => handleChange('tripPlusTaxi', e.target.value)}
                    className="w-full bg-white border border-yellow-300 text-gray-900 text-lg rounded focus:ring-yellow-500 focus:border-yellow-500 block p-1 font-mono text-center"
                    placeholder="0"
                />
            </div>

            {/* LWG Result */}
             <div className="bg-white border border-gray-200 rounded p-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className={`absolute right-0 top-0 p-1 text-[10px] font-bold text-white rounded-bl ${lwg > mlwLimit ? 'bg-red-500' : 'bg-gray-400'}`}>
                  LWG
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Calc LWG</div>
                <div className={`text-xl font-mono font-bold ${lwg > mlwLimit ? 'text-red-600' : 'text-gray-800'}`}>
                    {formatNum(lwg)}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                   <span>Delta:</span>
                   <span className={mlwDelta > 0 ? 'text-red-500 font-bold' : 'text-green-600'}>
                     {mlwDelta > 0 ? '+' : ''}{formatNum(mlwDelta)}
                   </span>
                </div>
            </div>

             {/* MLW Delta (Display Only) */}
             <div className="flex flex-col justify-center items-center p-3 bg-gray-50 border border-gray-200 rounded opacity-75">
                 <span className="text-xs text-gray-400">MLW Limit</span>
                 <span className="font-mono text-lg text-gray-600">{formatNum(mlwLimit)}</span>
             </div>
        </div>

        {/* Results Area */}
        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tank Allowed (Green Box) */}
            <div className={`rounded-lg p-4 flex flex-col justify-center items-center shadow-md transition-colors ${tankAllowed < tanker ? 'bg-red-100 border-2 border-red-400' : 'bg-green-600 border-2 border-green-700'}`}>
                <span className={`uppercase text-xs font-bold mb-1 ${tankAllowed < tanker ? 'text-red-800' : 'text-white'}`}>Tank Allowed</span>
                <span className={`font-mono text-3xl font-extrabold ${tankAllowed < tanker ? 'text-red-900' : 'text-white'}`}>
                    {formatNum(tankAllowed)}
                </span>
                {tankAllowed < tanker && (
                    <span className="text-[10px] text-red-700 font-bold mt-1">EXCEEDS LIMIT!</span>
                )}
            </div>

            {/* Delta Reduce ZFW (Brown Box) */}
            <div className="bg-amber-800 rounded-lg p-4 flex flex-col justify-center items-center border-2 border-amber-900 shadow-md">
                <span className="uppercase text-xs font-bold text-amber-100 mb-1">Delta Reduce ZFW</span>
                <span className="font-mono text-3xl font-extrabold text-white">
                    {formatNum(deltaReduceZfw)}
                </span>
                <span className="text-[10px] text-amber-200 mt-1">
                    {deltaReduceZfw > 0 ? "(Overweight)" : "(Under Limit)"}
                </span>
            </div>

        </div>
      </div>
    </div>
  );
};