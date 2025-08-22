-- Check and fix database issues
USE curriculum_db;

-- Check if tables exist and their structure
SHOW TABLES;

-- Check if curriculums table has data
SELECT * FROM curriculums;

-- Check if grades table has data
SELECT * FROM grades;

-- Check foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'curriculum_db' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- If no curriculum exists, create one
INSERT IGNORE INTO curriculums (id, name, description) VALUES
('curriculum-1', 'KG Curriculum', 'Foundational learning for KG-1');

-- Verify the curriculum was created
SELECT * FROM curriculums;

-- Show the structure of grades table to verify columns exist
DESCRIBE grades;
