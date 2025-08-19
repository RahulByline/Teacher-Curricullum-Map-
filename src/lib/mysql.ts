import mysql from 'mysql2/promise';

// MySQL Configuration
const mysqlConfig = {
  host: import.meta.env.VITE_MYSQL_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_MYSQL_PORT || '3306'),
  user: import.meta.env.VITE_MYSQL_USER || 'root',
  password: import.meta.env.VITE_MYSQL_PASSWORD || '',
  database: import.meta.env.VITE_MYSQL_DATABASE || 'curriculum_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Check if MySQL is configured
export const isMySQLConfigured = !!(
  mysqlConfig.host && 
  mysqlConfig.user && 
  mysqlConfig.database
);

// Create connection pool
export const mysqlPool = isMySQLConfigured 
  ? mysql.createPool(mysqlConfig)
  : null;

// Database types (same as before for compatibility)
export interface Database {
  public: {
    Tables: {
      curriculums: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
      grades: {
        Row: {
          id: string;
          curriculum_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          curriculum_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          curriculum_id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          grade_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          grade_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          grade_id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          book_id: string;
          name: string;
          learning_objectives: string;
          total_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          name: string;
          learning_objectives?: string;
          total_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          name?: string;
          learning_objectives?: string;
          total_time?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          unit_id: string;
          name: string;
          learning_objectives: string;
          duration: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          name: string;
          learning_objectives?: string;
          duration?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string;
          name?: string;
          learning_objectives?: string;
          duration?: string;
          updated_at?: string;
        };
      };
      stages: {
        Row: {
          id: string;
          lesson_id: string;
          name: string;
          learning_objectives: string;
          duration: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          name: string;
          learning_objectives?: string;
          duration?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          name?: string;
          learning_objectives?: string;
          duration?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          stage_id: string;
          name: string;
          type: string;
          learning_objectives: string;
          duration: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stage_id: string;
          name: string;
          type: string;
          learning_objectives?: string;
          duration?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stage_id?: string;
          name?: string;
          type?: string;
          learning_objectives?: string;
          duration?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Helper function to generate UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to parse JSON arrays from MySQL
export const parseJSONArray = (jsonString: string | null): string[] => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

// Helper function to stringify arrays for MySQL
export const stringifyArray = (array: string[]): string => {
  return JSON.stringify(array);
};
