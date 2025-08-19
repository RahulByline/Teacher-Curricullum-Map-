import React, { useState } from 'react';
import { Plus, X, Target } from 'lucide-react';

interface LearningObjectivesEditorProps {
  objectives: string[];
  onUpdate: (objectives: string[]) => void;
}

export function LearningObjectivesEditor({ objectives, onUpdate }: LearningObjectivesEditorProps) {
  const [newObjective, setNewObjective] = useState('');

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
        <Target size={16} className="text-indigo-500" />
        <span>Learning Objectives</span>
      </h4>
      {objectives.map((objective, index) => (
        <div key={index} className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100">
          <span className="text-sm text-gray-700 flex-1">{objective}</span>
          <button
            onClick={() => {
              const newObjectives = objectives.filter((_, i) => i !== index);
              onUpdate(newObjectives);
            }}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-colors ml-2"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex space-x-3">
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          placeholder="Add learning objective..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => {
            if (newObjective.trim()) {
              onUpdate([...objectives, newObjective.trim()]);
              setNewObjective('');
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}