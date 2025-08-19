import React from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function TimeInput({ value, onChange, placeholder = "Enter duration", label = "Duration" }: TimeInputProps) {
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

  const { number, unit } = parseValue(value);

  const handleNumberChange = (newNumber: string) => {
    if (newNumber && unit) {
      onChange(`${newNumber} ${unit}`);
    } else {
      onChange(newNumber);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (number && newUnit) {
      onChange(`${number} ${newUnit}`);
    } else if (newUnit) {
      onChange(`1 ${newUnit}`);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
        <Clock size={16} className="text-gray-500" />
        <span>{label}</span>
      </label>
      <div className="flex space-x-2">
        <input
          type="number"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="1"
          min="0"
          step="0.5"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
        <select
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white min-w-[120px]"
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>
    </div>
  );
}