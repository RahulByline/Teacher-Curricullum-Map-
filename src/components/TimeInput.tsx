import React, { useState, useRef } from 'react';
import { Clock, Plus } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  onAddTime?: () => void;
}

export function TimeInput({ value, onChange, placeholder = "Enter duration", label = "Duration", onAddTime }: TimeInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('minutes');
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse existing value to extract number and unit
  const parseValue = (val: string) => {
    if (!val) return { number: '', unit: 'minutes' };
    const match = val.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const [, number, unit] = match;
      const normalizedUnit = unit.toLowerCase().replace(/s$/, ''); // Remove plural 's'
      const validUnits = ['minute', 'hour', 'day', 'week', 'month'];
      const foundUnit = validUnits.find(u => normalizedUnit.includes(u));
      return { 
        number, 
        unit: foundUnit ? (foundUnit === 'minute' ? 'minutes' : foundUnit + 's') : 'minutes' 
      };
    }
    return { number: val, unit: 'minutes' };
  };



  const handleAddTime = () => {
    if (inputValue && selectedUnit) {
      onChange(`${inputValue} ${selectedUnit}`);
      setInputValue('');
    }
  };

  const handleNumberChange = (newNumber: string) => {
    setInputValue(newNumber);
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
  };

  const handleEdit = () => {
    // onChange(''); // Clear the current value
    // setInputValue(''); // Clear the input field
    // setSelectedUnit('minutes'); // Reset to default unit
    // Focus the input field after a short delay to ensure DOM is updated
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
        <Clock size={16} className="text-gray-500" />
        <span>{label}</span>
      </label>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder="1"
            min="0"
            step="0.5"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <select
            value={selectedUnit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white min-w-[120px]"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
          <button
            onClick={handleAddTime}
            disabled={!inputValue}
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Time</span>
          </button>
        </div>
        {value && (
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between">
            <span>Current: {value}</span>
            {/* <button 
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}