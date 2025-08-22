-- Comprehensive database schema fix
USE curriculum_db;

-- Drop existing tables if they exist (this will recreate them with correct schema)
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS stages;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS curriculums;

-- Create curriculums table (without learning objectives and duration)
CREATE TABLE curriculums (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create grades table (with learning objectives and duration)
CREATE TABLE grades (
  id VARCHAR(36) PRIMARY KEY,
  curriculum_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE
);

-- Create books table (with learning objectives and duration)
CREATE TABLE books (
  id VARCHAR(36) PRIMARY KEY,
  grade_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE
);

-- Create units table (with learning objectives and total_time)
CREATE TABLE units (
  id VARCHAR(36) PRIMARY KEY,
  book_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  total_time VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Create lessons table (with learning objectives and duration)
CREATE TABLE lessons (
  id VARCHAR(36) PRIMARY KEY,
  unit_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- Create stages table (with learning objectives and duration)
CREATE TABLE stages (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Create activities table (with learning objectives and duration)
CREATE TABLE activities (
  id VARCHAR(36) PRIMARY KEY,
  stage_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_curriculums_created_at ON curriculums(created_at);
CREATE INDEX idx_grades_curriculum_id ON grades(curriculum_id);
CREATE INDEX idx_grades_created_at ON grades(created_at);
CREATE INDEX idx_books_grade_id ON books(grade_id);
CREATE INDEX idx_books_created_at ON books(created_at);
CREATE INDEX idx_units_book_id ON units(book_id);
CREATE INDEX idx_units_created_at ON units(created_at);
CREATE INDEX idx_lessons_unit_id ON lessons(unit_id);
CREATE INDEX idx_lessons_created_at ON lessons(created_at);
CREATE INDEX idx_stages_lesson_id ON stages(lesson_id);
CREATE INDEX idx_stages_created_at ON stages(created_at);
CREATE INDEX idx_activities_stage_id ON activities(stage_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- Insert sample data
INSERT INTO curriculums (id, name, description) VALUES
('curriculum-1', 'KG Curriculum', 'Foundational learning for KG-1');

INSERT INTO grades (id, curriculum_id, name, learning_objectives, duration) VALUES
('grade-1', 'curriculum-1', 'KG-1', '["Learn alphabets", "Count numbers", "Basic shapes"]', '1 Year');

INSERT INTO books (id, grade_id, name, learning_objectives, duration) VALUES
('book-1', 'grade-1', 'English Primer', '["Basic alphabets and words", "Simple sentences", "Reading comprehension"]', '6 Months');

INSERT INTO units (id, book_id, name, learning_objectives, total_time) VALUES
('unit-1', 'book-1', 'Unit 1: Alphabets', '["Learn A-Z", "Recognize letters", "Write letters"]', '2 Weeks');

INSERT INTO lessons (id, unit_id, name, learning_objectives, duration) VALUES
('lesson-1', 'unit-1', 'Lesson 1: A to E', '["Recognize letters A-E", "Write letters A-E", "Sound out letters"]', '30 mins');

INSERT INTO stages (id, lesson_id, name, learning_objectives, duration) VALUES
('stage-1', 'lesson-1', 'Stage 1: Introduction', '["Identify letters A-E", "Practice writing", "Listen to sounds"]', '10 mins');

INSERT INTO activities (id, stage_id, name, type, learning_objectives, duration) VALUES
('activity-1', 'stage-1', 'Activity 1: Letter Recognition', 'Visual', '["Recognize letters A-E with flashcards", "Match letters to objects", "Trace letters"]', '10 mins');

-- Show table structure to verify
DESCRIBE curriculums;
DESCRIBE grades;
DESCRIBE books;
DESCRIBE units;
DESCRIBE lessons;
DESCRIBE stages;
DESCRIBE activities;
