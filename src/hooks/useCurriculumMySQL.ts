import { useState, useEffect } from 'react';
import { mysqlPool, isMySQLConfigured, generateUUID, parseJSONArray, stringifyArray } from '../lib/mysql';
import { CurriculumData, Curriculum, Grade, Book, Unit, Lesson, Stage, Activity } from '../types/curriculum';

export function useCurriculumMySQL() {
  const [data, setData] = useState<CurriculumData>({ curriculums: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all curriculum data
  const loadCurriculums = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if MySQL is configured
      if (!isMySQLConfigured || !mysqlPool) {
        setError('Missing MySQL environment variables. Please configure your MySQL connection.');
        return;
      }

      // Load all data with relationships
      const [curriculumsData] = await mysqlPool.execute(
        'SELECT * FROM curriculums ORDER BY created_at ASC'
      );

      const [gradesData] = await mysqlPool.execute(
        'SELECT * FROM grades ORDER BY created_at ASC'
      );

      const [booksData] = await mysqlPool.execute(
        'SELECT * FROM books ORDER BY created_at ASC'
      );

      const [unitsData] = await mysqlPool.execute(
        'SELECT * FROM units ORDER BY created_at ASC'
      );

      const [lessonsData] = await mysqlPool.execute(
        'SELECT * FROM lessons ORDER BY created_at ASC'
      );

      const [stagesData] = await mysqlPool.execute(
        'SELECT * FROM stages ORDER BY created_at ASC'
      );

      const [activitiesData] = await mysqlPool.execute(
        'SELECT * FROM activities ORDER BY created_at ASC'
      );

      // Build nested structure
      const curriculums: Curriculum[] = (curriculumsData as any[]).map(curriculum => ({
        id: curriculum.id,
        name: curriculum.name,
        description: curriculum.description,
        standards: [],
        grades: (gradesData as any[])
          .filter(grade => grade.curriculum_id === curriculum.id)
          .map(grade => ({
            id: grade.id,
            name: grade.name,
            books: (booksData as any[])
              .filter(book => book.grade_id === grade.id)
              .map(book => ({
                id: book.id,
                name: book.name,
                units: (unitsData as any[])
                  .filter(unit => unit.book_id === book.id)
                  .map(unit => ({
                    id: unit.id,
                    name: unit.name,
                    learningObjectives: parseJSONArray(unit.learning_objectives),
                    totalTime: unit.total_time,
                    lessons: (lessonsData as any[])
                      .filter(lesson => lesson.unit_id === unit.id)
                      .map(lesson => ({
                        id: lesson.id,
                        name: lesson.name,
                        learningObjectives: parseJSONArray(lesson.learning_objectives),
                        duration: lesson.duration,
                        standardCodes: [],
                        stages: (stagesData as any[])
                          .filter(stage => stage.lesson_id === lesson.id)
                          .map(stage => ({
                            id: stage.id,
                            name: stage.name,
                            learningObjectives: parseJSONArray(stage.learning_objectives),
                            duration: stage.duration,
                            activities: (activitiesData as any[])
                              .filter(activity => activity.stage_id === stage.id)
                              .map(activity => ({
                                id: activity.id,
                                name: activity.name,
                                type: activity.type,
                                learningObjectives: parseJSONArray(activity.learning_objectives),
                                duration: activity.duration,
                                standardCodes: []
                              }))
                          }))
                      }))
                  }))
              }))
          }))
      }));

      setData({ curriculums });
    } catch (err) {
      console.error('Error loading curriculum data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load curriculum data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadCurriculums();
  }, []);

  // Curriculum operations
  const addCurriculum = async (name: string, description?: string): Promise<string | undefined> => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO curriculums (id, name, description) VALUES (?, ?, ?)',
        [id, name, description || '']
      );
      await loadCurriculums();
      return id;
    } catch (err) {
      console.error('Error adding curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to add curriculum');
      return undefined;
    }
  };

  const updateCurriculum = async (curriculumId: string, updates: Partial<Curriculum>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(updates.description);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(curriculumId);
        
        await mysqlPool!.execute(
          `UPDATE curriculums SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to update curriculum');
    }
  };

  const deleteCurriculum = async (curriculumId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM curriculums WHERE id = ?', [curriculumId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete curriculum');
    }
  };

  // Grade operations
  const addGrade = async (curriculumId: string, name: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO grades (id, curriculum_id, name) VALUES (?, ?, ?)',
        [id, curriculumId, name]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to add grade');
    }
  };

  const updateGrade = async (curriculumId: string, gradeId: string, updates: Partial<Grade>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(gradeId);
        
        await mysqlPool!.execute(
          `UPDATE grades SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to update grade');
    }
  };

  const deleteGrade = async (curriculumId: string, gradeId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM grades WHERE id = ?', [gradeId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete grade');
    }
  };

  // Book operations
  const addBook = async (curriculumId: string, gradeId: string, name: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO books (id, grade_id, name) VALUES (?, ?, ?)',
        [id, gradeId, name]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err instanceof Error ? err.message : 'Failed to add book');
    }
  };

  const updateBook = async (curriculumId: string, gradeId: string, bookId: string, updates: Partial<Book>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(bookId);
        
        await mysqlPool!.execute(
          `UPDATE books SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to update book');
    }
  };

  const deleteBook = async (curriculumId: string, gradeId: string, bookId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM books WHERE id = ?', [bookId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  // Unit operations
  const addUnit = async (curriculumId: string, gradeId: string, bookId: string, name: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO units (id, book_id, name) VALUES (?, ?, ?)',
        [id, bookId, name]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to add unit');
    }
  };

  const updateUnit = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, updates: Partial<Unit>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      if (updates.learningObjectives !== undefined) {
        updateFields.push('learning_objectives = ?');
        updateValues.push(stringifyArray(updates.learningObjectives));
      }
      if (updates.totalTime !== undefined) {
        updateFields.push('total_time = ?');
        updateValues.push(updates.totalTime);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(unitId);
        
        await mysqlPool!.execute(
          `UPDATE units SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    }
  };

  const deleteUnit = async (curriculumId: string, gradeId: string, bookId: string, unitId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM units WHERE id = ?', [unitId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete unit');
    }
  };

  // Lesson operations
  const addLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, name: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO lessons (id, unit_id, name) VALUES (?, ?, ?)',
        [id, unitId, name]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to add lesson');
    }
  };

  const updateLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, updates: Partial<Lesson>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      if (updates.learningObjectives !== undefined) {
        updateFields.push('learning_objectives = ?');
        updateValues.push(stringifyArray(updates.learningObjectives));
      }
      if (updates.duration !== undefined) {
        updateFields.push('duration = ?');
        updateValues.push(updates.duration);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(lessonId);
        
        await mysqlPool!.execute(
          `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
    }
  };

  const deleteLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM lessons WHERE id = ?', [lessonId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete lesson');
    }
  };

  // Stage operations
  const addStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, name: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO stages (id, lesson_id, name) VALUES (?, ?, ?)',
        [id, lessonId, name]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to add stage');
    }
  };

  const updateStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, updates: Partial<Stage>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      if (updates.learningObjectives !== undefined) {
        updateFields.push('learning_objectives = ?');
        updateValues.push(stringifyArray(updates.learningObjectives));
      }
      if (updates.duration !== undefined) {
        updateFields.push('duration = ?');
        updateValues.push(updates.duration);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(stageId);
        
        await mysqlPool!.execute(
          `UPDATE stages SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stage');
    }
  };

  const deleteStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM stages WHERE id = ?', [stageId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete stage');
    }
  };

  // Activity operations
  const addActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, name: string, type: string) => {
    try {
      const id = generateUUID();
      await mysqlPool!.execute(
        'INSERT INTO activities (id, stage_id, name, type) VALUES (?, ?, ?, ?)',
        [id, stageId, name, type]
      );
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to add activity');
    }
  };

  const updateActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string, updates: Partial<Activity>) => {
    try {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(updates.name);
      }
      if (updates.type !== undefined) {
        updateFields.push('type = ?');
        updateValues.push(updates.type);
      }
      if (updates.learningObjectives !== undefined) {
        updateFields.push('learning_objectives = ?');
        updateValues.push(stringifyArray(updates.learningObjectives));
      }
      if (updates.duration !== undefined) {
        updateFields.push('duration = ?');
        updateValues.push(updates.duration);
      }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        updateValues.push(activityId);
        
        await mysqlPool!.execute(
          `UPDATE activities SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        await loadCurriculums();
      }
    } catch (err) {
      console.error('Error updating activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update activity');
    }
  };

  const deleteActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string) => {
    try {
      await mysqlPool!.execute('DELETE FROM activities WHERE id = ?', [activityId]);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
    }
  };

  return {
    data,
    loading,
    error,
    loadCurriculums,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
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
    deleteActivity,
  };
}
