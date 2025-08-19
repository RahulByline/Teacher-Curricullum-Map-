import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Code, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Standard, StandardCode } from '../types/curriculum';

interface StandardsManagerProps {
  standards: Standard[];
  onAddStandard: (name: string, description?: string) => void;
  onUpdateStandard: (standardId: string, updates: Partial<Standard>) => void;
  onDeleteStandard: (standardId: string) => void;
  onAddStandardCode: (standardId: string, code: Omit<StandardCode, 'id'>) => void;
  onUpdateStandardCode: (standardId: string, codeId: string, updates: Partial<StandardCode>) => void;
  onDeleteStandardCode: (standardId: string, codeId: string) => void;
}

export function StandardsManager({
  standards,
  onAddStandard,
  onUpdateStandard,
  onDeleteStandard,
  onAddStandardCode,
  onUpdateStandardCode,
  onDeleteStandardCode
}: StandardsManagerProps) {
  const [showAddStandard, setShowAddStandard] = useState(false);
  const [newStandard, setNewStandard] = useState({ name: '', description: '' });
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(new Set());
  const [editingStandard, setEditingStandard] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [showAddCode, setShowAddCode] = useState<string | null>(null);
  const [newCode, setNewCode] = useState({ code: '', title: '', description: '', level: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'standard' | 'code'; id: string; name: string; standardId?: string } | null>(null);

  const toggleStandard = (standardId: string) => {
    const newExpanded = new Set(expandedStandards);
    if (newExpanded.has(standardId)) {
      newExpanded.delete(standardId);
    } else {
      newExpanded.add(standardId);
    }
    setExpandedStandards(newExpanded);
  };

  const handleAddStandard = () => {
    if (newStandard.name.trim()) {
      onAddStandard(newStandard.name.trim(), newStandard.description.trim() || undefined);
      setNewStandard({ name: '', description: '' });
      setShowAddStandard(false);
    }
  };

  const handleAddCode = (standardId: string) => {
    if (newCode.code.trim() && newCode.title.trim()) {
      onAddStandardCode(standardId, {
        code: newCode.code.trim(),
        title: newCode.title.trim(),
        description: newCode.description.trim(),
        level: newCode.level.trim()
      });
      setNewCode({ code: '', title: '', description: '', level: '' });
      setShowAddCode(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      if (deleteConfirm.type === 'standard') {
        onDeleteStandard(deleteConfirm.id);
      } else if (deleteConfirm.type === 'code' && deleteConfirm.standardId) {
        onDeleteStandardCode(deleteConfirm.standardId, deleteConfirm.id);
      }
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Standards Management</h3>
            <p className="text-sm text-gray-600">Manage educational standards and their codes</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddStandard(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Standard</span>
        </button>
      </div>

      {/* Add Standard Form */}
      {showAddStandard && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Add New Standard</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standard Name *</label>
              <input
                type="text"
                value={newStandard.name}
                onChange={(e) => setNewStandard(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., ISTE Standards"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newStandard.description}
                onChange={(e) => setNewStandard(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the standard..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddStandard(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStandard}
                disabled={!newStandard.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Standard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standards List */}
      <div className="space-y-4">
        {standards.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No standards added yet</p>
            <p className="text-gray-400 text-sm">Add your first educational standard to get started</p>
          </div>
        ) : (
          standards.map(standard => (
            <div key={standard.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Standard Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleStandard(standard.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    >
                      {expandedStandards.has(standard.id) ? 
                        <ChevronDown size={20} className="text-gray-600" /> : 
                        <ChevronRight size={20} className="text-gray-600" />
                      }
                    </button>
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div>
                      {editingStandard === standard.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            defaultValue={standard.name}
                            onBlur={(e) => {
                              if (e.target.value.trim() !== standard.name) {
                                onUpdateStandard(standard.id, { name: e.target.value.trim() });
                              }
                              setEditingStandard(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              } else if (e.key === 'Escape') {
                                setEditingStandard(null);
                              }
                            }}
                            className="text-xl font-bold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-gray-800">{standard.name}</h3>
                          {standard.description && (
                            <p className="text-sm text-gray-600 mt-1">{standard.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 bg-white bg-opacity-70 px-3 py-1 rounded-full">
                      {standard.codes.length} codes
                    </span>
                    <button
                      onClick={() => setEditingStandard(standard.id)}
                      className="p-2 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'standard', id: standard.id, name: standard.name })}
                      className="p-2 text-red-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Standard Codes */}
              {expandedStandards.has(standard.id) && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Standard Codes</h4>
                    <button
                      onClick={() => setShowAddCode(standard.id)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Plus size={14} />
                      <span>Add Code</span>
                    </button>
                  </div>

                  {/* Add Code Form */}
                  {showAddCode === standard.id && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                          <input
                            type="text"
                            value={newCode.code}
                            onChange={(e) => setNewCode(prev => ({ ...prev, code: e.target.value }))}
                            placeholder="e.g., 1.1.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                          <input
                            type="text"
                            value={newCode.level}
                            onChange={(e) => setNewCode(prev => ({ ...prev, level: e.target.value }))}
                            placeholder="e.g., K-2, 3-5, 6-8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <input
                            type="text"
                            value={newCode.title}
                            onChange={(e) => setNewCode(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Brief title of the standard code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={newCode.description}
                            onChange={(e) => setNewCode(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Detailed description of the standard code"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => setShowAddCode(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddCode(standard.id)}
                          disabled={!newCode.code.trim() || !newCode.title.trim()}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Add Code
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Codes List */}
                  <div className="space-y-3">
                    {standard.codes.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Code size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No codes added yet</p>
                        <p className="text-gray-400 text-sm">Add standard codes to enable mapping</p>
                      </div>
                    ) : (
                      standard.codes.map(code => (
                        <div key={code.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-mono font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                  {code.code}
                                </span>
                                {code.level && (
                                  <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                    {code.level}
                                  </span>
                                )}
                              </div>
                              {editingCode === code.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    defaultValue={code.title}
                                    onBlur={(e) => {
                                      if (e.target.value.trim() !== code.title) {
                                        onUpdateStandardCode(standard.id, code.id, { title: e.target.value.trim() });
                                      }
                                      setEditingCode(null);
                                    }}
                                    className="w-full font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <>
                                  <h5 className="font-semibold text-gray-800 mb-1">{code.title}</h5>
                                  <p className="text-sm text-gray-600 leading-relaxed">{code.description}</p>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setEditingCode(code.id)}
                                className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ 
                                  type: 'code', 
                                  id: code.id, 
                                  name: code.code, 
                                  standardId: standard.id 
                                })}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {deleteConfirm.type} "{deleteConfirm.name}"? 
              {deleteConfirm.type === 'standard' && ' This will also delete all associated codes.'}
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete {deleteConfirm.type === 'standard' ? 'Standard' : 'Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}