-- Curriculum Management System MySQL Schema
-- This file contains all the necessary SQL commands to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS curriculum_db;
USE curriculum_db;

-- Create curriculums table
CREATE TABLE IF NOT EXISTS curriculums (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id VARCHAR(36) PRIMARY KEY,
  curriculum_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(36) PRIMARY KEY,
  grade_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id VARCHAR(36) PRIMARY KEY,
  book_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  total_time VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(36) PRIMARY KEY,
  unit_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- Create stages table
CREATE TABLE IF NOT EXISTS stages (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  learning_objectives JSON DEFAULT NULL,
  duration VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
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

-- Insert sample data (optional)
INSERT INTO curriculums (id, name, description) VALUES 
('sample-curriculum-1', 'Sample Curriculum', 'A sample curriculum for testing purposes');

INSERT INTO grades (id, curriculum_id, name) VALUES 
('sample-grade-1', 'sample-curriculum-1', 'Grade 9');

INSERT INTO books (id, grade_id, name) VALUES 
('sample-book-1', 'sample-grade-1', 'Mathematics Book 1');

INSERT INTO units (id, book_id, name, learning_objectives, total_time) VALUES 
('sample-unit-1', 'sample-book-1', 'Introduction to Algebra', '["Understand basic algebraic concepts", "Solve simple equations"]', '2 hours');

INSERT INTO lessons (id, unit_id, name, learning_objectives, duration) VALUES 
('sample-lesson-1', 'sample-unit-1', 'Variables and Expressions', '["Define variables", "Write algebraic expressions"]', '45 minutes');

INSERT INTO stages (id, lesson_id, name, learning_objectives, duration) VALUES 
('sample-stage-1', 'sample-lesson-1', 'Introduction', '["Introduce the concept of variables"]', '10 minutes');

INSERT INTO activities (id, stage_id, name, type, learning_objectives, duration) VALUES 
('sample-activity-1', 'sample-stage-1', 'Variable Discussion', 'Discussion', '["Participate in class discussion about variables"]', '10 minutes');

-- Show table structure
DESCRIBE curriculums;
DESCRIBE grades;
DESCRIBE books;
DESCRIBE units;
DESCRIBE lessons;
DESCRIBE stages;
DESCRIBE activities;
