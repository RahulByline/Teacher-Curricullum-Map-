import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, GraduationCap, FileText, Play, Target, Clock, Edit2, Trash2, Plus, Eye, Users, Zap, CheckCircle } from 'lucide-react';
import { Curriculum, Grade, Book, Unit, Lesson, Stage, Activity } from '../types/curriculum';

interface CurriculumGridViewProps {
  curriculums: Curriculum[];
  onSelectPath: (path: string[]) => void;
  onUpdateCurriculum: (curriculumId: string, updates: Partial<Curriculum>) => void;
  onUpdateGrade: (curriculumId: string, gradeId: string, updates: Partial<Grade>) => void;
  onUpdateBook: (curriculumId: string, gradeId: string, bookId: string, updates: Partial<Book>) => void;
  onUpdateUnit: (curriculumId: string, gradeId: string, bookId: string, unitId: string, updates: Partial<Unit>) => void;
  onUpdateLesson: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, updates: Partial<Lesson>) => void;
  onUpdateStage: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, updates: Partial<Stage>) => void;
  onUpdateActivity: (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string, updates: Partial<Activity>) => void;
}

export function CurriculumGridView({ 
  curriculums, 
  onSelectPath,
  onUpdateCurriculum,
  onUpdateGrade,
  onUpdateBook,
  onUpdateUnit,
  onUpdateLesson,
  onUpdateStage,
  onUpdateActivity
}: CurriculumGridViewProps) {
  const [expandedCurriculums, setExpandedCurriculums] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleExpansion = (type: string, id: string, setState: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setState(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const startEditing = (type: string, id: string, field: string, currentValue: string) => {
    setEditingItem({ type, id, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingItem) return;

    const { type, id, field } = editingItem;
    const updates = { [field]: editValue };

    // Find the item and its path
    for (const curriculum of curriculums) {
      if (type === 'curriculum' && curriculum.id === id) {
        onUpdateCurriculum(curriculum.id, updates);
        break;
      }
      
      for (const grade of curriculum.grades) {
        if (type === 'grade' && grade.id === id) {
          onUpdateGrade(curriculum.id, grade.id, updates);
          break;
        }
        
        for (const book of grade.books) {
          if (type === 'book' && book.id === id) {
            onUpdateBook(curriculum.id, grade.id, book.id, updates);
            break;
          }
          
          for (const unit of book.units) {
            if (type === 'unit' && unit.id === id) {
              onUpdateUnit(curriculum.id, grade.id, book.id, unit.id, updates);
              break;
            }
            
            for (const lesson of unit.lessons) {
              if (type === 'lesson' && lesson.id === id) {
                onUpdateLesson(curriculum.id, grade.id, book.id, unit.id, lesson.id, updates);
                break;
              }
              
              for (const stage of lesson.stages) {
                if (type === 'stage' && stage.id === id) {
                  onUpdateStage(curriculum.id, grade.id, book.id, unit.id, lesson.id, stage.id, updates);
                  break;
                }
                
                for (const activity of stage.activities) {
                  if (type === 'activity' && activity.id === id) {
                    onUpdateActivity(curriculum.id, grade.id, book.id, unit.id, lesson.id, stage.id, activity.id, updates);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    setEditingItem(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName) {
      case 'Play': return <Zap size={14} className="text-pink-600" />;
      case 'Lead': return <Users size={14} className="text-blue-600" />;
      case 'Apply': return <Target size={14} className="text-green-600" />;
      case 'Yield': return <CheckCircle size={14} className="text-yellow-600" />;
      case 'Warm-up': return <Zap size={14} className="text-orange-600" />;
      case 'Introduction': return <Users size={14} className="text-indigo-600" />;
      case 'Practice': return <Target size={14} className="text-emerald-600" />;
      case 'Assessment': return <CheckCircle size={14} className="text-purple-600" />;
      default: return <Target size={14} className="text-gray-600" />;
    }
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

  if (curriculums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-6 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <FileText size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg mb-2">No curriculum data to display</p>
        <p className="text-gray-400 text-sm">Add curriculums to see the grid view</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <div className="flex items-center space-x-3">
          <FileText size={24} />
          <div>
            <h3 className="text-xl font-bold">Curriculum Grid View</h3>
            <p className="text-indigo-100 text-sm">Hierarchical table view • Double-click to edit</p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Structure</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Learning Objectives</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Stats</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {curriculums.map((curriculum) => (
              <React.Fragment key={curriculum.id}>
                {/* Curriculum Row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpansion('curriculum', curriculum.id, setExpandedCurriculums)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedCurriculums.has(curriculum.id) ? 
                          <ChevronDown size={16} className="text-gray-600" /> : 
                          <ChevronRight size={16} className="text-gray-600" />
                        }
                      </button>
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        <BookOpen size={16} className="text-white" />
                      </div>
                      {renderEditableField('curriculum', curriculum.id, 'name', curriculum.name, 'font-semibold text-gray-800')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      Curriculum
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {curriculum.description || 'No description'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {curriculum.grades.length} grades
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectPath(['curriculum', curriculum.id])}
                      className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>

                {/* Grades */}
                {expandedCurriculums.has(curriculum.id) && curriculum.grades.map((grade) => (
                  <React.Fragment key={grade.id}>
                    <tr className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => toggleExpansion('grade', grade.id, setExpandedGrades)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {expandedGrades.has(grade.id) ? 
                              <ChevronDown size={14} className="text-gray-600" /> : 
                              <ChevronRight size={14} className="text-gray-600" />
                            }
                          </button>
                          <div className="p-1 bg-blue-500 rounded">
                            <GraduationCap size={14} className="text-white" />
                          </div>
                          {renderEditableField('grade', grade.id, 'name', grade.name, 'font-medium text-gray-700')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Grade
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-gray-600 max-w-xs">
                          {grade.learningObjectives && grade.learningObjectives.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {grade.learningObjectives.slice(0, 2).map((obj, idx) => (
                                <li key={idx}>{obj}</li>
                              ))}
                              {grade.learningObjectives.length > 2 && (
                                <li className="text-gray-400">+{grade.learningObjectives.length - 2} more...</li>
                              )}
                            </ul>
                          ) : (
                            <span className="text-gray-400">No objectives</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock size={12} />
                          <span>{grade.duration || 'Not set'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {grade.books.length} books
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id])}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* Books */}
                    {expandedGrades.has(grade.id) && grade.books.map((book) => (
                      <React.Fragment key={book.id}>
                        <tr className="border-b border-gray-100 hover:bg-green-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2 ml-12">
                              <button
                                onClick={() => toggleExpansion('book', book.id, setExpandedBooks)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {expandedBooks.has(book.id) ? 
                                  <ChevronDown size={12} className="text-gray-600" /> : 
                                  <ChevronRight size={12} className="text-gray-600" />
                                }
                              </button>
                              <div className="p-1 bg-green-500 rounded">
                                <BookOpen size={12} className="text-white" />
                              </div>
                              {renderEditableField('book', book.id, 'name', book.name, 'font-medium text-gray-700')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Book
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-xs text-gray-600 max-w-xs">
                              {book.learningObjectives && book.learningObjectives.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {book.learningObjectives.slice(0, 2).map((obj, idx) => (
                                    <li key={idx}>{obj}</li>
                                  ))}
                                  {book.learningObjectives.length > 2 && (
                                    <li className="text-gray-400">+{book.learningObjectives.length - 2} more...</li>
                                  )}
                                </ul>
                              ) : (
                                <span className="text-gray-400">No objectives</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Clock size={12} />
                              <span>{book.duration || 'Not set'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {book.units.length} units
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id])}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>

                        {/* Units */}
                        {expandedBooks.has(book.id) && book.units.map((unit) => (
                          <React.Fragment key={unit.id}>
                            <tr className="border-b border-gray-100 hover:bg-orange-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2 ml-18">
                                  <button
                                    onClick={() => toggleExpansion('unit', unit.id, setExpandedUnits)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    {expandedUnits.has(unit.id) ? 
                                      <ChevronDown size={10} className="text-gray-600" /> : 
                                      <ChevronRight size={10} className="text-gray-600" />
                                    }
                                  </button>
                                  <div className="p-1 bg-orange-500 rounded">
                                    <FileText size={10} className="text-white" />
                                  </div>
                                  {renderEditableField('unit', unit.id, 'name', unit.name, 'font-medium text-gray-700')}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  Unit
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-xs text-gray-600 max-w-xs">
                                  {unit.learningObjectives.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                      {unit.learningObjectives.slice(0, 2).map((obj, idx) => (
                                        <li key={idx}>{obj}</li>
                                      ))}
                                      {unit.learningObjectives.length > 2 && (
                                        <li className="text-gray-400">+{unit.learningObjectives.length - 2} more...</li>
                                      )}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-400">No objectives</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                  <Clock size={12} />
                                  <span>{unit.totalTime || 'Not set'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-600">
                                  {unit.lessons.length} lessons
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id, 'unit', unit.id])}
                                  className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                                  title="View details"
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>

                            {/* Lessons */}
                            {expandedUnits.has(unit.id) && unit.lessons.map((lesson) => (
                              <React.Fragment key={lesson.id}>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2 ml-24">
                                      <button
                                        onClick={() => toggleExpansion('lesson', lesson.id, setExpandedLessons)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                      >
                                        {expandedLessons.has(lesson.id) ? 
                                          <ChevronDown size={8} className="text-gray-600" /> : 
                                          <ChevronRight size={8} className="text-gray-600" />
                                        }
                                      </button>
                                      <div className="p-1 bg-purple-500 rounded">
                                        <Play size={8} className="text-white" />
                                      </div>
                                      {renderEditableField('lesson', lesson.id, 'name', lesson.name, 'font-medium text-gray-700')}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                      Lesson
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-xs text-gray-600 max-w-xs">
                                      {lesson.learningObjectives.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1">
                                          {lesson.learningObjectives.slice(0, 2).map((obj, idx) => (
                                            <li key={idx}>{obj}</li>
                                          ))}
                                          {lesson.learningObjectives.length > 2 && (
                                            <li className="text-gray-400">+{lesson.learningObjectives.length - 2} more...</li>
                                          )}
                                        </ul>
                                      ) : (
                                        <span className="text-gray-400">No objectives</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                      <Clock size={12} />
                                      <span>{lesson.duration || 'Not set'}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm text-gray-600">
                                      {lesson.stages.length} stages
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id, 'unit', unit.id, 'lesson', lesson.id])}
                                      className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                                      title="View details"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  </td>
                                </tr>

                                {/* Stages */}
                                {expandedLessons.has(lesson.id) && lesson.stages.map((stage) => (
                                  <tr key={stage.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                      <div className="flex items-center space-x-2 ml-30">
                                        {getStageIcon(stage.name)}
                                        {renderEditableField('stage', stage.id, 'name', stage.name, 'text-sm font-medium text-gray-600')}
                                      </div>
                                    </td>
                                    <td className="py-2 px-4">
                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                        {stage.name} Stage
                                      </span>
                                    </td>
                                    <td className="py-2 px-4">
                                      <div className="text-xs text-gray-600 max-w-xs">
                                        {stage.learningObjectives.length > 0 ? (
                                          <ul className="list-disc list-inside space-y-1">
                                            {stage.learningObjectives.slice(0, 1).map((obj, idx) => (
                                              <li key={idx}>{obj}</li>
                                            ))}
                                            {stage.learningObjectives.length > 1 && (
                                              <li className="text-gray-400">+{stage.learningObjectives.length - 1} more...</li>
                                            )}
                                          </ul>
                                        ) : (
                                          <span className="text-gray-400">No objectives</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-4">
                                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                                        <Clock size={10} />
                                        <span className="text-xs">{stage.duration || 'Not set'}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-4">
                                      <div className="text-xs text-gray-600">
                                        {stage.activities.length} activities
                                      </div>
                                    </td>
                                    <td className="py-2 px-4">
                                      <span className="text-xs text-gray-400">Stage</span>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <strong>Navigation:</strong> Click chevrons to expand • Double-click names to edit • Click eye icon to view details
          </div>
          <div>
            Total: {curriculums.length} curriculums
          </div>
        </div>
      </div>
    </div>
  );
}