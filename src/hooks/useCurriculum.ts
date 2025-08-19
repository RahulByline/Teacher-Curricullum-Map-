import { useState } from 'react';
import { useEffect } from 'react';
import { CurriculumData, Curriculum, Grade, Book, Unit, Lesson, Stage, Activity, Standard, StandardCode, ActivityType } from '../types/curriculum';

const STORAGE_KEY = 'curriculum-manager-data';

const initialData: CurriculumData = {
  curriculums: [
    {
      id: 'kg-curriculum',
      name: 'KG Curriculum',
      description: 'Kindergarten educational program',
      standards: [
        {
          id: 'iste-standards',
          name: 'ISTE Standards',
          description: 'International Society for Technology in Education Standards',
          codes: [
            {
              id: 'iste-1-1-1',
              code: '1.1.1',
              title: 'Empowered Learner - Articulate Goals',
              description: 'Students articulate personal learning goals, develop strategies leveraging technology to achieve them, and reflect on the learning process itself to improve learning outcomes.',
              level: 'K-2'
            },
            {
              id: 'iste-1-2-1',
              code: '1.2.1',
              title: 'Digital Citizen - Cultivate Identity',
              description: 'Students cultivate and manage their digital identity and reputation and are aware of the permanence of their actions in the digital world.',
              level: 'K-2'
            }
          ]
        }
      ],
      activityTypes: [
        {
          id: 'movement-activity',
          name: 'Movement Activity',
          description: 'Physical activities that involve body movement',
          color: 'bg-pink-100 text-pink-800',
          icon: 'Zap'
        },
        {
          id: 'visual-learning',
          name: 'Visual Learning',
          description: 'Activities that use visual aids and materials',
          color: 'bg-blue-100 text-blue-800',
          icon: 'Eye'
        },
        {
          id: 'hands-on-activity',
          name: 'Hands-on Activity',
          description: 'Interactive activities with physical manipulation',
          color: 'bg-green-100 text-green-800',
          icon: 'Hand'
        },
        {
          id: 'reflection-activity',
          name: 'Reflection Activity',
          description: 'Activities focused on thinking and reflection',
          color: 'bg-purple-100 text-purple-800',
          icon: 'Brain'
        },
        {
          id: 'group-activity',
          name: 'Group Activity',
          description: 'Collaborative activities done in groups',
          color: 'bg-orange-100 text-orange-800',
          icon: 'Users'
        }
      ],
      grades: [
        {
          id: 'kg1',
          name: 'KG 1',
          books: [
            {
              id: 'book3',
              name: 'Seasons and Weather - Book 3',
              units: [
                {
                  id: 'unit1',
                  name: 'Unit 1',
                  learningObjectives: ['Identify different seasons', 'Understand weather patterns'],
                  totalTime: '4 weeks',
                  lessons: [
                    {
                      id: 'lesson1',
                      name: 'Lesson 1',
                      learningObjectives: ['Recognize seasonal changes', 'Name weather conditions'],
                      duration: '45 minutes',
                      stages: [
                        {
                          id: 'play1',
                          name: 'Play',
                          activities: [
                            {
                              id: 'activity1',
                              name: 'Weather Dance',
                              type: 'Movement Activity',
                              learningObjectives: ['Express weather through movement'],
                              duration: '10 minutes'
                            }
                          ],
                          learningObjectives: ['Engage with weather concepts through play'],
                          duration: '15 minutes'
                        },
                        {
                          id: 'lead1',
                          name: 'Lead',
                          activities: [
                            {
                              id: 'activity2',
                              name: 'Weather Chart',
                              type: 'Visual Learning',
                              learningObjectives: ['Identify weather symbols'],
                              duration: '15 minutes'
                            }
                          ],
                          learningObjectives: ['Learn weather vocabulary'],
                          duration: '15 minutes'
                        },
                        {
                          id: 'apply1',
                          name: 'Apply',
                          activities: [
                            {
                              id: 'activity3',
                              name: 'Weather Matching',
                              type: 'Hands-on Activity',
                              learningObjectives: ['Match weather to seasons'],
                              duration: '10 minutes'
                            }
                          ],
                          learningObjectives: ['Apply weather knowledge'],
                          duration: '10 minutes'
                        },
                        {
                          id: 'yield1',
                          name: 'Yield',
                          activities: [
                            {
                              id: 'activity4',
                              name: 'Weather Journal',
                              type: 'Reflection Activity',
                              learningObjectives: ['Reflect on weather learning'],
                              duration: '5 minutes'
                            }
                          ],
                          learningObjectives: ['Consolidate weather understanding'],
                          duration: '5 minutes'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function useCurriculum() {
  const [data, setData] = useState<CurriculumData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Ensure the data has the correct structure
        if (parsedData && parsedData.curriculums && Array.isArray(parsedData.curriculums)) {
          // Ensure each curriculum has standards array
          const updatedData = {
            ...parsedData,
            curriculums: parsedData.curriculums.map((curriculum: any) => ({
              ...curriculum,
              standards: curriculum.standards || [],
              activityTypes: curriculum.activityTypes || []
            }))
          };
          return updatedData;
        }
      }
    } catch (error) {
      console.error('Error loading curriculum data from localStorage:', error);
    }
    return initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving curriculum data to localStorage:', error);
    }
  }, [data]);

  const generateId = () => Date.now().toString();

  // Activity Types operations
  const addActivityType = (curriculumId: string, name: string, description?: string, color?: string, icon?: string) => {
    const newActivityType: ActivityType = {
      id: generateId(),
      name,
      description,
      color: color || 'bg-gray-100 text-gray-800',
      icon: icon || 'Target'
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? { ...curriculum, activityTypes: [...(curriculum.activityTypes || []), newActivityType] }
          : curriculum
      )
    }));
  };

  const updateActivityType = (curriculumId: string, activityTypeId: string, updates: Partial<ActivityType>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              activityTypes: (curriculum.activityTypes || []).map(activityType =>
                activityType.id === activityTypeId ? { ...activityType, ...updates } : activityType
              )
            }
          : curriculum
      )
    }));
  };

  const deleteActivityType = (curriculumId: string, activityTypeId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              activityTypes: (curriculum.activityTypes || []).filter(activityType => activityType.id !== activityTypeId)
            }
          : curriculum
      )
    }));
  };

  // Standards operations
  const addStandard = (curriculumId: string, name: string, description?: string) => {
    const newStandard: Standard = {
      id: generateId(),
      name,
      description,
      codes: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? { ...curriculum, standards: [...(curriculum.standards || []), newStandard] }
          : curriculum
      )
    }));
  };

  const updateStandard = (curriculumId: string, standardId: string, updates: Partial<Standard>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              standards: (curriculum.standards || []).map(standard =>
                standard.id === standardId ? { ...standard, ...updates } : standard
              )
            }
          : curriculum
      )
    }));
  };

  const deleteStandard = (curriculumId: string, standardId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              standards: (curriculum.standards || []).filter(standard => standard.id !== standardId)
            }
          : curriculum
      )
    }));
  };

  const addStandardCode = (curriculumId: string, standardId: string, code: Omit<StandardCode, 'id'>) => {
    const newCode: StandardCode = {
      id: generateId(),
      ...code
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              standards: (curriculum.standards || []).map(standard =>
                standard.id === standardId
                  ? { ...standard, codes: [...standard.codes, newCode] }
                  : standard
              )
            }
          : curriculum
      )
    }));
  };

  const updateStandardCode = (curriculumId: string, standardId: string, codeId: string, updates: Partial<StandardCode>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              standards: (curriculum.standards || []).map(standard =>
                standard.id === standardId
                  ? {
                      ...standard,
                      codes: standard.codes.map(code =>
                        code.id === codeId ? { ...code, ...updates } : code
                      )
                    }
                  : standard
              )
            }
          : curriculum
      )
    }));
  };

  const deleteStandardCode = (curriculumId: string, standardId: string, codeId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              standards: (curriculum.standards || []).map(standard =>
                standard.id === standardId
                  ? { ...standard, codes: standard.codes.filter(code => code.id !== codeId) }
                  : standard
              )
            }
          : curriculum
      )
    }));
  };

  // Curriculum operations
  const addCurriculum = (name: string, description?: string) => {
    const newCurriculum: Curriculum = {
      id: generateId(),
      name,
      description,
      grades: [],
      standards: []
    };
    setData(prev => ({
      ...prev,
      curriculums: [...prev.curriculums, newCurriculum]
    }));
  };

  const updateCurriculum = (curriculumId: string, updates: Partial<Curriculum>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId ? { ...curriculum, ...updates } : curriculum
      )
    }));
  };

  const deleteCurriculum = (curriculumId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.filter(curriculum => curriculum.id !== curriculumId)
    }));
  };

  // Grade operations
  const addGrade = (curriculumId: string, name: string) => {
    const newGrade: Grade = {
      id: generateId(),
      name,
      books: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? { ...curriculum, grades: [...curriculum.grades, newGrade] }
          : curriculum
      )
    }));
  };

  const updateGrade = (curriculumId: string, gradeId: string, updates: Partial<Grade>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId ? { ...grade, ...updates } : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteGrade = (curriculumId: string, gradeId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.filter(grade => grade.id !== gradeId)
            }
          : curriculum
      )
    }));
  };

  // Book operations
  const addBook = (curriculumId: string, gradeId: string, name: string) => {
    const newBook: Book = {
      id: generateId(),
      name,
      units: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? { ...grade, books: [...grade.books, newBook] }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const updateBook = (curriculumId: string, gradeId: string, bookId: string, updates: Partial<Book>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId ? { ...book, ...updates } : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteBook = (curriculumId: string, gradeId: string, bookId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.filter(book => book.id !== bookId)
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  // Unit operations
  const addUnit = (curriculumId: string, gradeId: string, bookId: string, name: string) => {
    const newUnit: Unit = {
      id: generateId(),
      name,
      learningObjectives: [],
      totalTime: '',
      lessons: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? { ...book, units: [...book.units, newUnit] }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const updateUnit = (curriculumId: string, gradeId: string, bookId: string, unitId: string, updates: Partial<Unit>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId ? { ...unit, ...updates } : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteUnit = (curriculumId: string, gradeId: string, bookId: string, unitId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? { ...book, units: book.units.filter(unit => unit.id !== unitId) }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  // Lesson operations
  const addLesson = (curriculumId: string, gradeId: string, bookId: string, unitId: string, name: string) => {
    const newLesson: Lesson = {
      id: generateId(),
      name,
      learningObjectives: [],
      duration: '',
      stages: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? { ...unit, lessons: [...unit.lessons, newLesson] }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const updateLesson = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, updates: Partial<Lesson>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteLesson = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? { ...unit, lessons: unit.lessons.filter(lesson => lesson.id !== lessonId) }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  // Stage operations
  const addStage = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageName: string) => {
    const newStage: Stage = {
      id: generateId(),
      name: stageName,
      learningObjectives: [],
      duration: '',
      activities: []
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? { ...lesson, stages: [...lesson.stages, newStage] }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const updateStage = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, updates: Partial<Stage>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? {
                                              ...lesson,
                                              stages: lesson.stages.map(stage =>
                                                stage.id === stageId ? { ...stage, ...updates } : stage
                                              )
                                            }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteStage = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? { ...lesson, stages: lesson.stages.filter(stage => stage.id !== stageId) }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  // Activity operations
  const addActivity = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, name: string, type: string) => {
    const newActivity: Activity = {
      id: generateId(),
      name,
      type,
      learningObjectives: [],
      duration: ''
    };
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? {
                                              ...lesson,
                                              stages: lesson.stages.map(stage =>
                                                stage.id === stageId
                                                  ? { ...stage, activities: [...stage.activities, newActivity] }
                                                  : stage
                                              )
                                            }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const updateActivity = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string, updates: Partial<Activity>) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? {
                                              ...lesson,
                                              stages: lesson.stages.map(stage =>
                                                stage.id === stageId
                                                  ? {
                                                      ...stage,
                                                      activities: stage.activities.map(activity =>
                                                        activity.id === activityId ? { ...activity, ...updates } : activity
                                                      )
                                                    }
                                                  : stage
                                              )
                                            }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  const deleteActivity = (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string) => {
    setData(prev => ({
      ...prev,
      curriculums: prev.curriculums.map(curriculum =>
        curriculum.id === curriculumId
          ? {
              ...curriculum,
              grades: curriculum.grades.map(grade =>
                grade.id === gradeId
                  ? {
                      ...grade,
                      books: grade.books.map(book =>
                        book.id === bookId
                          ? {
                              ...book,
                              units: book.units.map(unit =>
                                unit.id === unitId
                                  ? {
                                      ...unit,
                                      lessons: unit.lessons.map(lesson =>
                                        lesson.id === lessonId
                                          ? {
                                              ...lesson,
                                              stages: lesson.stages.map(stage =>
                                                stage.id === stageId
                                                  ? { ...stage, activities: stage.activities.filter(activity => activity.id !== activityId) }
                                                  : stage
                                              )
                                            }
                                          : lesson
                                      )
                                    }
                                  : unit
                              )
                            }
                          : book
                      )
                    }
                  : grade
              )
            }
          : curriculum
      )
    }));
  };

  return {
    data,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
    addActivityType,
    updateActivityType,
    deleteActivityType,
    addStandard,
    updateStandard,
    deleteStandard,
    addStandardCode,
    updateStandardCode,
    deleteStandardCode,
    addGrade,
    updateGrade,
    deleteGrade,
    addBook,
    updateBook,
    deleteBook,
    addUnit,
    updateUnit,
    deleteUnit,
    addLesson,
    updateLesson,
    deleteLesson,
    addStage,
    updateStage,
    deleteStage,
    addActivity,
    updateActivity,
    deleteActivity
  };
}