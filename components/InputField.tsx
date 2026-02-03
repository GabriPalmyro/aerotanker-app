import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "0",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-semibold text-gray-500 mb-1 truncate" title={label}>
        {label}
      </label>
      <input
        type="number"
        step="0.001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-blue-100 border border-blue-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 font-mono text-center shadow-sm transition-colors"
      />
    </div>
  );
};