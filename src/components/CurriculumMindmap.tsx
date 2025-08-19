import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, GraduationCap, FileText, Play, Target, Clock, Zap, Users, CheckCircle, ChevronRight, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { Curriculum, Grade, Book, Unit, Lesson, Stage, Activity } from '../types/curriculum';

interface CurriculumMindmapProps {
  curriculums: Curriculum[];
  onSelectPath: (path: string[]) => void;
}

interface TooltipData {
  title: string;
  learningObjectives: string[];
  duration?: string;
  stats?: string;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CurriculumMindmap({ curriculums, onSelectPath }: CurriculumMindmapProps) {
  const [hoveredItem, setHoveredItem] = useState<{ x: number; y: number; data: TooltipData } | null>(null);
  const [expandedCurriculums, setExpandedCurriculums] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleCurriculum = (curriculumId: string) => {
    const newExpanded = new Set(expandedCurriculums);
    if (newExpanded.has(curriculumId)) {
      newExpanded.delete(curriculumId);
      setExpandedGrades(new Set());
      setExpandedBooks(new Set());
      setExpandedUnits(new Set());
      setExpandedLessons(new Set());
    } else {
      newExpanded.add(curriculumId);
    }
    setExpandedCurriculums(newExpanded);
  };

  const toggleGrade = (gradeId: string) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(gradeId)) {
      newExpanded.delete(gradeId);
      setExpandedBooks(new Set());
      setExpandedUnits(new Set());
      setExpandedLessons(new Set());
    } else {
      newExpanded.add(gradeId);
    }
    setExpandedGrades(newExpanded);
  };

  const toggleBook = (bookId: string) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId);
      const newExpandedUnits = new Set(expandedUnits);
      const newExpandedLessons = new Set(expandedLessons);
      curriculums.forEach(curriculum => {
        curriculum.grades.forEach(grade => {
          const book = grade.books.find(b => b.id === bookId);
          if (book) {
            book.units.forEach(unit => {
              newExpandedUnits.delete(unit.id);
              unit.lessons.forEach(lesson => {
                newExpandedLessons.delete(lesson.id);
              });
            });
          }
        });
      });
      setExpandedUnits(newExpandedUnits);
      setExpandedLessons(newExpandedLessons);
    } else {
      newExpanded.add(bookId);
    }
    setExpandedBooks(newExpanded);
  };

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
      const newExpandedLessons = new Set(expandedLessons);
      curriculums.forEach(curriculum => {
        curriculum.grades.forEach(grade => {
          grade.books.forEach(book => {
            const unit = book.units.find(u => u.id === unitId);
            if (unit) {
              unit.lessons.forEach(lesson => {
                newExpandedLessons.delete(lesson.id);
              });
            }
          });
        });
      });
      setExpandedLessons(newExpandedLessons);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName) {
      case 'Play': return <Zap size={10} className="text-pink-600" />;
      case 'Lead': return <Users size={10} className="text-blue-600" />;
      case 'Apply': return <Target size={10} className="text-green-600" />;
      case 'Yield': return <CheckCircle size={10} className="text-yellow-600" />;
      case 'Warm-up': return <Zap size={10} className="text-orange-600" />;
      case 'Introduction': return <Users size={10} className="text-indigo-600" />;
      case 'Practice': return <Target size={10} className="text-emerald-600" />;
      case 'Assessment': return <CheckCircle size={10} className="text-purple-600" />;
      default: return <Target size={10} className="text-gray-600" />;
    }
  };

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case 'Play': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'Lead': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Apply': return 'bg-green-100 border-green-300 text-green-800';
      case 'Yield': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Warm-up': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'Introduction': return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'Practice': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'Assessment': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, data: TooltipData) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({
      x: rect.right + 10,
      y: rect.top,
      data
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (curriculums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-6 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <GraduationCap size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg mb-2">No curriculum data to visualize</p>
        <p className="text-gray-400 text-sm">Add curriculums to see the mindmap</p>
      </div>
    );
  }

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-white" 
    : "relative bg-white rounded-xl shadow-lg border border-gray-200";

  return (
    <div className={containerClass}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Curriculum Mindmap</h3>
            <p className="text-sm text-gray-600">Interactive tree view • Drag to pan • Scroll to zoom</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={resetView}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Reset View
          </button>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 size={18} className="text-indigo-600" /> : <Maximize2 size={18} className="text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className={`canvas-background overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${isFullscreen ? 'h-screen pt-20' : 'h-96 mt-16'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          ref={canvasRef}
          className="relative w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>

          {/* Tree Layout */}
          <div className="relative p-8" style={{ zIndex: 2, minWidth: '200vw', minHeight: '150vh' }}>
            <div className="flex flex-col items-center space-y-16">
              {/* Root Node */}
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Target size={24} />
                    <div>
                      <h4 className="font-bold text-lg">Education System</h4>
                      <p className="text-indigo-100 text-sm">{curriculums.length} curriculums</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Curriculums Level */}
              <div className="flex flex-wrap justify-center gap-12">
                {curriculums.map((curriculum, curriculumIndex) => (
                  <div key={curriculum.id} className="flex flex-col items-center space-y-8">
                    {/* Curriculum Node */}
                    <div className="relative">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCurriculum(curriculum.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                        >
                          {expandedCurriculums.has(curriculum.id) ? 
                            <ChevronDown size={16} className="text-gray-600" /> : 
                            <ChevronRight size={16} className="text-gray-600" />
                          }
                        </button>
                        <div
                          className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                          onClick={() => onSelectPath(['curriculum', curriculum.id])}
                          onMouseEnter={(e) => handleMouseEnter(e, {
                            title: curriculum.name,
                            learningObjectives: curriculum.description ? [curriculum.description] : [],
                            stats: `${curriculum.grades.length} grades • ${curriculum.grades.reduce((sum, grade) => sum + grade.books.length, 0)} books`
                          })}
                          onMouseLeave={handleMouseLeave}
                        >
                          <BookOpen size={20} />
                          <div>
                            <h4 className="font-bold">{curriculum.name}</h4>
                            <p className="text-indigo-100 text-xs">{curriculum.grades.length} grades</p>
                          </div>
                        </div>
                      </div>

                      {/* Connection line to parent */}
                      <div className="absolute -top-8 left-1/2 w-px h-8 bg-gray-300 transform -translate-x-1/2"></div>
                    </div>

                    {/* Grades Level */}
                    {expandedCurriculums.has(curriculum.id) && curriculum.grades.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-8">
                        {curriculum.grades.map((grade, gradeIndex) => (
                          <div key={grade.id} className="flex flex-col items-center space-y-6">
                            {/* Grade Node */}
                            <div className="relative">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleGrade(grade.id);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                                >
                                  {expandedGrades.has(grade.id) ? 
                                    <ChevronDown size={14} className="text-gray-600" /> : 
                                    <ChevronRight size={14} className="text-gray-600" />
                                  }
                                </button>
                                <div
                                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                                  onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id])}
                                  onMouseEnter={(e) => handleMouseEnter(e, {
                                    title: grade.name,
                                    learningObjectives: [],
                                    stats: `${grade.books.length} books`
                                  })}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <GraduationCap size={16} />
                                  <div>
                                    <h5 className="font-semibold text-sm">{grade.name}</h5>
                                    <p className="text-blue-100 text-xs">{grade.books.length} books</p>
                                  </div>
                                </div>
                              </div>

                              {/* Connection line to parent */}
                              <div className="absolute -top-6 left-1/2 w-px h-6 bg-gray-300 transform -translate-x-1/2"></div>
                            </div>

                            {/* Books Level */}
                            {expandedGrades.has(grade.id) && grade.books.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-6">
                                {grade.books.map((book, bookIndex) => (
                                  <div key={book.id} className="flex flex-col items-center space-y-4">
                                    {/* Book Node */}
                                    <div className="relative">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBook(book.id);
                                          }}
                                          className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                                        >
                                          {expandedBooks.has(book.id) ? 
                                            <ChevronDown size={12} className="text-gray-600" /> : 
                                            <ChevronRight size={12} className="text-gray-600" />
                                          }
                                        </button>
                                        <div
                                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                                          onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id])}
                                          onMouseEnter={(e) => handleMouseEnter(e, {
                                            title: book.name,
                                            learningObjectives: [],
                                            stats: `${book.units.length} units`
                                          })}
                                          onMouseLeave={handleMouseLeave}
                                        >
                                          <BookOpen size={14} />
                                          <div>
                                            <h6 className="font-medium text-xs">{book.name}</h6>
                                            <p className="text-green-100 text-xs">{book.units.length} units</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Connection line to parent */}
                                      <div className="absolute -top-4 left-1/2 w-px h-4 bg-gray-300 transform -translate-x-1/2"></div>
                                    </div>

                                    {/* Units Level */}
                                    {expandedBooks.has(book.id) && book.units.length > 0 && (
                                      <div className="flex flex-wrap justify-center gap-4">
                                        {book.units.map((unit, unitIndex) => (
                                          <div key={unit.id} className="flex flex-col items-center space-y-3">
                                            {/* Unit Node */}
                                            <div className="relative">
                                              <div className="flex items-center space-x-1">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleUnit(unit.id);
                                                  }}
                                                  className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                                                >
                                                  {expandedUnits.has(unit.id) ? 
                                                    <ChevronDown size={10} className="text-gray-600" /> : 
                                                    <ChevronRight size={10} className="text-gray-600" />
                                                  }
                                                </button>
                                                <div
                                                  className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                                                  onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id, 'unit', unit.id])}
                                                  onMouseEnter={(e) => handleMouseEnter(e, {
                                                    title: unit.name,
                                                    learningObjectives: unit.learningObjectives,
                                                    duration: unit.totalTime,
                                                    stats: `${unit.lessons.length} lessons`
                                                  })}
                                                  onMouseLeave={handleMouseLeave}
                                                >
                                                  <FileText size={12} />
                                                  <div>
                                                    <h6 className="font-medium text-xs">{unit.name}</h6>
                                                    <p className="text-orange-100 text-xs">{unit.lessons.length} lessons</p>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Connection line to parent */}
                                              <div className="absolute -top-3 left-1/2 w-px h-3 bg-gray-300 transform -translate-x-1/2"></div>
                                            </div>

                                            {/* Lessons Level */}
                                            {expandedUnits.has(unit.id) && unit.lessons.length > 0 && (
                                              <div className="flex flex-wrap justify-center gap-2">
                                                {unit.lessons.map((lesson, lessonIndex) => (
                                                  <div key={lesson.id} className="flex flex-col items-center space-y-2">
                                                    {/* Lesson Node */}
                                                    <div className="relative">
                                                      <div className="flex items-center space-x-1">
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleLesson(lesson.id);
                                                          }}
                                                          className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                                                        >
                                                          {expandedLessons.has(lesson.id) ? 
                                                            <ChevronDown size={8} className="text-gray-600" /> : 
                                                            <ChevronRight size={8} className="text-gray-600" />
                                                          }
                                                        </button>
                                                        <div
                                                          className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-2 py-1 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                                                          onClick={() => onSelectPath(['curriculum', curriculum.id, 'grade', grade.id, 'book', book.id, 'unit', unit.id, 'lesson', lesson.id])}
                                                          onMouseEnter={(e) => handleMouseEnter(e, {
                                                            title: lesson.name,
                                                            learningObjectives: lesson.learningObjectives,
                                                            duration: lesson.duration,
                                                            stats: `${lesson.stages.length} stages`
                                                          })}
                                                          onMouseLeave={handleMouseLeave}
                                                        >
                                                          <Play size={10} />
                                                          <div>
                                                            <h6 className="font-medium text-xs">{lesson.name}</h6>
                                                            <p className="text-purple-100 text-xs">{lesson.stages.length} stages</p>
                                                          </div>
                                                        </div>
                                                      </div>

                                                      {/* Connection line to parent */}
                                                      <div className="absolute -top-2 left-1/2 w-px h-2 bg-gray-300 transform -translate-x-1/2"></div>
                                                    </div>

                                                    {/* Stages Level */}
                                                    {expandedLessons.has(lesson.id) && lesson.stages.length > 0 && (
                                                      <div className="flex flex-wrap justify-center gap-1">
                                                        {lesson.stages.map((stage, stageIndex) => (
                                                          <div
                                                            key={stage.id}
                                                            className={`flex items-center space-x-1 px-1 py-1 rounded border cursor-pointer hover:shadow-sm transition-all duration-200 hover:scale-105 ${getStageColor(stage.name)}`}
                                                            onMouseEnter={(e) => handleMouseEnter(e, {
                                                              title: `${stage.name} Stage`,
                                                              learningObjectives: stage.learningObjectives,
                                                              duration: stage.duration,
                                                              stats: `${stage.activities.length} activities`
                                                            })}
                                                            onMouseLeave={handleMouseLeave}
                                                          >
                                                            {getStageIcon(stage.name)}
                                                            <span className="text-xs font-medium">{stage.name}</span>
                                                            <span className="text-xs opacity-75">({stage.activities.length})</span>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredItem && !isDragging && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm pointer-events-none"
          style={{
            left: Math.min(hoveredItem.x, window.innerWidth - 300),
            top: Math.min(hoveredItem.y, window.innerHeight - 200),
            transform: 'translateY(-50%)'
          }}
        >
          <h4 className="font-bold text-gray-800 mb-2 flex items-center space-x-2">
            <Target size={16} className="text-indigo-500" />
            <span>{hoveredItem.data.title}</span>
          </h4>
          
          {hoveredItem.data.duration && (
            <div className="mb-2 flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>{hoveredItem.data.duration}</span>
            </div>
          )}
          
          {hoveredItem.data.stats && (
            <div className="mb-2 text-sm text-gray-600">
              {hoveredItem.data.stats}
            </div>
          )}
          
          {hoveredItem.data.learningObjectives.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-700 text-sm mb-1">Learning Objectives:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                {hoveredItem.data.learningObjectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
                {hoveredItem.data.learningObjectives.length > 3 && (
                  <li className="text-gray-400 italic">+{hoveredItem.data.learningObjectives.length - 3} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Navigation Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-indigo-500 rounded">
              <BookOpen size={10} className="text-white" />
            </div>
            <span>Curriculums</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-blue-500 rounded">
              <GraduationCap size={10} className="text-white" />
            </div>
            <span>Grades</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-green-500 rounded">
              <BookOpen size={10} className="text-white" />
            </div>
            <span>Books</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-orange-500 rounded">
              <FileText size={10} className="text-white" />
            </div>
            <span>Units</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-purple-500 rounded">
              <Play size={10} className="text-white" />
            </div>
            <span>Lessons</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p><strong>Controls:</strong> Click chevrons to expand • Click items to navigate • Drag to pan • Scroll to zoom • Double-click names to edit</p>
        </div>
      </div>
    </div>
  );
}