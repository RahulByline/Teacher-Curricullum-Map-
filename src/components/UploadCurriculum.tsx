import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import Papa from 'papaparse';
import { uploadCurriculum } from '../lib/api';

interface UploadCurriculumProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface CSVRow {
  'Curriculum Name': string;
  'Curriculum Description': string;
  'Grade Name': string;
  'Grade Duration': string;
  'Grade Learning Objectives': string;
  'Book Name': string;
  'Book Duration': string;
  'Book Learning Objectives': string;
  'Unit Name': string;
  'Unit Duration': string;
  'Unit Learning Objectives': string;
  'Lesson Name': string;
  'Lesson Duration': string;
  'Lesson Learning Objectives': string;
  'Stage Name': string;
  'Stage Duration': string;
  'Stage Learning Objectives': string;
  'Activity Name': string;
  'Activity Duration': string;
  'Activity Type': string;
  'Activity Learning Objectives': string;
}

interface ParsedCurriculum {
  name: string;
  description: string;
  grades: {
    name: string;
    duration: string;
    learningObjectives: string[];
    books: {
      name: string;
      duration: string;
      learningObjectives: string[];
      units: {
        name: string;
        duration: string;
        learningObjectives: string[];
        lessons: {
          name: string;
          duration: string;
          learningObjectives: string[];
          stages: {
            name: string;
            duration: string;
            learningObjectives: string[];
            activities: {
              name: string;
              duration: string;
              type: string;
              learningObjectives: string[];
            }[];
          }[];
        }[];
      }[];
    }[];
  }[];
}

export function UploadCurriculum({ onClose, onUploadSuccess }: UploadCurriculumProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState<ParsedCurriculum | null>(null);

  const parseLearningObjectives = (objectives: string): string[] => {
    if (!objectives || objectives.trim() === '') return [];
    // Split by common delimiters and clean up
    return objectives
      .split(/[,;|]/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0);
  };

  const parseCSVData = (csvData: CSVRow[]): ParsedCurriculum[] => {
    const curriculumMap = new Map<string, ParsedCurriculum>();

    csvData.forEach((row) => {
      const curriculumName = row['Curriculum Name']?.trim();
      const gradeName = row['Grade Name']?.trim();
      const bookName = row['Book Name']?.trim();
      const unitName = row['Unit Name']?.trim();
      const lessonName = row['Lesson Name']?.trim();
      const stageName = row['Stage Name']?.trim();
      const activityName = row['Activity Name']?.trim();

      if (!curriculumName) return;

      // Get or create curriculum
      if (!curriculumMap.has(curriculumName)) {
        curriculumMap.set(curriculumName, {
          name: curriculumName,
          description: row['Curriculum Description']?.trim() || '',
          grades: []
        });
      }
      const curriculum = curriculumMap.get(curriculumName)!;

      // Find or create grade
      let grade = curriculum.grades.find(g => g.name === gradeName);
      if (!grade && gradeName) {
        grade = {
          name: gradeName,
          duration: row['Grade Duration']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Grade Learning Objectives'] || ''),
          books: []
        };
        curriculum.grades.push(grade);
      }

      if (!grade) return;

      // Find or create book
      let book = grade.books.find(b => b.name === bookName);
      if (!book && bookName) {
        book = {
          name: bookName,
          duration: row['Book Duration']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Book Learning Objectives'] || ''),
          units: []
        };
        grade.books.push(book);
      }

      if (!book) return;

      // Find or create unit
      let unit = book.units.find(u => u.name === unitName);
      if (!unit && unitName) {
        unit = {
          name: unitName,
          duration: row['Unit Duration']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Unit Learning Objectives'] || ''),
          lessons: []
        };
        book.units.push(unit);
      }

      if (!unit) return;

      // Find or create lesson
      let lesson = unit.lessons.find(l => l.name === lessonName);
      if (!lesson && lessonName) {
        lesson = {
          name: lessonName,
          duration: row['Lesson Duration']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Lesson Learning Objectives'] || ''),
          stages: []
        };
        unit.lessons.push(lesson);
      }

      if (!lesson) return;

      // Find or create stage
      let stage = lesson.stages.find(s => s.name === stageName);
      if (!stage && stageName) {
        stage = {
          name: stageName,
          duration: row['Stage Duration']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Stage Learning Objectives'] || ''),
          activities: []
        };
        lesson.stages.push(stage);
      }

      if (!stage) return;

      // Add activity if it exists
      if (activityName) {
        const activity = {
          name: activityName,
          duration: row['Activity Duration']?.trim() || '',
          type: row['Activity Type']?.trim() || '',
          learningObjectives: parseLearningObjectives(row['Activity Learning Objectives'] || '')
        };
        stage.activities.push(activity);
      }
    });

    return Array.from(curriculumMap.values());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setErrorMessage('Please select a valid CSV file');
      return;
    }

    setFile(selectedFile);
    setErrorMessage('');
    setUploadStatus('idle');

    // Preview the data
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.errors.length > 0) {
          setErrorMessage('Error parsing CSV file. Please check the format.');
          return;
        }

        const parsedData = parseCSVData(results.data as CSVRow[]);
        if (parsedData.length > 0) {
          setPreviewData(parsedData[0]); // Show preview of first curriculum
        }
      },
      error: (error: any) => {
        setErrorMessage('Error reading CSV file: ' + error.message);
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: any) => {
          if (results.errors.length > 0) {
            setErrorMessage('Error parsing CSV file. Please check the format.');
            setIsUploading(false);
            return;
          }

          const parsedData = parseCSVData(results.data as CSVRow[]);

          // Send to backend using API function
          await uploadCurriculum({ curriculums: parsedData });

          setUploadStatus('success');
          setIsUploading(false);
          
          // Call success callback after a short delay
          setTimeout(() => {
            onUploadSuccess();
            onClose();
          }, 2000);
        },
        error: (error: any) => {
          setErrorMessage('Error reading CSV file: ' + error.message);
          setIsUploading(false);
        }
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadStatus('error');
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Preview:</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Curriculum:</span> {previewData.name}
          </div>
          <div>
            <span className="font-medium">Grades:</span> {previewData.grades.length}
          </div>
          <div>
            <span className="font-medium">Total Books:</span> {previewData.grades.reduce((sum, grade) => sum + grade.books.length, 0)}
          </div>
          <div>
            <span className="font-medium">Total Units:</span> {previewData.grades.reduce((sum, grade) => sum + grade.books.reduce((bookSum, book) => bookSum + book.units.length, 0), 0)}
          </div>
          <div>
            <span className="font-medium">Total Lessons:</span> {previewData.grades.reduce((sum, grade) => sum + grade.books.reduce((bookSum, book) => bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.length, 0), 0), 0)}
          </div>
          <div>
            <span className="font-medium">Total Stages:</span> {previewData.grades.reduce((sum, grade) => sum + grade.books.reduce((bookSum, book) => bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.stages.length, 0), 0), 0), 0)}
          </div>
          <div>
            <span className="font-medium">Total Activities:</span> {previewData.grades.reduce((sum, grade) => sum + grade.books.reduce((bookSum, book) => bookSum + book.units.reduce((unitSum, unit) => unitSum + unit.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.stages.reduce((stageSum, stage) => stageSum + stage.activities.length, 0), 0), 0), 0), 0)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Upload size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Upload Curriculum CSV</h1>
              <p className="text-gray-600">Upload a CSV file to create your curriculum structure</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText size={32} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {file ? file.name : 'Choose CSV file or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports CSV files with curriculum structure data
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-red-700">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-green-700">Curriculum uploaded successfully!</span>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewData && renderPreview()}

          {/* Upload Button */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload Curriculum</span>
                </>
              )}
            </button>
          </div>

          {/* CSV Format Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">CSV Format Requirements:</h4>
            <p className="text-sm text-blue-700 mb-2">
              Your CSV should have the following headers:
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>Curriculum Name, Curriculum Description, Grade Name, Grade Duration, Grade Learning Objectives,</p>
              <p>Book Name, Book Duration, Book Learning Objectives, Unit Name, Unit Duration, Unit Learning Objectives,</p>
              <p>Lesson Name, Lesson Duration, Lesson Learning Objectives, Stage Name, Stage Duration, Stage Learning Objectives,</p>
              <p>Activity Name, Activity Duration, Activity Type, Activity Learning Objectives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
