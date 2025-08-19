import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { ContentEditor } from './components/ContentEditor';
import { useCurriculumAPI } from './hooks/useCurriculumAPI';
import { useCurriculum } from './hooks/useCurriculum';
import { AlertCircle, Loader2 } from 'lucide-react';
import { DatabaseStatus } from './components/DatabaseStatus';

function App() {
  const curriculum = useCurriculumAPI();
  const localCurriculum = useCurriculum();
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['curriculum-kg-curriculum']));

  const handleToggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  // Show loading state
  if (curriculum.loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Curriculum Data</h2>
          <p className="text-gray-600">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (curriculum.error) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">{curriculum.error}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">Setup Required:</h3>
                    <p className="text-sm text-amber-700">
          Please ensure the backend server is running on http://localhost:3001
        </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      <DatabaseStatus 
        isConnected={!curriculum.loading && !curriculum.error}
        isLoading={curriculum.loading}
        error={curriculum.error}
      />
      
      <Sidebar
        curriculums={curriculum.data.curriculums}
        selectedPath={selectedPath}
        onSelectPath={setSelectedPath}
        expandedItems={expandedItems}
        onToggleExpanded={handleToggleExpanded}
      />
      
      <ContentEditor
        selectedPath={selectedPath}
        curriculums={curriculum.data.curriculums}
        onSelectPath={setSelectedPath}
        onAddCurriculum={curriculum.addCurriculum}
        onUpdateCurriculum={curriculum.updateCurriculum}
        onDeleteCurriculum={curriculum.deleteCurriculum}
        onAddGrade={curriculum.addGrade}
        onAddBook={curriculum.addBook}
        onUpdateGrade={curriculum.updateGrade}
        onDeleteGrade={curriculum.deleteGrade}
        onUpdateBook={curriculum.updateBook}
        onDeleteBook={curriculum.deleteBook}
        onAddUnit={curriculum.addUnit}
        onUpdateUnit={curriculum.updateUnit}
        onDeleteUnit={curriculum.deleteUnit}
        onAddLesson={curriculum.addLesson}
        onUpdateLesson={curriculum.updateLesson}
        onDeleteLesson={curriculum.deleteLesson}
        onAddStage={curriculum.addStage}
        onUpdateStage={curriculum.updateStage}
        onDeleteStage={curriculum.deleteStage}
        onAddActivity={curriculum.addActivity}
        onUpdateActivity={curriculum.updateActivity}
        onDeleteActivity={curriculum.deleteActivity}
        onAddStandard={(curriculumId, name, description) => localCurriculum.addStandard(curriculumId, name, description)}
        onUpdateStandard={(curriculumId, standardId, updates) => localCurriculum.updateStandard(curriculumId, standardId, updates)}
        onDeleteStandard={(curriculumId, standardId) => localCurriculum.deleteStandard(curriculumId, standardId)}
        onAddStandardCode={(curriculumId, standardId, code) => localCurriculum.addStandardCode(curriculumId, standardId, code)}
        onUpdateStandardCode={(curriculumId, standardId, codeId, updates) => localCurriculum.updateStandardCode(curriculumId, standardId, codeId, updates)}
        onDeleteStandardCode={(curriculumId, standardId, codeId) => localCurriculum.deleteStandardCode(curriculumId, standardId, codeId)}
        onAddActivityType={(curriculumId, name, description, color, icon) => localCurriculum.addActivityType(curriculumId, name, description, color, icon)}
        onUpdateActivityType={(curriculumId, activityTypeId, updates) => localCurriculum.updateActivityType(curriculumId, activityTypeId, updates)}
        onDeleteActivityType={(curriculumId, activityTypeId) => localCurriculum.deleteActivityType(curriculumId, activityTypeId)}
      />
    </div>
  );
}

export default App;