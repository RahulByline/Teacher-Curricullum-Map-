import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, BookOpen, GraduationCap, FileText, Play, Target, Clock, Users, Zap, CheckCircle, Settings, BarChart3, Share2, Eye, Grid3X3, Map, X, Palette, ArrowLeft, Upload } from 'lucide-react';
import { Curriculum, Grade, Book, Unit, Lesson, Stage, Activity, Standard, StandardCode, ActivityType } from '../types/curriculum';
import { LearningObjectivesEditor } from './LearningObjectivesEditor';
import { TimeInput } from './TimeInput';
import { StandardsManager } from './StandardsManager';
import { StandardsSelector } from './StandardsSelector';
import { StandardsReport } from './StandardsReport';
import { ShareableLinks } from './ShareableLinks';
import { CurriculumMindmap } from './CurriculumMindmap';
import { CurriculumGridView } from './CurriculumGridView';
import { ISTEStandardsApp } from './ISTEStandardsApp';
import { ActivityTypesManager } from './ActivityTypesManager';
import { LogoUploader } from './LogoUploader';
import { UploadCurriculum } from './UploadCurriculum';
import { useSettings } from '../hooks/useSettings';

interface ContentEditorProps {
  selectedPath: string[];
  curriculums: Curriculum[];
  onSelectPath: (path: string[]) => void;
  onAddCurriculum: (name: string, description?: string) => Promise<string | undefined>;
  onUpdateCurriculum: (curriculumId: string, updates: Partial<Curriculum>) => void;
  onDeleteCurriculum: (curriculumId: string) => void;
  onAddGrade: (curriculumId: string, name: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateGrade: (curriculumId: string, gradeId: string, updates: Partial<Grade>) => void;
  onDeleteGrade: (curriculumId: string, gradeId: string) => void;
  onAddBook: (curriculumId: string, gradeId: string, name: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateBook: (curriculumId: string, gradeId: string, bookId: string, updates: Partial<Book>) => void;
  onDeleteBook: (curriculumId: string, gradeId: string, bookId: string) => void;
  onAddUnit: (curriculumId: string, gradeId: string, bookId: string, name: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateUnit: (curriculumId: string, gradeId: string, bookId: string, unitId: string, updates: Partial<Unit>) => void;
  onDeleteUnit: (curriculumId: string, gradeId: string, bookId: string, unitId: string) => void;
  onAddLesson: (curriculumId: string, gradeId: string, bookId: string, unitId: string, name: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateLesson: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, updates: Partial<Lesson>) => void;
  onDeleteLesson: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string) => void;
  onAddStage: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, name: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateStage: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, updates: Partial<Stage>) => void;
  onDeleteStage: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string) => void;
  onAddActivity: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, name: string, type: string, learningObjectives?: string[], duration?: string) => void;
  onUpdateActivity: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string, updates: Partial<Activity>) => void;
  onDeleteActivity: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string) => void;
  onAddStandard: (curriculumId: string, name: string, description?: string) => void;
  onUpdateStandard: (curriculumId: string, standardId: string, updates: Partial<Standard>) => void;
  onDeleteStandard: (curriculumId: string, standardId: string) => void;
  onAddStandardCode: (curriculumId: string, standardId: string, code: Omit<StandardCode, 'id'>) => void;
  onUpdateStandardCode: (curriculumId: string, standardId: string, codeId: string, updates: Partial<StandardCode>) => void;
  onDeleteStandardCode: (curriculumId: string, standardId: string, codeId: string) => void;
  onAddActivityType: (curriculumId: string, name: string, description?: string, color?: string, icon?: string) => void;
  onUpdateActivityType: (curriculumId: string, activityTypeId: string, updates: Partial<ActivityType>) => void;
  onDeleteActivityType: (curriculumId: string, activityTypeId: string) => void;
}

export function ContentEditor({
  selectedPath,
  curriculums,
  onSelectPath,
  onAddCurriculum,
  onUpdateCurriculum,
  onDeleteCurriculum,
  onAddGrade,
  onUpdateGrade,
  onDeleteGrade,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onAddStage,
  onUpdateStage,
  onDeleteStage,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onAddStandard,
  onUpdateStandard,
  onDeleteStandard,
  onAddStandardCode,
  onUpdateStandardCode,
  onDeleteStandardCode,
  onAddActivityType,
  onUpdateActivityType,
  onDeleteActivityType,
}: ContentEditorProps) {
  const [showAddCurriculumModal, setShowAddCurriculumModal] = useState(false);
  const [newCurriculumName, setNewCurriculumName] = useState('');
  const [newCurriculumDescription, setNewCurriculumDescription] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState<{ type: string; parentId?: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newItemDuration, setNewItemDuration] = useState('1');
  const [newItemLearningObjectives, setNewItemLearningObjectives] = useState<string[]>([]);
  const [newItemLearningObjective, setNewItemLearningObjective] = useState('');
  const [activityAddedMessage, setActivityAddedMessage] = useState('');
  const [viewMode, setViewMode] = useState<'overview' | 'mindmap' | 'grid'>('overview');
  const [showISTEApp, setShowISTEApp] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddStage, setShowAddStage] = useState(false);
  const [newStage, setNewStage] = useState<{ name: string; learningObjectives: string[]; duration: string }>({ 
    name: '', 
    learningObjectives: [], 
    duration: '' 
  });
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ name: '', type: '', duration: '', learningObjectives: [] as string[] });
  const [showActivityTypesManager, setShowActivityTypesManager] = useState(false);
  const [newGradeLearningObjective, setNewGradeLearningObjective] = useState('');
  const [newBookLearningObjective, setNewBookLearningObjective] = useState('');
  
  // Debounced time input states
  const [gradeTimeInput, setGradeTimeInput] = useState('');
  const [bookTimeInput, setBookTimeInput] = useState('');
  const [unitTimeInput, setUnitTimeInput] = useState('');
  const [lessonTimeInput, setLessonTimeInput] = useState('');
  const [stageTimeInput, setStageTimeInput] = useState('');
  const [activityTimeInput, setActivityTimeInput] = useState('');
  const gradeTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bookTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unitTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lessonTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stageTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { settings, updateSettings } = useSettings();

  // Cleanup timeouts on unmount or path change
  useEffect(() => {
    // Clear input states when path changes
    setGradeTimeInput('');
    setBookTimeInput('');
    setUnitTimeInput('');
    setLessonTimeInput('');
    setStageTimeInput('');
    setActivityTimeInput('');
    
    // Clear existing timeouts
    if (gradeTimeTimeoutRef.current) {
      clearTimeout(gradeTimeTimeoutRef.current);
    }
    if (bookTimeTimeoutRef.current) {
      clearTimeout(bookTimeTimeoutRef.current);
    }
    if (unitTimeTimeoutRef.current) {
      clearTimeout(unitTimeTimeoutRef.current);
    }
    if (lessonTimeTimeoutRef.current) {
      clearTimeout(lessonTimeTimeoutRef.current);
    }
    if (stageTimeTimeoutRef.current) {
      clearTimeout(stageTimeTimeoutRef.current);
    }
    if (activityTimeTimeoutRef.current) {
      clearTimeout(activityTimeTimeoutRef.current);
    }
    
    return () => {
      if (gradeTimeTimeoutRef.current) {
        clearTimeout(gradeTimeTimeoutRef.current);
      }
      if (bookTimeTimeoutRef.current) {
        clearTimeout(bookTimeTimeoutRef.current);
      }
      if (unitTimeTimeoutRef.current) {
        clearTimeout(unitTimeTimeoutRef.current);
      }
      if (lessonTimeTimeoutRef.current) {
        clearTimeout(lessonTimeTimeoutRef.current);
      }
      if (stageTimeTimeoutRef.current) {
        clearTimeout(stageTimeTimeoutRef.current);
      }
      if (activityTimeTimeoutRef.current) {
        clearTimeout(activityTimeTimeoutRef.current);
      }
    };
  }, [selectedPath]);

  const handleAddCurriculum = async () => {
    if (newCurriculumName.trim()) {
      const newId = await onAddCurriculum(
        newCurriculumName.trim(), 
        newCurriculumDescription.trim() || undefined
      );
      if (newId) {
        onSelectPath(['curriculum', newId]);
      }
      setNewCurriculumName('');
      setNewCurriculumDescription('');
      setShowAddCurriculumModal(false);
    }
  };

  const startEditing = (type: string, id: string, field: string, currentValue: string) => {
    setEditingItem({ type, id, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingItem) return;

    const { type, id, field } = editingItem;
    const updates = { [field]: editValue };

    // Find the item and call the appropriate update function
    const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId, , stageId] = selectedPath;

    switch (type) {
      case 'curriculum':
        onUpdateCurriculum(id, updates);
        break;
      case 'grade':
        onUpdateGrade(curriculumId, id, updates);
        break;
      case 'book':
        onUpdateBook(curriculumId, gradeId, id, updates);
        break;
      case 'unit':
        onUpdateUnit(curriculumId, gradeId, bookId, id, updates);
        break;
      case 'lesson':
        onUpdateLesson(curriculumId, gradeId, bookId, unitId, id, updates);
        break;
      case 'stage':
        onUpdateStage(curriculumId, gradeId, bookId, unitId, lessonId, id, updates);
        break;
      case 'activity':
        onUpdateActivity(curriculumId, gradeId, bookId, unitId, lessonId, stageId, id, updates);
        break;
    }

    setEditingItem(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;

    const { type, id } = deleteConfirm;
    const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId, , stageId] = selectedPath;

    switch (type) {
      case 'curriculum':
        onDeleteCurriculum(id);
        onSelectPath([]);
        break;
      case 'grade':
        onDeleteGrade(curriculumId, id);
        onSelectPath(['curriculum', curriculumId]);
        break;
      case 'book':
        onDeleteBook(curriculumId, gradeId, id);
        onSelectPath(['curriculum', curriculumId, 'grade', gradeId]);
        break;
      case 'unit':
        onDeleteUnit(curriculumId, gradeId, bookId, id);
        onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId]);
        break;
      case 'lesson':
        onDeleteLesson(curriculumId, gradeId, bookId, unitId, id);
        onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unitId]);
        break;
      case 'stage':
        onDeleteStage(curriculumId, gradeId, bookId, unitId, lessonId, id);
        onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unitId, 'lesson', lessonId]);
        break;
      case 'activity':
        onDeleteActivity(curriculumId, gradeId, bookId, unitId, lessonId, stageId, id);
        onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unitId, 'lesson', lessonId]);
        break;
    }

    setDeleteConfirm(null);
  };

  const handleAdd = () => {
    if (!showAddModal || !newItemName.trim()) return;

    const { type, parentId } = showAddModal;
    const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId, , stageId] = selectedPath;

    // Debug logging
    console.log('Adding item:', type);
    console.log('Selected path:', selectedPath);
    console.log('Curriculum ID:', curriculumId);

    switch (type) {
      case 'grade':
        // Make sure we have a valid curriculum ID
        if (!curriculumId) {
          console.error('No curriculum ID found in selectedPath');
          return;
        }
        onAddGrade(curriculumId, newItemName.trim(), newItemLearningObjectives, newItemDuration);
        break;
      case 'book':
        onAddBook(curriculumId, gradeId, newItemName.trim(), newItemLearningObjectives, newItemDuration);
        break;
      case 'unit':
        onAddUnit(curriculumId, gradeId, bookId, newItemName.trim(), newItemLearningObjectives, newItemDuration);
        break;
      case 'lesson':
        onAddLesson(curriculumId, gradeId, bookId, unitId, newItemName.trim(), newItemLearningObjectives, newItemDuration);
        break;
      case 'stage':
        onAddStage(curriculumId, gradeId, bookId, unitId, lessonId, newItemName.trim(), newItemLearningObjectives, newItemDuration);
        break;
      case 'activity':
        const targetStageId = showAddModal.parentId || stageId;
        onAddActivity(curriculumId, gradeId, bookId, unitId, lessonId, targetStageId, newItemName.trim(), newItemType.trim(), newItemLearningObjectives, newItemDuration);
        // For activities, don't close the modal - allow adding multiple activities
        setActivityAddedMessage(`Activity "${newItemName.trim()}" added successfully!`);
        setNewItemName('');
        setNewItemType('');
        setNewItemDuration('1');
        setNewItemLearningObjectives([]);
        setNewItemLearningObjective('');
        // Clear the success message after 3 seconds
        setTimeout(() => setActivityAddedMessage(''), 3000);
        return; // Don't close modal for activities
    }

    setShowAddModal(null);
    setNewItemName('');
    setNewItemType('');
    setNewItemDuration('1');
    setNewItemLearningObjectives([]);
    setNewItemLearningObjective('');
  };

  const handleAddLearningObjective = () => {
    if (newItemLearningObjective.trim()) {
      setNewItemLearningObjectives(prev => [...prev, newItemLearningObjective.trim()]);
      setNewItemLearningObjective('');
    }
  };

  const handleRemoveLearningObjective = (index: number) => {
    setNewItemLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };



  // Breadcrumb navigation helper
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    if (selectedPath.length >= 2) {
      const curriculum = curriculums.find(c => c.id === selectedPath[1]);
      if (curriculum) {
        breadcrumbs.push({ name: curriculum.name, path: ['curriculum', curriculum.id] });
      }
    }
    
    if (selectedPath.length >= 4) {
      const curriculum = curriculums.find(c => c.id === selectedPath[1]);
      const grade = curriculum?.grades.find(g => g.id === selectedPath[3]);
      if (grade) {
        breadcrumbs.push({ name: grade.name, path: ['curriculum', selectedPath[1], 'grade', grade.id] });
      }
    }
    
    if (selectedPath.length >= 6) {
      const curriculum = curriculums.find(c => c.id === selectedPath[1]);
      const grade = curriculum?.grades.find(g => g.id === selectedPath[3]);
      const book = grade?.books.find(b => b.id === selectedPath[5]);
      if (book) {
        breadcrumbs.push({ name: book.name, path: ['curriculum', selectedPath[1], 'grade', selectedPath[3], 'book', book.id] });
      }
    }
    
    if (selectedPath.length >= 8) {
      const curriculum = curriculums.find(c => c.id === selectedPath[1]);
      const grade = curriculum?.grades.find(g => g.id === selectedPath[3]);
      const book = grade?.books.find(b => b.id === selectedPath[5]);
      const unit = book?.units.find(u => u.id === selectedPath[7]);
      if (unit) {
        breadcrumbs.push({ name: unit.name, path: ['curriculum', selectedPath[1], 'grade', selectedPath[3], 'book', selectedPath[5], 'unit', unit.id] });
      }
    }
    
    if (selectedPath.length >= 10) {
      const curriculum = curriculums.find(c => c.id === selectedPath[1]);
      const grade = curriculum?.grades.find(g => g.id === selectedPath[3]);
      const book = grade?.books.find(b => b.id === selectedPath[5]);
      const unit = book?.units.find(u => u.id === selectedPath[7]);
      const lesson = unit?.lessons.find(l => l.id === selectedPath[9]);
      if (lesson) {
        breadcrumbs.push({ name: lesson.name, path: ['curriculum', selectedPath[1], 'grade', selectedPath[3], 'book', selectedPath[5], 'unit', selectedPath[7], 'lesson', lesson.id] });
      }
    }
    
    return breadcrumbs;
  };

  const handleBackNavigation = () => {
    const breadcrumbs = getBreadcrumbs();
    if (breadcrumbs.length > 1) {
      // Go back to the previous level
      const previousPath = breadcrumbs[breadcrumbs.length - 2].path;
      onSelectPath(previousPath);
    } else if (breadcrumbs.length === 1) {
      // Go back to home
      onSelectPath([]);
    }
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = getBreadcrumbs();
    if (breadcrumbs.length === 0) return null;

    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400">/</span>}
            <button
              onClick={() => onSelectPath(breadcrumb.path)}
              className="hover:text-gray-800 hover:underline transition-colors"
            >
              {breadcrumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const handleAddStage = () => {
          if (newStage.name && selectedPath.length >= 10) {
        const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId] = selectedPath;
        onAddStage(curriculumId, gradeId, bookId, unitId, lessonId, newStage.name as 'Play' | 'Lead' | 'Apply' | 'Yield', newStage.learningObjectives, newStage.duration);
        setNewStage({ name: '', learningObjectives: [], duration: '' });
        setShowAddStage(false);
      }
  };

  const handleAddActivity = (stageId: string) => {
    if (newActivity.name.trim() && newActivity.type.trim() && selectedPath.length >= 10) {
      const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId] = selectedPath;
      onAddActivity(curriculumId, gradeId, bookId, unitId, lessonId, stageId, newActivity.name.trim(), newActivity.type.trim());
      
      // Update the activity with additional details
      const curriculum = curriculums.find(c => c.id === curriculumId);
      if (curriculum) {
        const grade = curriculum.grades.find(g => g.id === gradeId);
        if (grade) {
          const book = grade.books.find(b => b.id === bookId);
          if (book) {
            const unit = book.units.find(u => u.id === unitId);
            if (unit) {
              const lesson = unit.lessons.find(l => l.id === lessonId);
              if (lesson) {
                const stage = lesson.stages.find(s => s.id === stageId);
                if (stage && stage.activities.length > 0) {
                  const newActivityId = stage.activities[stage.activities.length - 1].id;
                  onUpdateActivity(curriculumId, gradeId, bookId, unitId, lessonId, stageId, newActivityId, {
                    duration: newActivity.duration,
                    learningObjectives: newActivity.learningObjectives
                  });
                }
              }
            }
          }
        }
      }
    }
    setShowAddActivity(null);
    setNewActivity({ name: '', type: '', duration: '', learningObjectives: [] });
  };

  const renderEditableField = (type: string, id: string, field: string, value: string, className: string = '') => {
    const isEditing = editingItem?.type === type && editingItem?.id === id && editingItem?.field === field;
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          className="px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          autoFocus
        />
      );
    }

    return (
      <span
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors ${className}`}
        onDoubleClick={() => startEditing(type, id, field, value)}
        title="Double-click to edit"
      >
        {value || 'Untitled'}
      </span>
    );
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName) {
      case 'Play': return <Zap size={16} className="text-pink-600" />;
      case 'Lead': return <Users size={16} className="text-blue-600" />;
      case 'Apply': return <Target size={16} className="text-green-600" />;
      case 'Yield': return <CheckCircle size={16} className="text-yellow-600" />;
      default: return <Target size={16} className="text-gray-600" />;
    }
  };

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case 'Play': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'Lead': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Apply': return 'bg-green-100 border-green-300 text-green-800';
      case 'Yield': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Get current curriculum for standards
  const getCurrentCurriculum = (): Curriculum | null => {
    if (selectedPath.length >= 2 && selectedPath[0] === 'curriculum') {
      return curriculums.find(c => c.id === selectedPath[1]) || null;
    }
    return null;
  };

  const currentCurriculum = getCurrentCurriculum();

  // Render main content based on selected path
  const renderMainContent = () => {
    // Home view
    if (selectedPath.length === 0) {
      return (
        <div className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {settings.portalLogo ? (
                <img src={settings.portalLogo} alt="Portal Logo" className="w-12 h-12 object-contain" />
              ) : (
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Target size={24} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{settings.portalName}</h1>
                <p className="text-gray-600">Comprehensive curriculum management system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'mindmap' ? 'overview' : 'mindmap')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'mindmap' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map size={18} />
                <span>Mindmap</span>
              </button>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'overview' : 'grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3X3 size={18} />
                <span>Grid View</span>
              </button>
              
              <button
                onClick={() => setShowISTEApp(true)}
                className={`px-4 py-3 font-medium transition-colors rounded-lg flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50`}
              >
                <div className="flex items-center space-x-2">
                  <Target size={18} />
                  <span>ISTE Standards App</span>
                </div>
              </button>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>Upload CSV</span>
              </button>
              
              <button
                onClick={() => setShowAddCurriculumModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Curriculum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'mindmap' ? (
          <div className="p-8">
            <CurriculumMindmap 
              curriculums={curriculums} 
              onSelectPath={onSelectPath}
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-8">
            <CurriculumGridView 
              curriculums={curriculums}
              onSelectPath={onSelectPath}
              onUpdateCurriculum={onUpdateCurriculum}
              onUpdateGrade={onUpdateGrade}
              onUpdateBook={onUpdateBook}
              onUpdateUnit={onUpdateUnit}
              onUpdateLesson={onUpdateLesson}
              onUpdateStage={onUpdateStage}
              onUpdateActivity={onUpdateActivity}
            />
          </div>
        ) : (
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{curriculums.length}</p>
                    <p className="text-gray-600 font-medium">Curriculums</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">
                      {curriculums.reduce((sum, curriculum) => sum + curriculum.grades.length, 0)}
                    </p>
                    <p className="text-gray-600 font-medium">Grades</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">
                      {curriculums.reduce((sum, curriculum) => 
                        sum + curriculum.grades.reduce((gradeSum, grade) => 
                          gradeSum + grade.books.reduce((bookSum, book) => bookSum + book.units.length, 0), 0), 0)}
                    </p>
                    <p className="text-gray-600 font-medium">Units</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                    <Play size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">
                      {curriculums.reduce((sum, curriculum) => 
                        sum + curriculum.grades.reduce((gradeSum, grade) => 
                          gradeSum + grade.books.reduce((bookSum, book) => 
                            bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0), 0), 0)}
                    </p>
                    <p className="text-gray-600 font-medium">Lessons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculums.map((curriculum) => (
                <div
                  key={curriculum.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group hover:scale-105"
                  onClick={() => onSelectPath(['curriculum', curriculum.id])}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing('curriculum', curriculum.id, 'name', curriculum.name);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'curriculum', id: curriculum.id, name: curriculum.name });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {renderEditableField('curriculum', curriculum.id, 'name', curriculum.name)}
                  </h3>
                  
                  {curriculum.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{curriculum.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <GraduationCap size={16} className="text-blue-500" />
                      <span className="text-gray-600">{curriculum.grades.length} grades</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-green-500" />
                      <span className="text-gray-600">
                        {curriculum.grades.reduce((sum, grade) => sum + grade.books.length, 0)} books
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-orange-500" />
                      <span className="text-gray-600">
                        {curriculum.grades.reduce((sum, grade) => 
                          sum + grade.books.reduce((bookSum, book) => bookSum + book.units.length, 0), 0)} units
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Play size={16} className="text-purple-500" />
                      <span className="text-gray-600">
                        {curriculum.grades.reduce((sum, grade) => 
                          sum + grade.books.reduce((bookSum, book) => 
                            bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0), 0)} lessons
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {curriculums.length === 0 && (
              <div className="text-center py-16">
                <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Curriculums Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Get started by creating your first curriculum. You can add grades, books, units, and lessons to build a comprehensive educational program.
                </p>
                <button
                  onClick={() => setShowAddCurriculumModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 mx-auto"
                >
                  <Plus size={24} />
                  <span>Create Your First Curriculum</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ISTE Standards App Modal */}
        {showISTEApp && (
          <ISTEStandardsApp 
            curriculums={curriculums}
            onClose={() => setShowISTEApp(false)}
          />
        )}

        {/* Activity Types Manager Modal */}
        {showActivityTypesManager && currentCurriculum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                    <Palette size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Activity Types Manager</h1>
                    <p className="text-gray-600">Manage activity types for {currentCurriculum.name}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowActivityTypesManager(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <ActivityTypesManager
                  activityTypes={currentCurriculum.activityTypes || []}
                  onAddActivityType={(name, description, color, icon) => 
                    onAddActivityType(currentCurriculum.id, name, description, color, icon)
                  }
                  onUpdateActivityType={(activityTypeId, updates) => 
                    onUpdateActivityType(currentCurriculum.id, activityTypeId, updates)
                  }
                  onDeleteActivityType={(activityTypeId) => 
                    onDeleteActivityType(currentCurriculum.id, activityTypeId)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Curriculum Modal */}
        {showAddCurriculumModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Curriculum</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Name *</label>
                  <input
                    type="text"
                    value={newCurriculumName}
                    onChange={(e) => setNewCurriculumName(e.target.value)}
                    placeholder="e.g., Elementary Science Program"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCurriculumDescription}
                    onChange={(e) => setNewCurriculumDescription(e.target.value)}
                    placeholder="Brief description of the curriculum..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowAddCurriculumModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCurriculum}
                  disabled={!newCurriculumName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                >
                  Create Curriculum
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Find current item based on selected path
  const [, curriculumId, , gradeId, , bookId, , unitId, , lessonId, , stageId] = selectedPath;
  const curriculum = curriculums.find(c => c.id === curriculumId);
  const grade = curriculum?.grades.find(g => g.id === gradeId);
  const book = grade?.books.find(b => b.id === bookId);
  const unit = book?.units.find(u => u.id === unitId);
  const lesson = unit?.lessons.find(l => l.id === lessonId);
  const stage = lesson?.stages.find(s => s.id === stageId);

  if (!curriculum) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Curriculum not found</p>
        </div>
      </div>
    );
  }

  // Render tabs for curriculum level
  const renderTabs = () => {
    const tabs = [
      { id: 'overview', label: 'Overview', icon: Eye },
      { id: 'standards', label: 'Standards', icon: Target },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'sharing', label: 'Sharing', icon: Share2 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // Render standards tab content
  const renderStandardsTab = () => {
    if (!currentCurriculum) return null;

    return (
      <StandardsManager
        standards={currentCurriculum.standards || []}
        onAddStandard={(name, description) => onAddStandard(currentCurriculum.id, name, description)}
        onUpdateStandard={(standardId, updates) => onUpdateStandard(currentCurriculum.id, standardId, updates)}
        onDeleteStandard={(standardId) => onDeleteStandard(currentCurriculum.id, standardId)}
        onAddStandardCode={(standardId, code) => onAddStandardCode(currentCurriculum.id, standardId, code)}
        onUpdateStandardCode={(standardId, codeId, updates) => onUpdateStandardCode(currentCurriculum.id, standardId, codeId, updates)}
        onDeleteStandardCode={(standardId, codeId) => onDeleteStandardCode(currentCurriculum.id, standardId, codeId)}
      />
    );
  };

  // Render standards selector for curriculum elements
  const renderStandardsSelector = (elementStandardCodes: string[] = [], onUpdate: (codes: string[]) => void) => {
    if (!currentCurriculum?.standards || currentCurriculum.standards.length === 0) {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <Target size={16} />
            <span className="text-sm font-medium">No Standards Available</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            Add standards to this curriculum first to enable mapping
          </p>
        </div>
      );
    }

    return (
      <StandardsSelector
        standards={currentCurriculum.standards}
        selectedCodes={elementStandardCodes}
        onSelectionChange={onUpdate}
      />
    );
  };

    // Curriculum detail view
    if (selectedPath.length === 2) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <BookOpen size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('curriculum', curriculum.id, 'name', curriculum.name)}
                </h1>
                <p className="text-gray-600 mt-1">{curriculum.description}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Ensure we have a curriculum ID before opening the modal
                  if (curriculum.id) {
                    setShowAddModal({ type: 'grade' });
                  } else {
                    alert('Please select a curriculum first');
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Grade</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          {renderTabs()}

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <GraduationCap size={24} className="text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-800">{curriculum.grades.length}</p>
                      <p className="text-blue-600 text-sm font-medium">Grades</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <BookOpen size={24} className="text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-800">
                        {curriculum.grades.reduce((sum, grade) => sum + grade.books.length, 0)}
                      </p>
                      <p className="text-green-600 text-sm font-medium">Books</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <FileText size={24} className="text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-orange-800">
                        {curriculum.grades.reduce((sum, grade) => 
                          sum + grade.books.reduce((bookSum, book) => bookSum + book.units.length, 0), 0)}
                      </p>
                      <p className="text-orange-600 text-sm font-medium">Units</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <Play size={24} className="text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-800">
                        {curriculum.grades.reduce((sum, grade) => 
                          sum + grade.books.reduce((bookSum, book) => 
                            bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0), 0)}
                      </p>
                      <p className="text-purple-600 text-sm font-medium">Lessons</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grades Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Grades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {curriculum.grades.map((grade) => (
                    <div
                      key={grade.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
                      onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id])}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-200">
                          <GraduationCap size={24} className="text-white" />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing('grade', grade.id, 'name', grade.name);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ type: 'grade', id: grade.id, name: grade.name });
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                        {renderEditableField('grade', grade.id, 'name', grade.name)}
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <BookOpen size={16} className="text-green-500" />
                          <span className="text-gray-600">{grade.books.length} books</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-orange-500" />
                          <span className="text-gray-600">
                            {grade.books.reduce((sum, book) => sum + book.units.length, 0)} units
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Play size={16} className="text-purple-500" />
                          <span className="text-gray-600">
                            {grade.books.reduce((sum, book) => 
                              sum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0)} lessons
                          </span>
                        </div>
                        
                        {/* Duration */}
                        {grade.duration && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Clock size={14} className="text-indigo-500" />
                              <span className="text-xs font-medium text-gray-700">Duration:</span>
                              <span className="text-xs text-gray-600">{grade.duration}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Learning Objectives */}
                        {grade.learningObjectives && grade.learningObjectives.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target size={14} className="text-blue-500" />
                              <span className="text-xs font-medium text-gray-700">Learning Objectives:</span>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {grade.learningObjectives.slice(0, 2).map((objective, idx) => (
                                <li key={idx} className="flex items-start space-x-1">
                                  <span className="text-blue-400 mt-0.5">•</span>
                                  <span className="leading-tight">{objective}</span>
                                </li>
                              ))}
                              {grade.learningObjectives.length > 2 && (
                                <li className="text-gray-400 text-xs">+{grade.learningObjectives.length - 2} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {curriculum.grades.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <GraduationCap size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No grades added yet</p>
                    <p className="text-gray-400 text-sm mb-6">Add your first grade to get started</p>
                    <button
                      onClick={() => setShowAddModal({ type: 'grade' })}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={20} />
                      <span>Add First Grade</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'standards' && renderStandardsTab()}

          {activeTab === 'reports' && (
            <StandardsReport curriculums={curriculums} />
          )}

          {activeTab === 'sharing' && (
            <ShareableLinks 
              curriculumId={curriculum.id}
              curriculumName={curriculum.name}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Portal Settings</h3>
                
                <div className="space-y-6">
                  <LogoUploader
                    currentLogo={settings.portalLogo}
                    onLogoChange={(logoUrl) => updateSettings({ portalLogo: logoUrl })}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portal Name</label>
                    <input
                      type="text"
                      value={settings.portalName}
                      onChange={(e) => updateSettings({ portalName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

    // Grade detail view
    if (selectedPath.length === 4 && grade) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('grade', grade.id, 'name', grade.name)}
                </h1>
                <p className="text-gray-600 mt-1">Grade in {curriculum.name}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal({ type: 'book' })}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Book</span>
              </button>
            </div>
          </div>

          {/* Content Layout - Full Width */}
          <div className="space-y-8">
            {/* Total Time Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock size={14} className="mr-1" />
                Total Time
              </h4>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={gradeTimeInput !== '' ? gradeTimeInput : (grade.duration ? (grade.duration.match(/[\d.]+/)?.[0] || '') : '')}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setGradeTimeInput(inputValue);
                    
                    // Clear existing timeout
                    if (gradeTimeTimeoutRef.current) {
                      clearTimeout(gradeTimeTimeoutRef.current);
                    }
                    
                    // Set new timeout for 2 seconds
                    gradeTimeTimeoutRef.current = setTimeout(() => {
                      const value = parseFloat(inputValue);
                      if (value && !isNaN(value)) {
                        let timeValue = value;
                        let timeUnit = 'Minutes';
                        
                        // Auto-convert to appropriate unit
                        if (value >= 60 && value < 1440) {
                          // Convert to hours if 60+ minutes but less than 24 hours
                          timeValue = Math.round((value / 60) * 10) / 10; // Round to 1 decimal place
                          timeUnit = 'Hours';
                        } else if (value >= 1440 && value < 10080) {
                          // Convert to days if 24+ hours but less than 7 days
                          timeValue = Math.round((value / 1440) * 10) / 10;
                          timeUnit = 'Days';
                        } else if (value >= 10080) {
                          // Convert to weeks if 7+ days
                          timeValue = Math.round((value / 10080) * 10) / 10;
                          timeUnit = 'Weeks';
                        }
                        
                        onUpdateGrade(curriculum.id, grade.id, { 
                          duration: timeValue + ' ' + timeUnit
                        });
                      } else if (inputValue === '') {
                        onUpdateGrade(curriculum.id, grade.id, { 
                          duration: ''
                        });
                      }
                      setGradeTimeInput(''); // Clear the input state after update
                    }, 2000);
                  }}
                  placeholder="0.0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={grade.duration ? (grade.duration.includes('Hours') ? 'Hours' : grade.duration.includes('Days') ? 'Days' : grade.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes'}
                  onChange={(e) => {
                    const currentValue = grade.duration ? parseFloat(grade.duration.match(/[\d.]+/)?.[0] || '0') : 0;
                    const currentUnit = grade.duration ? (grade.duration.includes('Hours') ? 'Hours' : grade.duration.includes('Days') ? 'Days' : grade.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                    const newUnit = e.target.value;
                    
                    // Convert between units
                    let newValue = currentValue;
                    if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                      newValue = Math.round((currentValue / 60) * 10) / 10;
                    } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                      newValue = Math.round((currentValue / 1440) * 10) / 10;
                    } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 10080) * 10) / 10;
                    } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 60);
                    } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                      newValue = Math.round((currentValue / 24) * 10) / 10;
                    } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 168) * 10) / 10;
                    } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 1440);
                    } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                      newValue = Math.round(currentValue * 24);
                    } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 7) * 10) / 10;
                    } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 10080);
                    } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                      newValue = Math.round(currentValue * 168);
                    } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                      newValue = Math.round(currentValue * 7);
                    }
                    
                    onUpdateGrade(curriculum.id, grade.id, { 
                      duration: newValue + ' ' + newUnit
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                </select>
              </div>
            </div>
            
            {/* Learning Objectives Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Target size={14} className="mr-1" />
                Learning Objectives
              </h4>
              
              {/* Existing Learning Objectives */}
              {grade.learningObjectives && grade.learningObjectives.length > 0 && (
                <div className="space-y-2 mb-3">
                  {grade.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-100 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{objective}</span>
                      <button
                        onClick={() => {
                          const updatedObjectives = grade.learningObjectives?.filter((_, i) => i !== index) || [];
                          onUpdateGrade(curriculum.id, grade.id, { 
                            learningObjectives: updatedObjectives
                          });
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Learning Objective */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newGradeLearningObjective}
                  onChange={(e) => setNewGradeLearningObjective(e.target.value)}
                  placeholder="Add learning objective..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newGradeLearningObjective.trim()) {
                      const updatedObjectives = [...(grade.learningObjectives || []), newGradeLearningObjective.trim()];
                      onUpdateGrade(curriculum.id, grade.id, { 
                        learningObjectives: updatedObjectives
                      });
                      setNewGradeLearningObjective('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newGradeLearningObjective.trim()) {
                      const updatedObjectives = [...(grade.learningObjectives || []), newGradeLearningObjective.trim()];
                      onUpdateGrade(curriculum.id, grade.id, { 
                        learningObjectives: updatedObjectives
                      });
                      setNewGradeLearningObjective('');
                    }
                  }}
                  disabled={!newGradeLearningObjective.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Books Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grade.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
                    onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id])}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-200">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing('book', book.id, 'name', book.name);
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ type: 'book', id: book.id, name: book.name });
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">
                      {renderEditableField('book', book.id, 'name', book.name)}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-orange-500" />
                        <span className="text-gray-600">{book.units.length} units</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Play size={16} className="text-purple-500" />
                        <span className="text-gray-600">
                          {book.units.reduce((sum, unit) => sum + unit.lessons.length, 0)} lessons
                        </span>
                      </div>
                      
                      {/* Duration */}
                      {book.duration && (
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-blue-500" />
                          <span className="text-gray-600">
                            {(() => {
                              const durationMatch = book.duration.match(/[\d.]+/);
                              const unitMatch = book.duration.match(/\b(Minutes|Hours|Days|Weeks)\b/);
                              if (durationMatch && unitMatch) {
                                const value = parseFloat(durationMatch[0]);
                                const unit = unitMatch[0];
                                
                                // Auto-convert for display
                                if (unit === 'Minutes' && value >= 60) {
                                  const hours = Math.round((value / 60) * 10) / 10;
                                  return `${hours} Hours`;
                                } else if (unit === 'Minutes' && value >= 1440) {
                                  const days = Math.round((value / 1440) * 10) / 10;
                                  return `${days} Days`;
                                } else if (unit === 'Minutes' && value >= 10080) {
                                  const weeks = Math.round((value / 10080) * 10) / 10;
                                  return `${weeks} Weeks`;
                                } else if (unit === 'Hours' && value >= 24) {
                                  const days = Math.round((value / 24) * 10) / 10;
                                  return `${days} Days`;
                                } else if (unit === 'Hours' && value >= 168) {
                                  const weeks = Math.round((value / 168) * 10) / 10;
                                  return `${weeks} Weeks`;
                                } else if (unit === 'Days' && value >= 7) {
                                  const weeks = Math.round((value / 7) * 10) / 10;
                                  return `${weeks} Weeks`;
                                }
                                
                                return book.duration;
                              }
                              return book.duration;
                            })()}
                          </span>
                        </div>
                      )}
                      
                      {/* Learning Objectives */}
                      {book.learningObjectives && book.learningObjectives.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target size={14} className="text-green-500" />
                            <span className="text-xs font-medium text-gray-700">Learning Objectives:</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {book.learningObjectives.slice(0, 3).map((objective, idx) => (
                              <li key={idx} className="flex items-start space-x-1">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span className="leading-tight">{objective}</span>
                              </li>
                            ))}
                            {book.learningObjectives.length > 3 && (
                              <li className="text-gray-400 text-xs">+{book.learningObjectives.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {book.units.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {book.units[0].name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {grade.books.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No books added yet</p>
                  <p className="text-gray-400 text-sm mb-6">Add your first book to get started</p>
                  <button
                    onClick={() => setShowAddModal({ type: 'book' })}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={20} />
                    <span>Add First Book</span>
                  </button>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    );
  }

    // Book detail view
    if (selectedPath.length === 6 && book) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <BookOpen size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('book', book.id, 'name', book.name)}
                </h1>
                <p className="text-gray-600 mt-1">Book in {grade?.name} - {curriculum.name}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal({ type: 'unit' })}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Unit</span>
              </button>
            </div>
          </div>

          {/* Content Layout - Full Width */}
          <div className="space-y-8">
            {/* Total Time Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock size={14} className="mr-1" />
                Total Time
              </h4>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={bookTimeInput !== '' ? bookTimeInput : (book.duration ? (book.duration.match(/[\d.]+/)?.[0] || '') : '')}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setBookTimeInput(inputValue);
                    
                    // Clear existing timeout
                    if (bookTimeTimeoutRef.current) {
                      clearTimeout(bookTimeTimeoutRef.current);
                    }
                    
                    // Set new timeout for 2 seconds
                    bookTimeTimeoutRef.current = setTimeout(() => {
                      const value = parseFloat(inputValue);
                      if (value && !isNaN(value)) {
                        let timeValue = value;
                        let timeUnit = 'Hours';
                        
                        // Auto-convert to appropriate unit
                        if (value < 1) {
                          // If less than 1 hour, convert to minutes
                          timeValue = Math.round(value * 60);
                          timeUnit = 'Minutes';
                        } else if (value >= 24 && value < 168) {
                          // Convert to days if 24+ hours but less than 7 days
                          timeValue = Math.round((value / 24) * 10) / 10;
                          timeUnit = 'Days';
                        } else if (value >= 168) {
                          // Convert to weeks if 7+ days
                          timeValue = Math.round((value / 168) * 10) / 10;
                          timeUnit = 'Weeks';
                        }
                        
                        onUpdateBook(curriculum.id, grade!.id, book.id, { 
                          duration: timeValue + ' ' + timeUnit
                        });
                      } else if (inputValue === '') {
                        onUpdateBook(curriculum.id, grade!.id, book.id, { 
                          duration: ''
                        });
                      }
                      setBookTimeInput(''); // Clear the input state after update
                    }, 2000);
                  }}
                  placeholder="0.0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={book.duration ? (book.duration.includes('Hours') ? 'Hours' : book.duration.includes('Days') ? 'Days' : book.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Hours'}
                  onChange={(e) => {
                    const currentValue = book.duration ? parseFloat(book.duration.match(/[\d.]+/)?.[0] || '0') : 0;
                    const currentUnit = book.duration ? (book.duration.includes('Hours') ? 'Hours' : book.duration.includes('Days') ? 'Days' : book.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                    const newUnit = e.target.value;
                    
                    // Convert between units
                    let newValue = currentValue;
                    if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                      newValue = Math.round((currentValue / 60) * 10) / 10;
                    } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                      newValue = Math.round((currentValue / 1440) * 10) / 10;
                    } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 10080) * 10) / 10;
                    } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 60);
                    } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                      newValue = Math.round((currentValue / 24) * 10) / 10;
                    } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 168) * 10) / 10;
                    } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 1440);
                    } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                      newValue = Math.round(currentValue * 24);
                    } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                      newValue = Math.round((currentValue / 7) * 10) / 10;
                    } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                      newValue = Math.round(currentValue * 10080);
                    } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                      newValue = Math.round(currentValue * 168);
                    } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                      newValue = Math.round(currentValue * 7);
                    }
                    
                    onUpdateBook(curriculum.id, grade!.id, book.id, { 
                      duration: newValue + ' ' + newUnit
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                </select>
              </div>
            </div>
            
            {/* Learning Objectives Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Target size={14} className="mr-1" />
                Learning Objectives
              </h4>
              
              {/* Existing Learning Objectives */}
              {book.learningObjectives && book.learningObjectives.length > 0 && (
                <div className="space-y-2 mb-3">
                  {book.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-100 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{objective}</span>
                      <button
                        onClick={() => {
                          const updatedObjectives = book.learningObjectives?.filter((_, i) => i !== index) || [];
                          onUpdateBook(curriculum.id, grade!.id, book.id, { 
                            learningObjectives: updatedObjectives
                          });
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Learning Objective */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newBookLearningObjective}
                  onChange={(e) => setNewBookLearningObjective(e.target.value)}
                  placeholder="Add learning objective..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newBookLearningObjective.trim()) {
                      const updatedObjectives = [...(book.learningObjectives || []), newBookLearningObjective.trim()];
                      onUpdateBook(curriculum.id, grade!.id, book.id, { 
                        learningObjectives: updatedObjectives
                      });
                      setNewBookLearningObjective('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newBookLearningObjective.trim()) {
                      const updatedObjectives = [...(book.learningObjectives || []), newBookLearningObjective.trim()];
                      onUpdateBook(curriculum.id, grade!.id, book.id, { 
                        learningObjectives: updatedObjectives
                      });
                      setNewBookLearningObjective('');
                    }
                  }}
                  disabled={!newBookLearningObjective.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Units Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {book.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
                    onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade!.id, 'book', book.id, 'unit', unit.id])}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-200">
                        <FileText size={24} className="text-white" />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing('unit', unit.id, 'name', unit.name);
                          }}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ type: 'unit', id: unit.id, name: unit.name });
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                      {renderEditableField('unit', unit.id, 'name', unit.name)}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Play size={16} className="text-purple-500" />
                        <span className="text-gray-600">{unit.lessons.length} lessons</span>
                      </div>
                      
                      {/* Duration */}
                      {unit.totalTime && (
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-blue-500" />
                          <span className="text-gray-600">
                            {(() => {
                              const totalTime = unit.totalTime as string;
                              const durationMatch = totalTime.match(/[\d.]+/);
                              const unitMatch = totalTime.match(/\b(Minutes|Hours|Days|Weeks)\b/);
                              if (durationMatch && unitMatch) {
                                const value = parseFloat(durationMatch[0]);
                                const unit = unitMatch[0];
                                
                                // Auto-convert for display
                                if (unit === 'Minutes' && value >= 60) {
                                  const hours = Math.round((value / 60) * 10) / 10;
                                  return `${hours} Hours`;
                                } else if (unit === 'Minutes' && value >= 1440) {
                                  const days = Math.round((value / 1440) * 10) / 10;
                                  return `${days} Days`;
                                } else if (unit === 'Minutes' && value >= 10080) {
                                  const weeks = Math.round((value / 10080) * 10) / 10;
                                  return `${weeks} Weeks`;
                                } else if (unit === 'Hours' && value >= 24) {
                                  const days = Math.round((value / 24) * 10) / 10;
                                  return `${days} Days`;
                                } else if (unit === 'Hours' && value >= 168) {
                                  const weeks = Math.round((value / 168) * 10) / 10;
                                  return `${weeks} Weeks`;
                                } else if (unit === 'Days' && value >= 7) {
                                  const weeks = Math.round((value / 7) * 10) / 10;
                                  return `${weeks} Weeks`;
                                }
                                
                                return totalTime;
                              }
                              return totalTime;
                            })()}
                          </span>
                        </div>
                      )}
                      
                      {/* Learning Objectives */}
                      {unit.learningObjectives && unit.learningObjectives.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target size={14} className="text-green-500" />
                            <span className="text-xs font-medium text-gray-700">Learning Objectives:</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {unit.learningObjectives.slice(0, 3).map((objective, idx) => (
                              <li key={idx} className="flex items-start space-x-1">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span className="leading-tight">{objective}</span>
                              </li>
                            ))}
                            {unit.learningObjectives.length > 3 && (
                              <li className="text-gray-400 text-xs">+{unit.learningObjectives.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {unit.lessons.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {unit.lessons[0].name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {book.units.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No units added yet</p>
                  <p className="text-gray-400 text-sm mb-6">Add your first unit to get started</p>
                  <button
                    onClick={() => setShowAddModal({ type: 'unit' })}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={20} />
                    <span>Add First Unit</span>
                  </button>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    );
  }

    // Unit detail view
    if (selectedPath.length === 8 && unit) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('unit', unit.id, 'name', unit.name)}
                </h1>
                <p className="text-gray-600 mt-1">Unit in {book?.name} - {grade?.name} - {curriculum.name}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal({ type: 'lesson' })}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Lesson</span>
              </button>
            </div>
          </div>

          {/* Unit Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock size={14} className="mr-1" />
                  Total Time
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={unitTimeInput !== '' ? unitTimeInput : (unit.totalTime ? (unit.totalTime.match(/[\d.]+/)?.[0] || '') : '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setUnitTimeInput(inputValue);
                      
                      // Clear existing timeout
                      if (unitTimeTimeoutRef.current) {
                        clearTimeout(unitTimeTimeoutRef.current);
                      }
                      
                      // Set new timeout for 2 seconds
                      unitTimeTimeoutRef.current = setTimeout(() => {
                        const value = parseFloat(inputValue);
                        if (value && !isNaN(value)) {
                          let timeValue = value;
                          let timeUnit = 'Hours';
                          
                          // Auto-convert to appropriate unit
                          if (value < 1) {
                            // If less than 1 hour, convert to minutes
                            timeValue = Math.round(value * 60);
                            timeUnit = 'Minutes';
                          } else if (value >= 24 && value < 168) {
                            // Convert to days if 24+ hours but less than 7 days
                            timeValue = Math.round((value / 24) * 10) / 10;
                            timeUnit = 'Days';
                          } else if (value >= 168) {
                            // Convert to weeks if 7+ days
                            timeValue = Math.round((value / 168) * 10) / 10;
                            timeUnit = 'Weeks';
                          }
                          
                          onUpdateUnit(curriculum.id, grade!.id, book!.id, unit.id, { 
                            totalTime: timeValue + ' ' + timeUnit
                          });
                        } else if (inputValue === '') {
                          onUpdateUnit(curriculum.id, grade!.id, book!.id, unit.id, { 
                            totalTime: ''
                          });
                        }
                        setUnitTimeInput(''); // Clear the input state after update
                      }, 2000);
                    }}
                    placeholder="0.0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={unit.totalTime ? (unit.totalTime.includes('Hours') ? 'Hours' : unit.totalTime.includes('Days') ? 'Days' : unit.totalTime.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Hours'}
                    onChange={(e) => {
                      const currentValue = unit.totalTime ? parseFloat(unit.totalTime.match(/[\d.]+/)?.[0] || '0') : 0;
                      const currentUnit = unit.totalTime ? (unit.totalTime.includes('Hours') ? 'Hours' : unit.totalTime.includes('Days') ? 'Days' : unit.totalTime.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                      const newUnit = e.target.value;
                      
                      // Convert between units
                      let newValue = currentValue;
                      if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                        newValue = Math.round((currentValue / 60) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 1440) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 10080) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 60);
                      } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 24) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 168) * 10) / 10;
                      } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 1440);
                      } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 24);
                      } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 7) * 10) / 10;
                      } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 10080);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 168);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                        newValue = Math.round(currentValue * 7);
                      }
                      
                      onUpdateUnit(curriculum.id, grade!.id, book!.id, unit.id, { 
                        totalTime: newValue + ' ' + newUnit
                      });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>
              </div>
              
              <div>
                <LearningObjectivesEditor
                  objectives={unit.learningObjectives}
                  onUpdate={(objectives) => onUpdateUnit(curriculum.id, grade!.id, book!.id, unit.id, { learningObjectives: objectives })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Standards Mapping</h3>
              {renderStandardsSelector(unit.standardCodes, (codes) => {
                onUpdateUnit(curriculum.id, grade!.id, book!.id, unit.id, { standardCodes: codes });
              })}
            </div>
          </div>

          {/* Lessons Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unit.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
                  onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade!.id, 'book', book!.id, 'unit', unit.id, 'lesson', lesson.id])}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg group-hover:from-purple-600 group-hover:to-violet-600 transition-all duration-200">
                      <Play size={24} className="text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing('lesson', lesson.id, 'name', lesson.name);
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'lesson', id: lesson.id, name: lesson.name });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {renderEditableField('lesson', lesson.id, 'name', lesson.name)}
                  </h3>
                  
                  {lesson.duration && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600 text-sm">{lesson.duration}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-indigo-500" />
                      <span className="text-gray-600">{lesson.stages.length} stages</span>
                    </div>
                    
                    {/* Learning Objectives */}
                    {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target size={14} className="text-green-500" />
                          <span className="text-xs font-medium text-gray-700">Learning Objectives:</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {lesson.learningObjectives.slice(0, 3).map((objective, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span className="leading-tight">{objective}</span>
                            </li>
                          ))}
                          {lesson.learningObjectives.length > 3 && (
                            <li className="text-gray-400 text-xs">+{lesson.learningObjectives.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Stage indicators */}
                  <div className="flex space-x-1 mt-4">
                    {lesson.stages.map((stage) => (
                      <div
                        key={stage.id}
                        className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(stage.name)}`}
                      >
                        {stage.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {unit.lessons.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Play size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No lessons added yet</p>
                <p className="text-gray-400 text-sm mb-6">Add your first lesson to get started</p>
                <button
                  onClick={() => setShowAddModal({ type: 'lesson' })}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Add First Lesson</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

    // Lesson detail view
    if (selectedPath.length === 10 && lesson) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                <Play size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('lesson', lesson.id, 'name', lesson.name)}
                </h1>
                <p className="text-gray-600 mt-1">Lesson in {unit?.name} - {book?.name} - {grade?.name} - {curriculum.name}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddStage(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Stage</span>
              </button>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock size={14} className="mr-1" />
                  Duration
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={lessonTimeInput !== '' ? lessonTimeInput : (lesson.duration ? (lesson.duration.match(/[\d.]+/)?.[0] || '') : '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setLessonTimeInput(inputValue);
                      
                      // Clear existing timeout
                      if (lessonTimeTimeoutRef.current) {
                        clearTimeout(lessonTimeTimeoutRef.current);
                      }
                      
                      // Set new timeout for 2 seconds
                      lessonTimeTimeoutRef.current = setTimeout(() => {
                        const value = parseFloat(inputValue);
                        if (value && !isNaN(value)) {
                          let timeValue = value;
                          let timeUnit = 'Minutes';
                          
                          // Auto-convert to appropriate unit
                          if (value >= 60 && value < 1440) {
                            // Convert to hours if 60+ minutes but less than 24 hours
                            timeValue = Math.round((value / 60) * 10) / 10; // Round to 1 decimal place
                            timeUnit = 'Hours';
                          } else if (value >= 1440 && value < 10080) {
                            // Convert to days if 24+ hours but less than 7 days
                            timeValue = Math.round((value / 1440) * 10) / 10;
                            timeUnit = 'Days';
                          } else if (value >= 10080) {
                            // Convert to weeks if 7+ days
                            timeValue = Math.round((value / 10080) * 10) / 10;
                            timeUnit = 'Weeks';
                          }
                          
                          onUpdateLesson(curriculum.id, grade!.id, book!.id, unit!.id, lesson.id, { 
                            duration: timeValue + ' ' + timeUnit
                          });
                        } else if (inputValue === '') {
                          onUpdateLesson(curriculum.id, grade!.id, book!.id, unit!.id, lesson.id, { 
                            duration: ''
                          });
                        }
                        setLessonTimeInput(''); // Clear the input state after update
                      }, 2000);
                    }}
                    placeholder="0.0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={lesson.duration ? (lesson.duration.includes('Hours') ? 'Hours' : lesson.duration.includes('Days') ? 'Days' : lesson.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes'}
                    onChange={(e) => {
                      const currentValue = lesson.duration ? parseFloat(lesson.duration.match(/[\d.]+/)?.[0] || '0') : 0;
                      const currentUnit = lesson.duration ? (lesson.duration.includes('Hours') ? 'Hours' : lesson.duration.includes('Days') ? 'Days' : lesson.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                      const newUnit = e.target.value;
                      
                      // Convert between units
                      let newValue = currentValue;
                      if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                        newValue = Math.round((currentValue / 60) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 1440) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 10080) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 60);
                      } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 24) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 168) * 10) / 10;
                      } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 1440);
                      } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 24);
                      } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 7) * 10) / 10;
                      } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 10080);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 168);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                        newValue = Math.round(currentValue * 7);
                      }
                      
                      onUpdateLesson(curriculum.id, grade!.id, book!.id, unit!.id, lesson.id, { 
                        duration: newValue + ' ' + newUnit
                      });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>
              </div>
              
              <div>
                <LearningObjectivesEditor
                  objectives={lesson.learningObjectives}
                  onUpdate={(objectives) => onUpdateLesson(curriculum.id, grade!.id, book!.id, unit!.id, lesson.id, { learningObjectives: objectives })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Standards Mapping</h3>
              {renderStandardsSelector(lesson.standardCodes, (codes) => {
                onUpdateLesson(curriculum.id, grade!.id, book!.id, unit!.id, lesson.id, { standardCodes: codes });
              })}
            </div>
          </div>

          {/* Stages */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Stages</h2>
            
            {/* Add Stage Form */}
            {showAddStage && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm mb-6">
                <h5 className="font-semibold text-gray-800 mb-4">Add New Stage</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage Name *</label>
                    <input
                      type="text"
                      value={newStage.name}
                      onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter stage name (e.g., Warm-up, Introduction, Practice, Assessment)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <TimeInput
                    value={newStage.duration}
                    onChange={(value) => setNewStage(prev => ({ ...prev, duration: value }))}
                    label="Stage Duration"
                  />
                  <LearningObjectivesEditor
                    objectives={newStage.learningObjectives}
                    onUpdate={(objectives) => setNewStage(prev => ({ ...prev, learningObjectives: objectives }))}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowAddStage(false);
                        setNewStage({ name: '', learningObjectives: [], duration: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStage}
                      disabled={!newStage.name.trim()}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Stage
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lesson.stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105 ${getStageColor(stage.name)} border-opacity-50`}
                  onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade!.id, 'book', book!.id, 'unit', unit!.id, 'lesson', lesson.id, 'stage', stage.id])}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStageIcon(stage.name)}
                      <h3 className="text-xl font-bold">
                        {renderEditableField('stage', stage.id, 'name', stage.name)}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing('stage', stage.id, 'name', stage.name);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'stage', id: stage.id, name: stage.name });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {stage.duration && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock size={16} className="opacity-75" />
                      <span className="text-sm opacity-90">{stage.duration}</span>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                      {stage.learningObjectives.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {stage.learningObjectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="opacity-75 mt-1">•</span>
                              <span className="opacity-90">{objective}</span>
                            </li>
                          ))}
                          {stage.learningObjectives.length > 3 && (
                            <li className="text-sm opacity-75">+{stage.learningObjectives.length - 3} more...</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm opacity-75">No objectives defined</p>
                      )}
                    </div>

                    {/* Add Activity Form */}
                    {showAddActivity === stage.id && (
                      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-4">Add New Activity</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name *</label>
                            <input
                              type="text"
                              value={newActivity.name}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter activity name..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type *</label>
                            <select
                              value={newActivity.type}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white"
                            >
                              <option value="">Select activity type...</option>
                              <option value="Movement Activity">Movement Activity</option>
                              <option value="Visual Learning">Visual Learning</option>
                              <option value="Hands-on Activity">Hands-on Activity</option>
                              <option value="Reflection Activity">Reflection Activity</option>
                              <option value="Group Activity">Group Activity</option>
                              <option value="Individual Work">Individual Work</option>
                              <option value="Discussion">Discussion</option>
                              <option value="Creative Activity">Creative Activity</option>
                              <option value="Assessment">Assessment</option>
                              <option value="Technology Activity">Technology Activity</option>
                            </select>
                          </div>
                          <TimeInput
                            value={newActivity.duration}
                            onChange={(value) => setNewActivity(prev => ({ ...prev, duration: value }))}
                            label="Duration"
                            placeholder="Enter activity duration"
                          />
                          <LearningObjectivesEditor
                            objectives={newActivity.learningObjectives}
                            onUpdate={(objectives) => setNewActivity(prev => ({ ...prev, learningObjectives: objectives }))}
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setShowAddActivity(null)}
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddActivity(stage.id)}
                              disabled={!newActivity.name.trim() || !newActivity.type.trim()}
                              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Add Activity
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2">Activities:</h4>
                      <div className="space-y-2">
                        {stage.activities.map((activity) => (
                          <div key={activity.id} className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {renderEditableField('activity', activity.id, 'name', activity.name)}
                                </h5>
                                <p className="text-sm opacity-75">{activity.type}</p>
                                {activity.duration && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Clock size={12} className="opacity-75" />
                                    <span className="text-xs opacity-75">{activity.duration}</span>
                                  </div>
                                )}
                                
                                {/* Learning Objectives */}
                                {activity.learningObjectives && activity.learningObjectives.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-white border-opacity-30">
                                    <div className="flex items-center space-x-1 mb-1">
                                      <Target size={10} className="opacity-75" />
                                      <span className="text-xs font-medium opacity-90">Objectives:</span>
                                    </div>
                                    <ul className="text-xs opacity-75 space-y-0.5">
                                      {activity.learningObjectives.slice(0, 2).map((objective, idx) => (
                                        <li key={idx} className="flex items-start space-x-1">
                                          <span className="mt-0.5">•</span>
                                          <span className="leading-tight">{objective}</span>
                                        </li>
                                      ))}
                                      {activity.learningObjectives.length > 2 && (
                                        <li className="text-xs opacity-60">+{activity.learningObjectives.length - 2} more...</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm({ type: 'activity', id: activity.id, name: activity.name });
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Activity Button */}
                        <button
                          onClick={() => setShowAddActivity(stage.id)}
                          className="w-full py-3 border-2 border-dashed border-pink-300 rounded-lg text-pink-600 hover:border-pink-400 hover:text-pink-700 hover:bg-pink-50 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>Add Activity</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lesson.stages.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Target size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No stages added yet</p>
                <p className="text-gray-400 text-sm mb-6">Click "Add Stage" to create the first stage</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Play', 'Lead', 'Apply', 'Yield'].map((stageName) => (
                    <button
                      key={stageName}
                      onClick={() => {
                        setNewStage(prev => ({ ...prev, name: stageName }));
                        setShowAddStage(true);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${getStageColor(stageName)} hover:shadow-md`}
                    >
                      {getStageIcon(stageName)}
                      <span>Add {stageName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    }

    // Stage detail view
    if (selectedPath.length === 12 && stage) {
      return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className={`p-3 rounded-xl ${getStageColor(stage.name).includes('pink') ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 
                getStageColor(stage.name).includes('blue') ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                getStageColor(stage.name).includes('green') ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                'bg-gradient-to-r from-yellow-500 to-amber-500'}`}>
                {getStageIcon(stage.name)}
                <div className="ml-2 text-white">
                  <h1 className="text-2xl font-bold">{stage.name}</h1>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {renderEditableField('stage', stage.id, 'name', stage.name)}
                </h1>
                <p className="text-gray-600 mt-1">Stage in {lesson?.name} - {unit?.name} - {book?.name} - {grade?.name} - {curriculum.name}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal({ type: 'activity', parentId: stage.id })}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Stage Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock size={14} className="mr-1" />
                  Duration
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={stageTimeInput !== '' ? stageTimeInput : (stage.duration ? (stage.duration.match(/[\d.]+/)?.[0] || '') : '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setStageTimeInput(inputValue);
                      
                      // Clear existing timeout
                      if (stageTimeTimeoutRef.current) {
                        clearTimeout(stageTimeTimeoutRef.current);
                      }
                      
                      // Set new timeout for 2 seconds
                      stageTimeTimeoutRef.current = setTimeout(() => {
                        const value = parseFloat(inputValue);
                        if (value && !isNaN(value)) {
                          let timeValue = value;
                          let timeUnit = 'Hours';
                          
                          // Auto-convert to appropriate unit
                          if (value < 1) {
                            // If less than 1 hour, convert to minutes
                            timeValue = Math.round(value * 60);
                            timeUnit = 'Minutes';
                          } else if (value >= 24 && value < 168) {
                            // Convert to days if 24+ hours but less than 7 days
                            timeValue = Math.round((value / 24) * 10) / 10;
                            timeUnit = 'Days';
                          } else if (value >= 168) {
                            // Convert to weeks if 7+ days
                            timeValue = Math.round((value / 168) * 10) / 10;
                            timeUnit = 'Weeks';
                          }
                          
                          onUpdateStage(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, { 
                            duration: timeValue + ' ' + timeUnit
                          });
                        } else if (inputValue === '') {
                          onUpdateStage(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, { 
                            duration: ''
                          });
                        }
                        setStageTimeInput(''); // Clear the input state after update
                      }, 2000);
                    }}
                    placeholder="0.0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={stage.duration ? (stage.duration.includes('Hours') ? 'Hours' : stage.duration.includes('Days') ? 'Days' : stage.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Hours'}
                    onChange={(e) => {
                      const currentValue = stage.duration ? parseFloat(stage.duration.match(/[\d.]+/)?.[0] || '0') : 0;
                      const currentUnit = stage.duration ? (stage.duration.includes('Hours') ? 'Hours' : stage.duration.includes('Days') ? 'Days' : stage.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                      const newUnit = e.target.value;
                      
                      // Convert between units
                      let newValue = currentValue;
                      if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                        newValue = Math.round((currentValue / 60) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 1440) * 10) / 10;
                      } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 10080) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 60);
                      } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                        newValue = Math.round((currentValue / 24) * 10) / 10;
                      } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 168) * 10) / 10;
                      } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 1440);
                      } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 24);
                      } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                        newValue = Math.round((currentValue / 7) * 10) / 10;
                      } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                        newValue = Math.round(currentValue * 10080);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                        newValue = Math.round(currentValue * 168);
                      } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                        newValue = Math.round(currentValue * 7);
                      }
                      
                      onUpdateStage(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, { 
                        duration: newValue + ' ' + newUnit
                      });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>
              </div>
              
              <div>
                <LearningObjectivesEditor
                  objectives={stage.learningObjectives}
                  onUpdate={(objectives) => onUpdateStage(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, { learningObjectives: objectives })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Standards Mapping</h3>
              {renderStandardsSelector(stage.standardCodes, (codes) => {
                onUpdateStage(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, { standardCodes: codes });
              })}
            </div>
          </div>

          {/* Activities Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stage.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg group-hover:from-pink-600 group-hover:to-rose-600 transition-all duration-200">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing('activity', activity.id, 'name', activity.name);
                        }}
                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'activity', id: activity.id, name: activity.name });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {renderEditableField('activity', activity.id, 'name', activity.name)}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">{activity.type}</p>
                  
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      Duration
                    </h5>
                    <div className="flex space-x-1">
                      <input
                        type="number"
                        step="0.1"
                        value={activityTimeInput !== '' ? activityTimeInput : (activity.duration ? (activity.duration.match(/[\d.]+/)?.[0] || '') : '')}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setActivityTimeInput(inputValue);
                          
                          // Clear existing timeout
                          if (activityTimeTimeoutRef.current) {
                            clearTimeout(activityTimeTimeoutRef.current);
                          }
                          
                          // Set new timeout for 2 seconds
                          activityTimeTimeoutRef.current = setTimeout(() => {
                            const value = parseFloat(inputValue);
                            if (value && !isNaN(value)) {
                              let timeValue = value;
                              let timeUnit = 'Minutes';
                              
                              // Auto-convert to appropriate unit
                              if (value >= 60 && value < 1440) {
                                timeValue = Math.round((value / 60) * 10) / 10;
                                timeUnit = 'Hours';
                              } else if (value >= 1440 && value < 10080) {
                                timeValue = Math.round((value / 1440) * 10) / 10;
                                timeUnit = 'Days';
                              } else if (value >= 10080) {
                                timeValue = Math.round((value / 10080) * 10) / 10;
                                timeUnit = 'Weeks';
                              }
                              
                              onUpdateActivity(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, activity.id, { 
                                duration: timeValue + ' ' + timeUnit
                              });
                            } else if (inputValue === '') {
                              onUpdateActivity(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, activity.id, { 
                                duration: ''
                              });
                            }
                            setActivityTimeInput('');
                          }, 2000);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="0.0"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                      />
                      <select
                        value={activity.duration ? (activity.duration.includes('Hours') ? 'Hours' : activity.duration.includes('Days') ? 'Days' : activity.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes'}
                        onChange={(e) => {
                          const currentValue = activity.duration ? parseFloat(activity.duration.match(/[\d.]+/)?.[0] || '0') : 0;
                          const currentUnit = activity.duration ? (activity.duration.includes('Hours') ? 'Hours' : activity.duration.includes('Days') ? 'Days' : activity.duration.includes('Weeks') ? 'Weeks' : 'Minutes') : 'Minutes';
                          const newUnit = e.target.value;
                          
                          // Convert between units
                          let newValue = currentValue;
                          if (currentUnit === 'Minutes' && newUnit === 'Hours') {
                            newValue = Math.round((currentValue / 60) * 10) / 10;
                          } else if (currentUnit === 'Minutes' && newUnit === 'Days') {
                            newValue = Math.round((currentValue / 1440) * 10) / 10;
                          } else if (currentUnit === 'Minutes' && newUnit === 'Weeks') {
                            newValue = Math.round((currentValue / 10080) * 10) / 10;
                          } else if (currentUnit === 'Hours' && newUnit === 'Minutes') {
                            newValue = Math.round(currentValue * 60);
                          } else if (currentUnit === 'Hours' && newUnit === 'Days') {
                            newValue = Math.round((currentValue / 24) * 10) / 10;
                          } else if (currentUnit === 'Hours' && newUnit === 'Weeks') {
                            newValue = Math.round((currentValue / 168) * 10) / 10;
                          } else if (currentUnit === 'Days' && newUnit === 'Minutes') {
                            newValue = Math.round(currentValue * 1440);
                          } else if (currentUnit === 'Days' && newUnit === 'Hours') {
                            newValue = Math.round(currentValue * 24);
                          } else if (currentUnit === 'Days' && newUnit === 'Weeks') {
                            newValue = Math.round((currentValue / 7) * 10) / 10;
                          } else if (currentUnit === 'Weeks' && newUnit === 'Minutes') {
                            newValue = Math.round(currentValue * 10080);
                          } else if (currentUnit === 'Weeks' && newUnit === 'Hours') {
                            newValue = Math.round(currentValue * 168);
                          } else if (currentUnit === 'Weeks' && newUnit === 'Days') {
                            newValue = Math.round(currentValue * 7);
                          }
                          
                          onUpdateActivity(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, activity.id, { 
                            duration: newValue + ' ' + newUnit
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent bg-white"
                      >
                        <option value="Minutes">Min</option>
                        <option value="Hours">Hr</option>
                        <option value="Days">Day</option>
                        <option value="Weeks">Wk</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Learning Objectives Editor */}
                  <div className="mb-4">
                    <LearningObjectivesEditor
                      objectives={activity.learningObjectives}
                      onUpdate={(objectives) => onUpdateActivity(curriculum.id, grade!.id, book!.id, unit!.id, lesson!.id, stage.id, activity.id, { learningObjectives: objectives })}
                    />
                  </div>
                </div>
              ))}
            </div>

            {stage.activities.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Zap size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No activities added yet</p>
                <p className="text-gray-400 text-sm mb-6">Add your first activity to get started</p>
                <button
                  onClick={() => setShowAddModal({ type: 'activity', parentId: stage.id })}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Add First Activity</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    }

    // Activity detail view (if needed for individual activity editing)
    // For now, activities are managed within the stage detail view
    // which provides a better UX for this curriculum structure
    
    return null;
  };

  return (
    <>
      {renderMainContent()}
      
      {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {showAddModal.type === 'activity' ? 'Add Activities' : `Add New ${showAddModal.type.charAt(0).toUpperCase() + showAddModal.type.slice(1)}`}
              </h3>
              
              {/* Success message for activities */}
              {showAddModal.type === 'activity' && activityAddedMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{activityAddedMessage}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {showAddModal.type === 'stage' ? 'Stage Type' : 'Name'} *
                  </label>
                  {showAddModal.type === 'stage' ? (
                    <select
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select stage type</option>
                      <option value="Play">Play</option>
                      <option value="Lead">Lead</option>
                      <option value="Apply">Apply</option>
                      <option value="Yield">Yield</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder={`Enter ${showAddModal.type} name...`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      autoFocus
                    />
                  )}
                </div>

                {/* Activity Type Field - Only for activities */}
                {showAddModal.type === 'activity' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type *</label>
                    <input
                      type="text"
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value)}
                      placeholder="e.g., Discussion, Hands-on, Assessment..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}

                {/* Duration Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock size={16} className="mr-2" />
                    Duration
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={newItemDuration}
                      onChange={(e) => setNewItemDuration(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Learning Objectives Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Target size={16} className="mr-2" />
                    Learning Objectives
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newItemLearningObjective}
                      onChange={(e) => setNewItemLearningObjective(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLearningObjective();
                        }
                      }}
                      placeholder="Add learning objective..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={handleAddLearningObjective}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Display added learning objectives */}
                  {newItemLearningObjectives.length > 0 && (
                    <div className="space-y-2">
                      {newItemLearningObjectives.map((objective, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{objective}</span>
                          <button
                            onClick={() => handleRemoveLearningObjective(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(null);
                    setActivityAddedMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showAddModal.type === 'activity' ? 'Done' : 'Cancel'}
                </button>
                {showAddModal.type !== 'activity' && (
                  <button
                    onClick={handleAdd}
                    disabled={!newItemName.trim()}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add {showAddModal.type.charAt(0).toUpperCase() + showAddModal.type.slice(1)}
                  </button>
                )}
                {showAddModal.type === 'activity' && (
                  <button
                    onClick={handleAdd}
                    disabled={!newItemName.trim() || !newItemType.trim()}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Activity
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone and will also delete all nested content.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Upload Curriculum Modal */}
        {showUploadModal && (
          <UploadCurriculum
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={() => {
              // Refresh the curriculum data
              window.location.reload();
            }}
          />
        )}
      </>
    );
  }