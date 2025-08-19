import { useState, useEffect } from 'react';
import { CurriculumData, Curriculum, Grade, Book, Unit, Lesson, Stage, Activity } from '../types/curriculum';
import * as api from '../lib/api';

export function useCurriculumAPI() {
  const [data, setData] = useState<CurriculumData>({ curriculums: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all curriculum data
  const loadCurriculums = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getCurriculums();
      setData(response);
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
      const result = await api.createCurriculum({ name, description });
      await loadCurriculums();
      return result.id;
    } catch (err) {
      console.error('Error adding curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to add curriculum');
      return undefined;
    }
  };

  const updateCurriculum = async (curriculumId: string, updates: Partial<Curriculum>) => {
    try {
      await api.updateCurriculum(curriculumId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to update curriculum');
    }
  };

  const deleteCurriculum = async (curriculumId: string) => {
    try {
      await api.deleteCurriculum(curriculumId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting curriculum:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete curriculum');
    }
  };

  // Grade operations
  const addGrade = async (curriculumId: string, name: string) => {
    try {
      await api.createGrade({ curriculumId, name });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to add grade');
    }
  };

  const updateGrade = async (curriculumId: string, gradeId: string, updates: Partial<Grade>) => {
    try {
      await api.updateGrade(gradeId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to update grade');
    }
  };

  const deleteGrade = async (curriculumId: string, gradeId: string) => {
    try {
      await api.deleteGrade(gradeId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete grade');
    }
  };

  // Book operations
  const addBook = async (curriculumId: string, gradeId: string, name: string) => {
    try {
      await api.createBook({ gradeId, name });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err instanceof Error ? err.message : 'Failed to add book');
    }
  };

  const updateBook = async (curriculumId: string, gradeId: string, bookId: string, updates: Partial<Book>) => {
    try {
      await api.updateBook(bookId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to update book');
    }
  };

  const deleteBook = async (curriculumId: string, gradeId: string, bookId: string) => {
    try {
      await api.deleteBook(bookId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  // Unit operations
  const addUnit = async (curriculumId: string, gradeId: string, bookId: string, name: string) => {
    try {
      await api.createUnit({ bookId, name });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to add unit');
    }
  };

  const updateUnit = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, updates: Partial<Unit>) => {
    try {
      await api.updateUnit(unitId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    }
  };

  const deleteUnit = async (curriculumId: string, gradeId: string, bookId: string, unitId: string) => {
    try {
      await api.deleteUnit(unitId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete unit');
    }
  };

  // Lesson operations
  const addLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, name: string) => {
    try {
      await api.createLesson({ unitId, name });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to add lesson');
    }
  };

  const updateLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, updates: Partial<Lesson>) => {
    try {
      await api.updateLesson(lessonId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
    }
  };

  const deleteLesson = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string) => {
    try {
      await api.deleteLesson(lessonId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete lesson');
    }
  };

  // Stage operations
  const addStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, name: string) => {
    try {
      await api.createStage({ lessonId, name });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to add stage');
    }
  };

  const updateStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, updates: Partial<Stage>) => {
    try {
      await api.updateStage(stageId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stage');
    }
  };

  const deleteStage = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string) => {
    try {
      await api.deleteStage(stageId);
      await loadCurriculums();
    } catch (err) {
      console.error('Error deleting stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete stage');
    }
  };

  // Activity operations
  const addActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, name: string, type: string) => {
    try {
      await api.createActivity({ stageId, name, type });
      await loadCurriculums();
    } catch (err) {
      console.error('Error adding activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to add activity');
    }
  };

  const updateActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string, updates: Partial<Activity>) => {
    try {
      await api.updateActivity(activityId, updates);
      await loadCurriculums();
    } catch (err) {
      console.error('Error updating activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update activity');
    }
  };

  const deleteActivity = async (curriculumId: string, gradeId: string, bookId: string, unitId: string, lessonId: string, stageId: string, activityId: string) => {
    try {
      await api.deleteActivity(activityId);
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
