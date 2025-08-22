export interface StandardCode {
  id: string;
  code: string;
  title: string;
  description: string;
  level: string;
}

export interface Standard {
  id: string;
  name: string;
  description?: string;
  codes: StandardCode[];
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  learningObjectives: string[];
  duration: string;
  standardCodes?: string[]; // Array of standard code IDs
}

export interface ActivityType {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
}

export interface Stage {
  id: string;
  name: string;
  activities: Activity[];
  learningObjectives: string[];
  duration: string;
  standardCodes?: string[]; // Array of standard code IDs
}

export interface Lesson {
  id: string;
  name: string;
  learningObjectives: string[];
  duration: string;
  stages: Stage[];
  standardCodes?: string[]; // Array of standard code IDs
}

export interface Unit {
  id: string;
  name: string;
  learningObjectives: string[];
  totalTime: string;
  lessons: Lesson[];
  standardCodes?: string[]; // Array of standard code IDs
}

export interface Book {
  id: string;
  name: string;
  learningObjectives: string[];
  duration: string;
  units: Unit[];
  standardCodes?: string[]; // Array of standard code IDs
}

export interface Grade {
  id: string;
  name: string;
  learningObjectives: string[];
  duration: string;
  books: Book[];
  standardCodes?: string[]; // Array of standard code IDs
}

export interface Curriculum {
  id: string;
  name: string;
  description?: string;
  grades: Grade[];
  standards?: Standard[];
  activityTypes?: ActivityType[];
}

export interface CurriculumData {
  curriculums: Curriculum[];
}