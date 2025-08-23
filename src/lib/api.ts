// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://teacherportal.bylinelms.com/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }
}

// Health check
export const checkHealth = () => apiRequest<{ status: string; message: string }>('/health');

// Curriculum operations
export const getCurriculums = () => apiRequest<{ curriculums: any[] }>('/curriculums');

export const createCurriculum = (data: { name: string; description?: string }) =>
  apiRequest('/curriculums', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCurriculum = (id: string, data: { name?: string; description?: string }) =>
  apiRequest(`/curriculums/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteCurriculum = (id: string) =>
  apiRequest(`/curriculums/${id}`, {
    method: 'DELETE',
  });

// Grade operations
export const createGrade = (data: { curriculumId: string; name: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateGrade = (id: string, data: { name?: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteGrade = (id: string) =>
  apiRequest(`/grades/${id}`, {
    method: 'DELETE',
  });

// Book operations
export const createBook = (data: { gradeId: string; name: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateBook = (id: string, data: { name?: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteBook = (id: string) =>
  apiRequest(`/books/${id}`, {
    method: 'DELETE',
  });

// Unit operations
export const createUnit = (data: { bookId: string; name: string; learningObjectives?: string[]; totalTime?: string }) =>
  apiRequest('/units', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateUnit = (id: string, data: { name?: string; learningObjectives?: string[]; totalTime?: string }) =>
  apiRequest(`/units/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteUnit = (id: string) =>
  apiRequest(`/units/${id}`, {
    method: 'DELETE',
  });

// Lesson operations
export const createLesson = (data: { unitId: string; name: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest('/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateLesson = (id: string, data: { name?: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest(`/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteLesson = (id: string) =>
  apiRequest(`/lessons/${id}`, {
    method: 'DELETE',
  });

// Stage operations
export const createStage = (data: { lessonId: string; name: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest('/stages', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateStage = (id: string, data: { name?: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest(`/stages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteStage = (id: string) =>
  apiRequest(`/stages/${id}`, {
    method: 'DELETE',
  });

// Activity operations
export const createActivity = (data: { stageId: string; name: string; type: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateActivity = (id: string, data: { name?: string; type?: string; learningObjectives?: string[]; duration?: string }) =>
  apiRequest(`/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteActivity = (id: string) =>
  apiRequest(`/activities/${id}`, {
    method: 'DELETE',
  });

// Curriculum upload
export const uploadCurriculum = (data: { curriculums: any[] }) =>
  apiRequest('/curriculum/upload', {
    method: 'POST',
    body: JSON.stringify(data),
  });
