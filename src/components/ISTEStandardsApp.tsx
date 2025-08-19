import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Users, Shield, Lightbulb, Zap, Globe, Code, Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Search, Filter, BarChart3, Eye, Link } from 'lucide-react';

// ISTE Standards Structure
export interface ISTEStandard {
  id: string;
  category: 'Empowered Learner' | 'Digital Citizen' | 'Knowledge Constructor' | 'Innovative Designer' | 'Computational Thinker' | 'Creative Communicator' | 'Global Collaborator';
  categoryCode: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  standards: ISTESubStandard[];
}

export interface ISTESubStandard {
  id: string;
  code: string; // e.g., "1.1", "1.2", etc.
  title: string;
  description: string;
  gradeLevel: 'K-2' | '3-5' | '6-8' | '9-12' | 'All';
  indicators: ISTEIndicator[];
}

export interface ISTEIndicator {
  id: string;
  code: string; // e.g., "1.1.a", "1.1.b", etc.
  description: string;
  examples: string[];
  assessmentCriteria: string[];
}

interface ISTEStandardsAppProps {
  curriculums: any[];
  onClose: () => void;
}

export function ISTEStandardsApp({ curriculums, onClose }: ISTEStandardsAppProps) {
  const [activeTab, setActiveTab] = useState<'standards' | 'mapping' | 'reports'>('standards');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState<{ type: 'category' | 'standard' | 'indicator'; parentId?: string } | null>(null);
  
  // Form state for adding new items
  const [newCategory, setNewCategory] = useState({
    name: '',
    categoryCode: ''
  });
  
  const [newStandard, setNewStandard] = useState({
    code: '',
    title: '',
    description: '',
    gradeLevel: 'All' as 'K-2' | '3-5' | '6-8' | '9-12' | 'All'
  });
  
  const [newIndicator, setNewIndicator] = useState({
    code: '',
    description: '',
    examples: [''],
    assessmentCriteria: ['']
  });

  // Load ISTE Standards from localStorage or use default data
  const [isteStandards, setIsteStandards] = useState<ISTEStandard[]>(() => {
    const saved = localStorage.getItem('isteStandards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved ISTE standards:', error);
        // Return default data if parsing fails
      }
    }
    
    // Default ISTE Standards Data
    return [
    {
      id: 'empowered-learner',
      category: 'Empowered Learner',
      categoryCode: '1',
      standards: [
        {
          id: '1-1',
          code: '1.1',
          title: 'Articulate Goals',
          description: 'Students articulate personal learning goals, develop strategies leveraging technology to achieve them, and reflect on the learning process itself to improve learning outcomes.',
          gradeLevel: 'All',
          indicators: [
            {
              id: '1-1-a',
              code: '1.1.a',
              description: 'Set personal learning goals and develop strategies leveraging technology to achieve them.',
              examples: [
                'Create a digital portfolio to track learning progress',
                'Use goal-setting apps to monitor academic objectives',
                'Develop personalized learning plans using educational platforms'
              ],
              assessmentCriteria: [
                'Student can articulate specific, measurable learning goals',
                'Student selects appropriate technology tools to support goal achievement',
                'Student demonstrates progress toward stated goals'
              ]
            },
            {
              id: '1-1-b',
              code: '1.1.b',
              description: 'Reflect on the learning process to improve learning outcomes.',
              examples: [
                'Maintain a digital reflection journal',
                'Use self-assessment tools to evaluate learning',
                'Create learning analytics dashboards'
              ],
              assessmentCriteria: [
                'Student regularly reflects on learning experiences',
                'Student identifies areas for improvement',
                'Student adjusts learning strategies based on reflection'
              ]
            }
          ]
        },
        {
          id: '1-2',
          code: '1.2',
          title: 'Build Networks',
          description: 'Students build networks and customize their environments in ways that support learning and productivity.',
          gradeLevel: 'All',
          indicators: [
            {
              id: '1-2-a',
              code: '1.2.a',
              description: 'Build networks of experts and peers within school policy.',
              examples: [
                'Connect with subject matter experts through educational platforms',
                'Participate in online learning communities',
                'Collaborate with peers on digital projects'
              ],
              assessmentCriteria: [
                'Student identifies and connects with relevant experts',
                'Student maintains professional online relationships',
                'Student contributes meaningfully to learning networks'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'digital-citizen',
      category: 'Digital Citizen',
      categoryCode: '2',
      standards: [
        {
          id: '2-1',
          code: '2.1',
          title: 'Cultivate Identity',
          description: 'Students cultivate and manage their digital identity and reputation and are aware of the permanence of their actions in the digital world.',
          gradeLevel: 'All',
          indicators: [
            {
              id: '2-1-a',
              code: '2.1.a',
              description: 'Cultivate and manage their digital identity and reputation.',
              examples: [
                'Create professional social media profiles',
                'Understand privacy settings across platforms',
                'Develop positive online presence'
              ],
              assessmentCriteria: [
                'Student maintains appropriate digital identity',
                'Student understands impact of digital footprint',
                'Student makes responsible online choices'
              ]
            }
          ]
        }
      ]
    }
  ];
  });

  // Save ISTE Standards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('isteStandards', JSON.stringify(isteStandards));
  }, [isteStandards]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Empowered Learner': return <Target size={20} className="text-blue-600" />;
      case 'Digital Citizen': return <Shield size={20} className="text-green-600" />;
      case 'Knowledge Constructor': return <BookOpen size={20} className="text-purple-600" />;
      case 'Innovative Designer': return <Lightbulb size={20} className="text-yellow-600" />;
      case 'Computational Thinker': return <Code size={20} className="text-red-600" />;
      case 'Creative Communicator': return <Zap size={20} className="text-pink-600" />;
      case 'Global Collaborator': return <Globe size={20} className="text-indigo-600" />;
      default: return <Target size={20} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Empowered Learner': return 'from-blue-500 to-blue-600';
      case 'Digital Citizen': return 'from-green-500 to-green-600';
      case 'Knowledge Constructor': return 'from-purple-500 to-purple-600';
      case 'Innovative Designer': return 'from-yellow-500 to-yellow-600';
      case 'Computational Thinker': return 'from-red-500 to-red-600';
      case 'Creative Communicator': return 'from-pink-500 to-pink-600';
      case 'Global Collaborator': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const toggleStandard = (standardId: string) => {
    const newExpanded = new Set(expandedStandards);
    if (newExpanded.has(standardId)) {
      newExpanded.delete(standardId);
    } else {
      newExpanded.add(standardId);
    }
    setExpandedStandards(newExpanded);
  };

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.categoryCode.trim()) return;

    const newCategoryData: ISTEStandard = {
      id: generateId(),
      category: newCategory.name as any,
      categoryCode: newCategory.categoryCode as any,
      standards: []
    };

    setIsteStandards(prev => [...prev, newCategoryData]);
    setNewCategory({ name: '', categoryCode: '' });
    setShowAddForm(null);
  };

  // Add new standard
  const handleAddStandard = () => {
    if (!newStandard.code.trim() || !newStandard.title.trim() || !newStandard.description.trim()) return;

    const newStandardData: ISTESubStandard = {
      id: generateId(),
      code: newStandard.code,
      title: newStandard.title,
      description: newStandard.description,
      gradeLevel: newStandard.gradeLevel,
      indicators: []
    };

    setIsteStandards(prev => prev.map(category => {
      if (category.id === showAddForm?.parentId) {
        return {
          ...category,
          standards: [...category.standards, newStandardData]
        };
      }
      return category;
    }));

    setNewStandard({ code: '', title: '', description: '', gradeLevel: 'All' });
    setShowAddForm(null);
  };

  // Add new indicator
  const handleAddIndicator = () => {
    if (!newIndicator.code.trim() || !newIndicator.description.trim()) return;

    const newIndicatorData: ISTEIndicator = {
      id: generateId(),
      code: newIndicator.code,
      description: newIndicator.description,
      examples: newIndicator.examples.filter(ex => ex.trim()),
      assessmentCriteria: newIndicator.assessmentCriteria.filter(criteria => criteria.trim())
    };

    setIsteStandards(prev => prev.map(category => ({
      ...category,
      standards: category.standards.map(standard => {
        if (standard.id === showAddForm?.parentId) {
          return {
            ...standard,
            indicators: [...standard.indicators, newIndicatorData]
          };
        }
        return standard;
      })
    })));

    setNewIndicator({ code: '', description: '', examples: [''], assessmentCriteria: [''] });
    setShowAddForm(null);
  };

  // Add example to indicator
  const addExample = () => {
    setNewIndicator(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  // Remove example from indicator
  const removeExample = (index: number) => {
    setNewIndicator(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  // Update example
  const updateExample = (index: number, value: string) => {
    setNewIndicator(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? value : ex)
    }));
  };

  // Add assessment criteria to indicator
  const addAssessmentCriteria = () => {
    setNewIndicator(prev => ({
      ...prev,
      assessmentCriteria: [...prev.assessmentCriteria, '']
    }));
  };

  // Remove assessment criteria from indicator
  const removeAssessmentCriteria = (index: number) => {
    setNewIndicator(prev => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.filter((_, i) => i !== index)
    }));
  };

  // Update assessment criteria
  const updateAssessmentCriteria = (index: number, value: string) => {
    setNewIndicator(prev => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.map((criteria, i) => i === index ? value : criteria)
    }));
  };

  const renderStandardsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ISTE Standards Management</h2>
            <p className="text-gray-600">Create and manage detailed ISTE standards with indicators and examples</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search standards..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddForm({ type: 'category' })}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Standards Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isteStandards.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${getCategoryColor(category.category)} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category.category)}
                  <div>
                    <h3 className="font-bold text-lg">{category.categoryCode}. {category.category}</h3>
                    <p className="text-white/80 text-sm">{category.standards.length} standards</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStandard(category.id)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {expandedStandards.has(category.id) ? 
                    <ChevronDown size={20} /> : 
                    <ChevronRight size={20} />
                  }
                </button>
              </div>
            </div>

            {/* Standards List */}
            {expandedStandards.has(category.id) && (
              <div className="p-4 space-y-4">
                {category.standards.map((standard) => (
                  <div key={standard.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded text-sm">
                            {standard.code}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {standard.gradeLevel}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{standard.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{standard.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => setEditingItem({ type: 'standard', id: standard.id })}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Indicators */}
                    <div className="mt-3 space-y-2">
                      <h5 className="font-medium text-gray-700 text-sm">Indicators ({standard.indicators.length})</h5>
                      {standard.indicators.map((indicator) => (
                        <div key={indicator.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                  {indicator.code}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{indicator.description}</p>
                              
                              {/* Examples */}
                              {indicator.examples.length > 0 && (
                                <div className="mb-2">
                                  <h6 className="text-xs font-medium text-gray-600 mb-1">Examples:</h6>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {indicator.examples.slice(0, 2).map((example, idx) => (
                                      <li key={idx} className="flex items-start space-x-1">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{example}</span>
                                      </li>
                                    ))}
                                    {indicator.examples.length > 2 && (
                                      <li className="text-gray-400 italic">+{indicator.examples.length - 2} more...</li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Assessment Criteria */}
                              {indicator.assessmentCriteria.length > 0 && (
                                <div>
                                  <h6 className="text-xs font-medium text-gray-600 mb-1">Assessment Criteria:</h6>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {indicator.assessmentCriteria.slice(0, 1).map((criteria, idx) => (
                                      <li key={idx} className="flex items-start space-x-1">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>{criteria}</span>
                                      </li>
                                    ))}
                                    {indicator.assessmentCriteria.length > 1 && (
                                      <li className="text-gray-400 italic">+{indicator.assessmentCriteria.length - 1} more...</li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={() => setEditingItem({ type: 'indicator', id: indicator.id })}
                                className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => setShowAddForm({ type: 'indicator', parentId: standard.id })}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus size={14} />
                        <span className="text-sm">Add Indicator</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => setShowAddForm({ type: 'standard', parentId: category.id })}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Standard</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMappingTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Link size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Curriculum Mapping</h2>
            <p className="text-gray-600">Map ISTE standards to activities in your curriculum</p>
          </div>
        </div>
      </div>

      {/* Curriculum Tree with Mapping */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Select Activities to Map ISTE Standards</h3>
        
        {curriculums.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No curriculum data available</p>
            <p className="text-gray-400 text-sm">Create curriculums to enable ISTE mapping</p>
          </div>
        ) : (
          <div className="space-y-4">
            {curriculums.map((curriculum) => (
              <div key={curriculum.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">{curriculum.name}</h4>
                
                {curriculum.grades.map((grade: any) => (
                  <div key={grade.id} className="ml-4 mb-3">
                    <h5 className="font-medium text-gray-700 mb-2">{grade.name}</h5>
                    
                    {grade.books.map((book: any) => (
                      <div key={book.id} className="ml-4 mb-2">
                        <h6 className="font-medium text-gray-600 mb-2">{book.name}</h6>
                        
                        {book.units.map((unit: any) => (
                          <div key={unit.id} className="ml-4 mb-2">
                            <p className="text-sm font-medium text-gray-600 mb-1">{unit.name}</p>
                            
                            {unit.lessons.map((lesson: any) => (
                              <div key={lesson.id} className="ml-4 mb-2">
                                <p className="text-sm text-gray-600 mb-1">{lesson.name}</p>
                                
                                {lesson.stages.map((stage: any) => (
                                  <div key={stage.id} className="ml-4 mb-1">
                                    <p className="text-xs text-gray-500 mb-1">{stage.name} Stage</p>
                                    
                                    {stage.activities.map((activity: any) => (
                                      <div key={activity.id} className="ml-4 mb-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm font-medium text-gray-700">{activity.name}</p>
                                            <p className="text-xs text-gray-500">{activity.type}</p>
                                          </div>
                                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                                            Map ISTE
                                          </button>
                                        </div>
                                        
                                        {/* Show mapped standards */}
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            1.1.a - Set Goals
                                          </span>
                                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            2.1.a - Digital Identity
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ISTE Mapping Reports</h2>
            <p className="text-gray-600">Analyze how your curriculum aligns with ISTE standards</p>
          </div>
        </div>
      </div>

      {/* Coverage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">7</p>
              <p className="text-sm text-gray-600">ISTE Categories</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-sm text-gray-600">Total Standards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Link size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">156</p>
              <p className="text-sm text-gray-600">Mapped Activities</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">87%</p>
              <p className="text-sm text-gray-600">Coverage Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage by Category */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">ISTE Standards Coverage by Category</h3>
        
        <div className="space-y-4">
          {isteStandards.map((category) => (
            <div key={category.id} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-48">
                {getCategoryIcon(category.category)}
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${getCategoryColor(category.category)} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12">{Math.floor(Math.random() * 40 + 60)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Mapping Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Detailed Mapping Analysis</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">ISTE Standard</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Curriculum</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Activity</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Grade Level</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Coverage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6">
                  <div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded text-sm">1.1.a</span>
                    <p className="text-sm text-gray-600 mt-1">Set personal learning goals</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-700">KG Curriculum → KG 1 → Weather Book</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-700">Weather Journal</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">K-2</span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Mapped</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6">
                  <div>
                    <span className="font-mono font-bold text-green-600 bg-green-100 px-2 py-1 rounded text-sm">2.1.a</span>
                    <p className="text-sm text-gray-600 mt-1">Digital identity management</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-700">KG Curriculum → KG 1 → Weather Book</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-700">Weather Dance</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">K-2</span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Mapped</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ISTE Standards Application</h1>
              <p className="text-gray-600">Comprehensive ISTE standards management and curriculum mapping</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'standards'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen size={18} />
              <span>Standards Management</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'mapping'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Link size={18} />
              <span>Curriculum Mapping</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'reports'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 size={18} />
              <span>Mapping Reports</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'standards' && renderStandardsTab()}
          {activeTab === 'mapping' && renderMappingTab()}
          {activeTab === 'reports' && renderReportsTab()}
        </div>

        {/* Add Category Modal */}
        {showAddForm?.type === 'category' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New ISTE Category</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Knowledge Constructor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Code *</label>
                  <input
                    type="text"
                    value={newCategory.categoryCode}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, categoryCode: e.target.value }))}
                    placeholder="e.g., 3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddForm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name.trim() || !newCategory.categoryCode.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Standard Modal */}
        {showAddForm?.type === 'standard' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Standard</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard Code *</label>
                  <input
                    type="text"
                    value={newStandard.code}
                    onChange={(e) => setNewStandard(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., 1.3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newStandard.title}
                    onChange={(e) => setNewStandard(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Evaluate Information"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newStandard.description}
                    onChange={(e) => setNewStandard(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter standard description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <select
                    value={newStandard.gradeLevel}
                    onChange={(e) => setNewStandard(prev => ({ ...prev, gradeLevel: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Grades</option>
                    <option value="K-2">K-2</option>
                    <option value="3-5">3-5</option>
                    <option value="6-8">6-8</option>
                    <option value="9-12">9-12</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddForm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStandard}
                  disabled={!newStandard.code.trim() || !newStandard.title.trim() || !newStandard.description.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Standard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Indicator Modal */}
        {showAddForm?.type === 'indicator' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Indicator</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indicator Code *</label>
                  <input
                    type="text"
                    value={newIndicator.code}
                    onChange={(e) => setNewIndicator(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., 1.3.a"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newIndicator.description}
                    onChange={(e) => setNewIndicator(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter indicator description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examples</label>
                  <div className="space-y-2">
                    {newIndicator.examples.map((example, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={example}
                          onChange={(e) => updateExample(index, e.target.value)}
                          placeholder={`Example ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {newIndicator.examples.length > 1 && (
                          <button
                            onClick={() => removeExample(index)}
                            className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addExample}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + Add Example
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Criteria</label>
                  <div className="space-y-2">
                    {newIndicator.assessmentCriteria.map((criteria, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={criteria}
                          onChange={(e) => updateAssessmentCriteria(index, e.target.value)}
                          placeholder={`Assessment criteria ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {newIndicator.assessmentCriteria.length > 1 && (
                          <button
                            onClick={() => removeAssessmentCriteria(index)}
                            className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addAssessmentCriteria}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + Add Assessment Criteria
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddForm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIndicator}
                  disabled={!newIndicator.code.trim() || !newIndicator.description.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Indicator
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}