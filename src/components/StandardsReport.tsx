import React, { useState } from 'react';
import { BarChart3, Download, Filter, BookOpen, GraduationCap, FileText, Target } from 'lucide-react';
import { Curriculum, Standard, StandardCode } from '../types/curriculum';

interface StandardsReportProps {
  curriculums: Curriculum[];
}

interface StandardMapping {
  standardId: string;
  standardName: string;
  codeId: string;
  code: string;
  title: string;
  level: string;
  mappings: {
    curriculumId: string;
    curriculumName: string;
    gradeId: string;
    gradeName: string;
    bookId?: string;
    bookName?: string;
    unitId?: string;
    unitName?: string;
    lessonId?: string;
    lessonName?: string;
    stageId?: string;
    stageName?: string;
    activityId?: string;
    activityName?: string;
    elementType: 'grade' | 'book' | 'unit' | 'lesson' | 'stage' | 'activity';
  }[];
}

export function StandardsReport({ curriculums }: StandardsReportProps) {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');

  // Get all standards from all curriculums
  const getAllStandards = (): Standard[] => {
    const allStandards: Standard[] = [];
    curriculums.forEach(curriculum => {
      allStandards.push(...curriculum.standards);
    });
    return allStandards;
  };

  // Generate standards mapping report
  const generateStandardsMapping = (): StandardMapping[] => {
    const mappings: StandardMapping[] = [];
    const allStandards = getAllStandards();

    allStandards.forEach(standard => {
      standard.codes.forEach(code => {
        const mapping: StandardMapping = {
          standardId: standard.id,
          standardName: standard.name,
          codeId: code.id,
          code: code.code,
          title: code.title,
          level: code.level,
          mappings: []
        };

        // Search through all curriculum elements for this code
        curriculums.forEach(curriculum => {
          if (selectedCurriculum !== 'all' && curriculum.id !== selectedCurriculum) return;

          curriculum.grades.forEach(grade => {
            if (selectedGrade !== 'all' && grade.id !== selectedGrade) return;

            // Check grade level mappings
            if (grade.standardCodes?.includes(code.id)) {
              mapping.mappings.push({
                curriculumId: curriculum.id,
                curriculumName: curriculum.name,
                gradeId: grade.id,
                gradeName: grade.name,
                elementType: 'grade'
              });
            }

            grade.books.forEach(book => {
              // Check book level mappings
              if (book.standardCodes?.includes(code.id)) {
                mapping.mappings.push({
                  curriculumId: curriculum.id,
                  curriculumName: curriculum.name,
                  gradeId: grade.id,
                  gradeName: grade.name,
                  bookId: book.id,
                  bookName: book.name,
                  elementType: 'book'
                });
              }

              book.units.forEach(unit => {
                // Check unit level mappings
                if (unit.standardCodes?.includes(code.id)) {
                  mapping.mappings.push({
                    curriculumId: curriculum.id,
                    curriculumName: curriculum.name,
                    gradeId: grade.id,
                    gradeName: grade.name,
                    bookId: book.id,
                    bookName: book.name,
                    unitId: unit.id,
                    unitName: unit.name,
                    elementType: 'unit'
                  });
                }

                unit.lessons.forEach(lesson => {
                  // Check lesson level mappings
                  if (lesson.standardCodes?.includes(code.id)) {
                    mapping.mappings.push({
                      curriculumId: curriculum.id,
                      curriculumName: curriculum.name,
                      gradeId: grade.id,
                      gradeName: grade.name,
                      bookId: book.id,
                      bookName: book.name,
                      unitId: unit.id,
                      unitName: unit.name,
                      lessonId: lesson.id,
                      lessonName: lesson.name,
                      elementType: 'lesson'
                    });
                  }

                  lesson.stages.forEach(stage => {
                    // Check stage level mappings
                    if (stage.standardCodes?.includes(code.id)) {
                      mapping.mappings.push({
                        curriculumId: curriculum.id,
                        curriculumName: curriculum.name,
                        gradeId: grade.id,
                        gradeName: grade.name,
                        bookId: book.id,
                        bookName: book.name,
                        unitId: unit.id,
                        unitName: unit.name,
                        lessonId: lesson.id,
                        lessonName: lesson.name,
                        stageId: stage.id,
                        stageName: stage.name,
                        elementType: 'stage'
                      });
                    }

                    stage.activities.forEach(activity => {
                      // Check activity level mappings
                      if (activity.standardCodes?.includes(code.id)) {
                        mapping.mappings.push({
                          curriculumId: curriculum.id,
                          curriculumName: curriculum.name,
                          gradeId: grade.id,
                          gradeName: grade.name,
                          bookId: book.id,
                          bookName: book.name,
                          unitId: unit.id,
                          unitName: unit.name,
                          lessonId: lesson.id,
                          lessonName: lesson.name,
                          stageId: stage.id,
                          stageName: stage.name,
                          activityId: activity.id,
                          activityName: activity.name,
                          elementType: 'activity'
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });

        if (mapping.mappings.length > 0) {
          mappings.push(mapping);
        }
      });
    });

    return mappings.filter(mapping => {
      if (selectedStandard !== 'all' && mapping.standardId !== selectedStandard) return false;
      return true;
    });
  };

  const standardsMappings = generateStandardsMapping();
  const allStandards = getAllStandards();

  // Get available grades for selected curriculum
  const getAvailableGrades = () => {
    if (selectedCurriculum === 'all') {
      const allGrades: { id: string; name: string }[] = [];
      curriculums.forEach(curriculum => {
        curriculum.grades.forEach(grade => {
          if (!allGrades.find(g => g.id === grade.id)) {
            allGrades.push({ id: grade.id, name: grade.name });
          }
        });
      });
      return allGrades;
    } else {
      const curriculum = curriculums.find(c => c.id === selectedCurriculum);
      return curriculum ? curriculum.grades : [];
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'grade': return <GraduationCap size={14} className="text-blue-600" />;
      case 'book': return <BookOpen size={14} className="text-green-600" />;
      case 'unit': return <FileText size={14} className="text-orange-600" />;
      case 'lesson': return <Target size={14} className="text-purple-600" />;
      case 'stage': return <Target size={14} className="text-pink-600" />;
      case 'activity': return <Target size={14} className="text-indigo-600" />;
      default: return <Target size={14} className="text-gray-600" />;
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Standard',
      'Code',
      'Title',
      'Level',
      'Curriculum',
      'Grade',
      'Book',
      'Unit',
      'Lesson',
      'Stage',
      'Activity',
      'Element Type'
    ];

    const rows = standardsMappings.flatMap(mapping =>
      mapping.mappings.map(m => [
        mapping.standardName,
        mapping.code,
        mapping.title,
        mapping.level,
        m.curriculumName,
        m.gradeName,
        m.bookName || '',
        m.unitName || '',
        m.lessonName || '',
        m.stageName || '',
        m.activityName || '',
        m.elementType
      ])
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'standards-mapping-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Standards Mapping Report</h3>
            <p className="text-sm text-gray-600">View how standards are mapped across curriculum elements</p>
          </div>
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={standardsMappings.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h4 className="font-semibold text-gray-800">Filters</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
            <select
              value={selectedCurriculum}
              onChange={(e) => {
                setSelectedCurriculum(e.target.value);
                setSelectedGrade('all');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="all">All Curriculums</option>
              {curriculums.map(curriculum => (
                <option key={curriculum.id} value={curriculum.id}>{curriculum.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="all">All Grades</option>
              {getAvailableGrades().map(grade => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="all">All Standards</option>
              {allStandards.map(standard => (
                <option key={standard.id} value={standard.id}>{standard.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{allStandards.length}</p>
              <p className="text-sm text-gray-600">Total Standards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {allStandards.reduce((sum, standard) => sum + standard.codes.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Codes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{standardsMappings.length}</p>
              <p className="text-sm text-gray-600">Mapped Codes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {standardsMappings.reduce((sum, mapping) => sum + mapping.mappings.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Mappings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">Standards Mappings</h4>
          <p className="text-sm text-gray-600 mt-1">
            Showing {standardsMappings.length} mapped codes with {standardsMappings.reduce((sum, mapping) => sum + mapping.mappings.length, 0)} total mappings
          </p>
        </div>
        
        {standardsMappings.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No mappings found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or add standards mappings to curriculum elements</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Standard Code</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Mappings</th>
                </tr>
              </thead>
              <tbody>
                {standardsMappings.map(mapping => (
                  <tr key={`${mapping.standardId}-${mapping.codeId}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                          {mapping.code}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{mapping.standardName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">{mapping.title}</p>
                    </td>
                    <td className="py-4 px-6">
                      {mapping.level && (
                        <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                          {mapping.level}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        {mapping.mappings.map((m, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            {getElementIcon(m.elementType)}
                            <span className="text-gray-600">
                              {m.curriculumName} → {m.gradeName}
                              {m.bookName && ` → ${m.bookName}`}
                              {m.unitName && ` → ${m.unitName}`}
                              {m.lessonName && ` → ${m.lessonName}`}
                              {m.stageName && ` → ${m.stageName}`}
                              {m.activityName && ` → ${m.activityName}`}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                              {m.elementType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}