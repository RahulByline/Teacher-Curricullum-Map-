import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Search, X, BookOpen } from 'lucide-react';
import { Standard, StandardCode } from '../types/curriculum';

interface StandardsSelectorProps {
  standards: Standard[];
  selectedCodes: string[];
  onSelectionChange: (codes: string[]) => void;
  label?: string;
}

export function StandardsSelector({ 
  standards, 
  selectedCodes, 
  onSelectionChange, 
  label = "Standards Mapping" 
}: StandardsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(new Set());

  const toggleStandard = (standardId: string) => {
    const newExpanded = new Set(expandedStandards);
    if (newExpanded.has(standardId)) {
      newExpanded.delete(standardId);
    } else {
      newExpanded.add(standardId);
    }
    setExpandedStandards(newExpanded);
  };

  const toggleCode = (codeId: string) => {
    const newSelection = selectedCodes.includes(codeId)
      ? selectedCodes.filter(id => id !== codeId)
      : [...selectedCodes, codeId];
    onSelectionChange(newSelection);
  };

  const getSelectedCodesInfo = () => {
    const selectedCodesData: StandardCode[] = [];
    standards.forEach(standard => {
      standard.codes.forEach(code => {
        if (selectedCodes.includes(code.id)) {
          selectedCodesData.push(code);
        }
      });
    });
    return selectedCodesData;
  };

  const filteredStandards = standards.map(standard => ({
    ...standard,
    codes: standard.codes.filter(code => 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(standard => standard.codes.length > 0 || searchTerm === '');

  const selectedCodesInfo = getSelectedCodesInfo();

  if (standards.length === 0) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center space-x-2 text-amber-800">
          <BookOpen size={16} />
          <span className="text-sm font-medium">No Standards Available</span>
        </div>
        <p className="text-xs text-amber-700 mt-1">
          Add standards to this curriculum to enable mapping
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected Standards Display */}
      {selectedCodesInfo.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Selected Standards ({selectedCodesInfo.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selectedCodesInfo.map(code => (
              <div
                key={code.id}
                className="flex items-center space-x-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs"
              >
                <span className="font-medium">{code.code}</span>
                <button
                  onClick={() => toggleCode(code.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white hover:bg-gray-50"
      >
        <span className="text-gray-700">
          {selectedCodesInfo.length > 0 
            ? `${selectedCodesInfo.length} standards selected`
            : 'Select standards to map'
          }
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="border border-gray-300 rounded-lg bg-white shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search standards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Standards List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredStandards.map(standard => (
              <div key={standard.id} className="border-b border-gray-100 last:border-b-0">
                {/* Standard Header */}
                <button
                  onClick={() => toggleStandard(standard.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedStandards.has(standard.id) ? 
                      <ChevronDown size={16} className="text-gray-500" /> : 
                      <ChevronRight size={16} className="text-gray-500" />
                    }
                    <div className="text-left">
                      <h4 className="font-medium text-gray-800">{standard.name}</h4>
                      {standard.description && (
                        <p className="text-xs text-gray-600">{standard.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {standard.codes.length} codes
                  </span>
                </button>

                {/* Standard Codes */}
                {expandedStandards.has(standard.id) && (
                  <div className="bg-gray-50">
                    {standard.codes.map(code => (
                      <div
                        key={code.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-100 transition-colors border-t border-gray-200"
                      >
                        <button
                          onClick={() => toggleCode(code.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedCodes.includes(code.id)
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          {selectedCodes.includes(code.id) && <Check size={12} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm text-gray-800">{code.code}</span>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              {code.level}
                            </span>
                          </div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1">{code.title}</h5>
                          <p className="text-xs text-gray-600 leading-relaxed">{code.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredStandards.length === 0 && searchTerm && (
              <div className="p-6 text-center text-gray-500">
                <Search size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No standards found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}