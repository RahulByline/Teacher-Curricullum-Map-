import React from 'react';
import { ChevronDown, ChevronRight, Plus, BookOpen, GraduationCap, Clock, FileText, Play, Users, Target, Zap, Book as BookIcon } from 'lucide-react';
import { Curriculum, Grade, Book as BookType, Unit, Lesson } from '../types/curriculum';

interface SidebarProps {
  curriculums: Curriculum[];
  selectedPath: string[];
  onSelectPath: (path: string[]) => void;
  expandedItems: Set<string>;
  onToggleExpanded: (path: string) => void;
}

export default function Sidebar({ curriculums, selectedPath, onSelectPath, expandedItems, onToggleExpanded }: SidebarProps) {
  const isExpanded = (path: string) => expandedItems.has(path);
  const isSelected = (path: string[]) => path.join('-') === selectedPath.join('-');

  const renderCurriculum = (curriculum: Curriculum) => {
    const curriculumPath = `curriculum-${curriculum.id}`;
    const curriculumExpanded = isExpanded(curriculumPath);
    const totalGrades = curriculum.grades.length;
    const totalBooks = curriculum.grades.reduce((sum, grade) => sum + grade.books.length, 0);
    const totalUnits = curriculum.grades.reduce((sum, grade) => 
      sum + grade.books.reduce((bookSum, book) => bookSum + book.units.length, 0), 0);
    const totalLessons = curriculum.grades.reduce((sum, grade) => 
      sum + grade.books.reduce((bookSum, book) => 
        bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0), 0);

    return (
      <div key={curriculum.id} className="mb-3">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-sm ${
            isSelected(['curriculum', curriculum.id]) ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm border-l-4 border-indigo-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onSelectPath(['curriculum', curriculum.id]);
            onToggleExpanded(curriculumPath);
          }}
        >
          <div className="flex items-center space-x-3">
            <button onClick={(e) => { e.stopPropagation(); onToggleExpanded(curriculumPath); }}>
              {curriculumExpanded ? <ChevronDown size={18} className="text-gray-600" /> : <ChevronRight size={18} className="text-gray-600" />}
            </button>
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <BookIcon size={18} className="text-white" />
            </div>
            <div>
              <span className="font-semibold text-lg">{curriculum.name}</span>
              <div className="text-xs text-gray-500 mt-1">
                {totalGrades} grades • {totalBooks} books • {totalUnits} units • {totalLessons} lessons
              </div>
            </div>
          </div>
        </div>

        {curriculumExpanded && (
          <div className="ml-6 mt-2 space-y-1">
            {curriculum.grades.map(grade => renderGrade(curriculum.id, grade))}
          </div>
        )}
      </div>
    );
  };

  const renderGrade = (curriculumId: string, grade: Grade) => {
    const gradePath = `curriculum-${curriculumId}-grade-${grade.id}`;
    const gradeExpanded = isExpanded(gradePath);
    const totalBooks = grade.books.length;
    const totalUnits = grade.books.reduce((sum, book) => sum + book.units.length, 0);
    const totalLessons = grade.books.reduce((sum, book) => 
      sum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0);

    return (
      <div key={grade.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${
            isSelected(['curriculum', curriculumId, 'grade', grade.id]) ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm border-l-4 border-blue-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onSelectPath(['curriculum', curriculumId, 'grade', grade.id]);
            onToggleExpanded(gradePath);
          }}
        >
          <div className="flex items-center space-x-3">
            <button onClick={(e) => { e.stopPropagation(); onToggleExpanded(gradePath); }}>
              {gradeExpanded ? <ChevronDown size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
            </button>
            <div className="p-2 bg-blue-500 rounded-lg">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <span className="font-medium text-base">{grade.name}</span>
              <div className="text-xs text-gray-500 mt-1">
                {totalBooks} books • {totalUnits} units • {totalLessons} lessons
              </div>
            </div>
          </div>
        </div>

        {gradeExpanded && (
          <div className="ml-6 mt-2 space-y-1">
            {grade.books.map(book => renderBook(curriculumId, grade.id, book))}
          </div>
        )}
      </div>
    );
  };

  const renderBook = (curriculumId: string, gradeId: string, book: BookType) => {
    const bookPath = `curriculum-${curriculumId}-grade-${gradeId}-book-${book.id}`;
    const bookExpanded = isExpanded(bookPath);
    const totalUnits = book.units.length;
    const totalLessons = book.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
    const totalActivities = book.units.reduce((sum, unit) => 
      sum + unit.lessons.reduce((lessonSum, lesson) => 
        lessonSum + lesson.stages.reduce((stageSum, stage) => stageSum + stage.activities.length, 0), 0), 0);

    return (
      <div key={book.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-sm ${
            isSelected(['curriculum', curriculumId, 'grade', gradeId, 'book', book.id]) ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm border-l-4 border-green-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', book.id]);
            onToggleExpanded(bookPath);
          }}
        >
          <div className="flex items-center space-x-3">
            <button onClick={(e) => { e.stopPropagation(); onToggleExpanded(bookPath); }}>
              {bookExpanded ? <ChevronDown size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
            </button>
            <div className="p-2 bg-green-500 rounded-lg">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <span className="font-medium text-base">{book.name}</span>
              <div className="text-xs text-gray-500 mt-1">
                {totalUnits} units • {totalLessons} lessons • {totalActivities} activities
              </div>
            </div>
          </div>
        </div>

        {bookExpanded && (
          <div className="ml-6 mt-2 space-y-1">
            {book.units.map(unit => renderUnit(curriculumId, gradeId, book.id, unit))}
          </div>
        )}
      </div>
    );
  };

  const renderUnit = (curriculumId: string, gradeId: string, bookId: string, unit: Unit) => {
    const unitPath = `curriculum-${curriculumId}-grade-${gradeId}-book-${bookId}-unit-${unit.id}`;
    const unitExpanded = isExpanded(unitPath);
    const totalLessons = unit.lessons.length;
    const totalStages = unit.lessons.reduce((sum, lesson) => sum + lesson.stages.length, 0);
    const totalActivities = unit.lessons.reduce((sum, lesson) => 
      sum + lesson.stages.reduce((stageSum, stage) => stageSum + stage.activities.length, 0), 0);

    return (
      <div key={unit.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm ${
            isSelected(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unit.id]) ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 shadow-sm border-l-4 border-orange-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unit.id]);
            onToggleExpanded(unitPath);
          }}
        >
          <div className="flex items-center space-x-3">
            <button onClick={(e) => { e.stopPropagation(); onToggleExpanded(unitPath); }}>
              {unitExpanded ? <ChevronDown size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
            </button>
            <div className="p-2 bg-orange-500 rounded-lg">
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <span className="font-medium text-base">{unit.name}</span>
              <div className="text-xs text-gray-500 mt-1">
                {totalLessons} lessons • {totalStages} stages • {totalActivities} activities
                {unit.totalTime && <span> • {unit.totalTime}</span>}
              </div>
            </div>
          </div>
        </div>

        {unitExpanded && (
          <div className="ml-6 mt-2 space-y-1">
            {unit.lessons.map(lesson => renderLesson(curriculumId, gradeId, bookId, unit.id, lesson))}
          </div>
        )}
      </div>
    );
  };

  const renderLesson = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lesson: Lesson) => {
    const totalStages = lesson.stages.length;
    const totalActivities = lesson.stages.reduce((sum, stage) => sum + stage.activities.length, 0);
    const stageTypes = lesson.stages.map(stage => stage.name).join(', ');

    return (
      <div key={lesson.id} className="mb-2">
        <div
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:shadow-sm ${
            isSelected(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unitId, 'lesson', lesson.id]) ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 shadow-sm border-l-4 border-purple-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectPath(['curriculum', curriculumId, 'grade', gradeId, 'book', bookId, 'unit', unitId, 'lesson', lesson.id])}
        >
          <div className="p-2 bg-purple-500 rounded-lg">
            <Play size={14} className="text-white" />
          </div>
          <div>
            <span className="font-medium text-base">{lesson.name}</span>
            <div className="text-xs text-gray-500 mt-1">
              {totalStages} stages • {totalActivities} activities
              {lesson.duration && <span> • {lesson.duration}</span>}
              {stageTypes && <span> • {stageTypes}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 overflow-y-auto shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 
            className="text-xl font-bold text-gray-800 flex items-center space-x-2 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => onSelectPath([])}
            title="Go to Home"
          >
            <div className="p-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
              <Target size={20} className="text-white" />
            </div>
            <span>Curriculum Manager</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">Manage your educational content</p>
        </div>
      </div>

      <div className="space-y-3">
        {curriculums.map(renderCurriculum)}
      </div>
      
      {curriculums.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No curriculums added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "New Curriculum" to get started</p>
        </div>
      )}
    </div>
  );
}