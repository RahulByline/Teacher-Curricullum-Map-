import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'curriculum_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

// Helper function to generate UUID
const generateUUID = () => uuidv4();

// Helper function to parse JSON arrays from MySQL
const parseJSONArray = (jsonString) => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

// Helper function to stringify arrays for MySQL
const stringifyArray = (array) => {
  return JSON.stringify(array);
};

// API Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ 
      status: 'healthy', 
      message: 'Server and database are running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Get all curriculum data
app.get('/api/curriculums', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Load all data with relationships
    const [curriculumsData] = await connection.execute(
      'SELECT * FROM curriculums ORDER BY created_at ASC'
    );
    
    const [gradesData] = await connection.execute(
      'SELECT * FROM grades ORDER BY created_at ASC'
    );
    
    const [booksData] = await connection.execute(
      'SELECT * FROM books ORDER BY created_at ASC'
    );
    
    const [unitsData] = await connection.execute(
      'SELECT * FROM units ORDER BY created_at ASC'
    );
    
    const [lessonsData] = await connection.execute(
      'SELECT * FROM lessons ORDER BY created_at ASC'
    );
    
    const [stagesData] = await connection.execute(
      'SELECT * FROM stages ORDER BY created_at ASC'
    );
    
    const [activitiesData] = await connection.execute(
      'SELECT * FROM activities ORDER BY created_at ASC'
    );
    
    connection.release();
    
    // Build nested structure
    const curriculums = curriculumsData.map(curriculum => ({
      id: curriculum.id,
      name: curriculum.name,
      description: curriculum.description,
      standards: [],
      grades: gradesData
        .filter(grade => grade.curriculum_id === curriculum.id)
        .map(grade => ({
          id: grade.id,
          name: grade.name,
          learningObjectives: parseJSONArray(grade.learning_objectives),
          duration: grade.duration,
          books: booksData
            .filter(book => book.grade_id === grade.id)
            .map(book => ({
              id: book.id,
              name: book.name,
              learningObjectives: parseJSONArray(book.learning_objectives),
              duration: book.duration,
              units: unitsData
                .filter(unit => unit.book_id === book.id)
                .map(unit => ({
                  id: unit.id,
                  name: unit.name,
                  learningObjectives: parseJSONArray(unit.learning_objectives),
                  totalTime: unit.total_time,
                  lessons: lessonsData
                    .filter(lesson => lesson.unit_id === unit.id)
                    .map(lesson => ({
                      id: lesson.id,
                      name: lesson.name,
                      learningObjectives: parseJSONArray(lesson.learning_objectives),
                      duration: lesson.duration,
                      standardCodes: [],
                      stages: stagesData
                        .filter(stage => stage.lesson_id === lesson.id)
                        .map(stage => ({
                          id: stage.id,
                          name: stage.name,
                          learningObjectives: parseJSONArray(stage.learning_objectives),
                          duration: stage.duration,
                          activities: activitiesData
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
    
    res.json({ curriculums });
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    res.status(500).json({ error: 'Failed to fetch curriculum data' });
  }
});

// Curriculum operations
app.post('/api/curriculums', async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO curriculums (id, name, description) VALUES (?, ?, ?)',
      [id, name, description || '']
    );
    connection.release();
    
    res.status(201).json({ id, name, description: description || '' });
  } catch (error) {
    console.error('Error adding curriculum:', error);
    res.status(500).json({ error: 'Failed to add curriculum' });
  }
});

app.put('/api/curriculums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE curriculums SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [name || null, description || null, id]
    );
    connection.release();
    
    res.json({ id, name, description });
  } catch (error) {
    console.error('Error updating curriculum:', error);
    res.status(500).json({ error: 'Failed to update curriculum' });
  }
});

app.delete('/api/curriculums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM curriculums WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    res.status(500).json({ error: 'Failed to delete curriculum' });
  }
});

// Grade operations
app.post('/api/grades', async (req, res) => {
  try {
    const { curriculumId, name, learningObjectives, duration } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO grades (id, curriculum_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
      [id, curriculumId, name, stringifyArray(learningObjectives || []), duration || '']
    );
    connection.release();
    
    res.status(201).json({ id, curriculumId, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error adding grade:', error);
    res.status(500).json({ error: 'Failed to add grade' });
  }
});

app.put('/api/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, learningObjectives, duration } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE grades SET name = ?, learning_objectives = ?, duration = ?, updated_at = NOW() WHERE id = ?',
      [name || null, stringifyArray(learningObjectives || []), duration || null, id]
    );
    connection.release();
    
    res.json({ id, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

app.delete('/api/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM grades WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

// Book operations
app.post('/api/books', async (req, res) => {
  try {
    const { gradeId, name, learningObjectives, duration } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO books (id, grade_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
      [id, gradeId, name, stringifyArray(learningObjectives || []), duration || '']
    );
    connection.release();
    
    res.status(201).json({ id, gradeId, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, learningObjectives, duration } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE books SET name = ?, learning_objectives = ?, duration = ?, updated_at = NOW() WHERE id = ?',
      [name || null, stringifyArray(learningObjectives || []), duration || null, id]
    );
    connection.release();
    
    res.json({ id, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM books WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Unit operations
app.post('/api/units', async (req, res) => {
  try {
    const { bookId, name, learningObjectives, totalTime } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO units (id, book_id, name, learning_objectives, total_time) VALUES (?, ?, ?, ?, ?)',
      [id, bookId, name, stringifyArray(learningObjectives || []), totalTime || '']
    );
    connection.release();
    
    res.status(201).json({ id, bookId, name, learningObjectives: learningObjectives || [], totalTime: totalTime || '' });
  } catch (error) {
    console.error('Error adding unit:', error);
    res.status(500).json({ error: 'Failed to add unit' });
  }
});

app.put('/api/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, learningObjectives, totalTime } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE units SET name = ?, learning_objectives = ?, total_time = ?, updated_at = NOW() WHERE id = ?',
      [name || null, stringifyArray(learningObjectives || []), totalTime || null, id]
    );
    connection.release();
    
    res.json({ id, name, learningObjectives: learningObjectives || [], totalTime: totalTime || '' });
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

app.delete('/api/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM units WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ error: 'Failed to delete unit' });
  }
});

// Lesson operations
app.post('/api/lessons', async (req, res) => {
  try {
    const { unitId, name, learningObjectives, duration } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO lessons (id, unit_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
      [id, unitId, name, stringifyArray(learningObjectives || []), duration || '']
    );
    connection.release();
    
    res.status(201).json({ id, unitId, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

app.put('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, learningObjectives, duration } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE lessons SET name = ?, learning_objectives = ?, duration = ?, updated_at = NOW() WHERE id = ?',
      [name || null, stringifyArray(learningObjectives || []), duration || null, id]
    );
    connection.release();
    
    res.json({ id, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM lessons WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Stage operations
app.post('/api/stages', async (req, res) => {
  try {
    const { lessonId, name, learningObjectives, duration } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO stages (id, lesson_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
      [id, lessonId, name, stringifyArray(learningObjectives || []), duration || '']
    );
    connection.release();
    
    res.status(201).json({ id, lessonId, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error adding stage:', error);
    res.status(500).json({ error: 'Failed to add stage' });
  }
});

app.put('/api/stages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, learningObjectives, duration } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE stages SET name = ?, learning_objectives = ?, duration = ?, updated_at = NOW() WHERE id = ?',
      [name || null, stringifyArray(learningObjectives || []), duration || null, id]
    );
    connection.release();
    
    res.json({ id, name, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

app.delete('/api/stages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM stages WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Stage deleted successfully' });
  } catch (error) {
    console.error('Error deleting stage:', error);
    res.status(500).json({ error: 'Failed to delete stage' });
  }
});

// Activity operations
app.post('/api/activities', async (req, res) => {
  try {
    const { stageId, name, type, learningObjectives, duration } = req.body;
    const id = generateUUID();
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO activities (id, stage_id, name, type, learning_objectives, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [id, stageId, name, type, stringifyArray(learningObjectives || []), duration || '']
    );
    connection.release();
    
    res.status(201).json({ id, stageId, name, type, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

app.put('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, learningObjectives, duration } = req.body;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE activities SET name = ?, type = ?, learning_objectives = ?, duration = ?, updated_at = NOW() WHERE id = ?',
      [name || null, type || null, stringifyArray(learningObjectives || []), duration || null, id]
    );
    connection.release();
    
    res.json({ id, name, type, learningObjectives: learningObjectives || [], duration: duration || '' });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM activities WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// CSV Upload endpoint
app.post('/api/curriculum/upload', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { curriculums } = req.body;
    
    if (!curriculums || !Array.isArray(curriculums)) {
      return res.status(400).json({ error: 'Invalid curriculum data' });
    }

    const results = {
      curriculumsCreated: 0,
      gradesCreated: 0,
      booksCreated: 0,
      unitsCreated: 0,
      lessonsCreated: 0,
      stagesCreated: 0,
      activitiesCreated: 0,
      errors: []
    };

    for (const curriculumData of curriculums) {
      try {
        // Create curriculum
        const curriculumId = generateUUID();
        await connection.execute(
          'INSERT INTO curriculums (id, name, description) VALUES (?, ?, ?)',
          [curriculumId, curriculumData.name, curriculumData.description || '']
        );
        results.curriculumsCreated++;

        // Process grades
        for (const gradeData of curriculumData.grades || []) {
          const gradeId = generateUUID();
          await connection.execute(
            'INSERT INTO grades (id, curriculum_id, name) VALUES (?, ?, ?)',
            [gradeId, curriculumId, gradeData.name]
          );
          results.gradesCreated++;

          // Process books
          for (const bookData of gradeData.books || []) {
            const bookId = generateUUID();
            await connection.execute(
              'INSERT INTO books (id, grade_id, name) VALUES (?, ?, ?)',
              [bookId, gradeId, bookData.name]
            );
            results.booksCreated++;

            // Process units
            for (const unitData of bookData.units || []) {
              const unitId = generateUUID();
              await connection.execute(
                'INSERT INTO units (id, book_id, name, learning_objectives, total_time) VALUES (?, ?, ?, ?, ?)',
                [
                  unitId, 
                  bookId, 
                  unitData.name, 
                  stringifyArray(unitData.learningObjectives || []),
                  unitData.duration || ''
                ]
              );
              results.unitsCreated++;

              // Process lessons
              for (const lessonData of unitData.lessons || []) {
                const lessonId = generateUUID();
                await connection.execute(
                  'INSERT INTO lessons (id, unit_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
                  [
                    lessonId, 
                    unitId, 
                    lessonData.name, 
                    stringifyArray(lessonData.learningObjectives || []),
                    lessonData.duration || ''
                  ]
                );
                results.lessonsCreated++;

                // Process stages
                for (const stageData of lessonData.stages || []) {
                  const stageId = generateUUID();
                  await connection.execute(
                    'INSERT INTO stages (id, lesson_id, name, learning_objectives, duration) VALUES (?, ?, ?, ?, ?)',
                    [
                      stageId, 
                      lessonId, 
                      stageData.name, 
                      stringifyArray(stageData.learningObjectives || []),
                      stageData.duration || ''
                    ]
                  );
                  results.stagesCreated++;

                  // Process activities
                  for (const activityData of stageData.activities || []) {
                    const activityId = generateUUID();
                    await connection.execute(
                      'INSERT INTO activities (id, stage_id, name, type, learning_objectives, duration) VALUES (?, ?, ?, ?, ?, ?)',
                      [
                        activityId, 
                        stageId, 
                        activityData.name, 
                        activityData.type || '',
                        stringifyArray(activityData.learningObjectives || []),
                        activityData.duration || ''
                      ]
                    );
                    results.activitiesCreated++;
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing curriculum ${curriculumData.name}:`, error);
        results.errors.push(`Failed to process curriculum "${curriculumData.name}": ${error.message}`);
      }
    }

    connection.release();
    
    res.status(201).json({
      message: 'Curriculum upload completed',
      results
    });
    
  } catch (error) {
    connection.release();
    console.error('Error uploading curriculum:', error);
    res.status(500).json({ error: 'Failed to upload curriculum' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  await testConnection();
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
