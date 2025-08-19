import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Palette, Save, X, Target, Eye, Hand, Brain, Users, Zap, BookOpen, Code, Play, CheckCircle } from 'lucide-react';
import { ActivityType } from '../types/curriculum';

interface ActivityTypesManagerProps {
  activityTypes: ActivityType[];
  onAddActivityType: (name: string, description?: string, color?: string, icon?: string) => void;
  onUpdateActivityType: (activityTypeId: string, updates: Partial<ActivityType>) => void;
  onDeleteActivityType: (activityTypeId: string) => void;
}

const availableIcons = [
  { name: 'Target', component: Target },
  { name: 'Eye', component: Eye },
  { name: 'Hand', component: Hand },
  { name: 'Brain', component: Brain },
  { name: 'Users', component: Users },
  { name: 'Zap', component: Zap },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Code', component: Code },
  { name: 'Play', component: Play },
  { name: 'CheckCircle', component: CheckCircle }
];

const availableColors = [
  { name: 'Pink', value: 'bg-pink-100 text-pink-800' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { name: 'Green', value: 'bg-green-100 text-green-800' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-800' },
  { name: 'Red', value: 'bg-red-100 text-red-800' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
  { name: 'Indigo', value: 'bg-indigo-100 text-indigo-800' },
  { name: 'Emerald', value: 'bg-emerald-100 text-emerald-800' },
  { name: 'Cyan', value: 'bg-cyan-100 text-cyan-800' }
];

export function ActivityTypesManager({
  activityTypes,
  onAddActivityType,
  onUpdateActivityType,
  onDeleteActivityType
}: ActivityTypesManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [newType, setNewType] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Target'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.component : Target;
  };

  const handleAddType = () => {
    if (newType.name.trim()) {
      onAddActivityType(
        newType.name.trim(),
        newType.description.trim() || undefined,
        newType.color,
        newType.icon
      );
      setNewType({ name: '', description: '', color: 'bg-blue-100 text-blue-800', icon: 'Target' });
      setShowAddForm(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDeleteActivityType(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
            <Palette size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Activity Types Management</h3>
            <p className="text-sm text-gray-600">Create and manage custom activity types for your curriculum</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Activity Type</span>
        </button>
      </div>

      {/* Add Activity Type Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Add New Activity Type</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type Name *</label>
              <input
                type="text"
                value={newType.name}
                onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Creative Writing, Science Experiment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newType.description}
                onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this activity type..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewType(prev => ({ ...prev, color: color.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newType.color === color.value 
                          ? 'border-pink-500 ring-2 ring-pink-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${color.value}`}
                      title={color.name}
                    >
                      <div className="w-4 h-4 rounded-full bg-current opacity-60 mx-auto"></div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableIcons.map(icon => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => setNewType(prev => ({ ...prev, icon: icon.name }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newType.icon === icon.name 
                            ? 'border-pink-500 ring-2 ring-pink-200 bg-pink-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        title={icon.name}
                      >
                        <IconComponent size={16} className="mx-auto text-gray-600" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-2 rounded-lg text-sm font-medium ${newType.color} flex items-center space-x-2`}>
                  {React.createElement(getIconComponent(newType.icon), { size: 14 })}
                  <span>{newType.name || 'Activity Type'}</span>
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddType}
                disabled={!newType.name.trim()}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Activity Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Types List */}
      <div className="space-y-4">
        {activityTypes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Palette size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No activity types created yet</p>
            <p className="text-gray-400 text-sm">Add your first custom activity type to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activityTypes.map(activityType => {
              const IconComponent = getIconComponent(activityType.icon);
              return (
                <div key={activityType.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${activityType.color}`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        {editingType === activityType.id ? (
                          <input
                            type="text"
                            defaultValue={activityType.name}
                            onBlur={(e) => {
                              if (e.target.value.trim() !== activityType.name) {
                                onUpdateActivityType(activityType.id, { name: e.target.value.trim() });
                              }
                              setEditingType(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              } else if (e.key === 'Escape') {
                                setEditingType(null);
                              }
                            }}
                            className="font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1"
                            autoFocus
                          />
                        ) : (
                          <h4 className="font-semibold text-gray-800">{activityType.name}</h4>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingType(activityType.id)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: activityType.id, name: activityType.name })}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {activityType.description && (
                    <p className="text-sm text-gray-600 mb-4">{activityType.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${activityType.color}`}>
                      Activity Type
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
              Are you sure you want to delete the activity type "{deleteConfirm.name}"? 
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
                Delete Activity Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}