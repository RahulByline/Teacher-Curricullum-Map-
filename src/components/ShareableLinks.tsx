import React, { useState } from 'react';
import { Share2, Copy, Calendar, Eye, Trash2, Plus, ExternalLink, Clock, Users, X } from 'lucide-react';

interface ShareableLink {
  id: string;
  name: string;
  url: string;
  expiryDate: string;
  createdAt: string;
  accessCount: number;
  isActive: boolean;
}

interface ShareableLinksProps {
  curriculumId?: string;
  curriculumName?: string;
}

export function ShareableLinks({ curriculumId, curriculumName }: ShareableLinksProps) {
  const [links, setLinks] = useState<ShareableLink[]>([
    {
      id: '1',
      name: 'KG Curriculum - Public View',
      url: 'https://curriculum-portal.com/share/kg-curriculum-abc123',
      expiryDate: '2024-12-31',
      createdAt: '2024-01-15',
      accessCount: 45,
      isActive: true
    },
    {
      id: '2',
      name: 'Unit 1 - Weather Lessons',
      url: 'https://curriculum-portal.com/share/weather-unit-def456',
      expiryDate: '2024-06-30',
      createdAt: '2024-02-01',
      accessCount: 12,
      isActive: false
    }
  ]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    expiryDate: '',
    includeSubItems: true
  });

  const generateShareableLink = () => {
    const linkId = Date.now().toString();
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/share/${curriculumId || 'curriculum'}-${linkId}`;
    
    const newShareableLink: ShareableLink = {
      id: linkId,
      name: newLink.name || `${curriculumName || 'Curriculum'} - Shared View`,
      url: shareUrl,
      expiryDate: newLink.expiryDate,
      createdAt: new Date().toISOString().split('T')[0],
      accessCount: 0,
      isActive: true
    };

    setLinks(prev => [newShareableLink, ...prev]);
    setShowCreateModal(false);
    setNewLink({ name: '', expiryDate: '', includeSubItems: true });
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const deleteLink = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const toggleLinkStatus = (linkId: string) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Share2 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Shareable Links</h3>
            <p className="text-sm text-gray-600">Create view-only links with expiry dates</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Create Link</span>
        </button>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye size={20} className="text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">View-Only Access</h4>
            <p className="text-sm text-amber-700">
              All shareable links provide <strong>read-only access</strong>. Recipients can view curriculum content 
              but cannot add, edit, or delete anything. No "New Curriculum", "Add Grade", or edit buttons will be visible.
            </p>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Share2 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No shareable links created</p>
            <p className="text-gray-400 text-sm">Create your first shareable link to share curriculum content</p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                !link.isActive || isExpired(link.expiryDate) ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-800">{link.name}</h4>
                    <div className="flex items-center space-x-2">
                      {link.isActive && !isExpired(link.expiryDate) ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : isExpired(link.expiryDate) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        View Only
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm text-gray-700 flex-1 font-mono break-all">
                        {link.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                        title="Copy link"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                        title="Open link"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Created: {formatDate(link.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>Expires: {formatDate(link.expiryDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{link.accessCount} views</span>
                    </div>
                  </div>

                  {/* Access Restrictions */}
                  <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>Restricted Access:</strong> No editing, adding, or deleting capabilities. 
                      Recipients can only view content structure and details.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleLinkStatus(link.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      link.isActive 
                        ? 'text-orange-600 hover:bg-orange-100' 
                        : 'text-green-600 hover:bg-green-100'
                    }`}
                    title={link.isActive ? 'Deactivate link' : 'Activate link'}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Create Shareable Link</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Name
                </label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`${curriculumName || 'Curriculum'} - Shared View`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newLink.expiryDate}
                  onChange={(e) => setNewLink(prev => ({ ...prev, expiryDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="includeSubItems"
                  checked={newLink.includeSubItems}
                  onChange={(e) => setNewLink(prev => ({ ...prev, includeSubItems: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeSubItems" className="text-sm text-gray-700">
                  Include all sub-items (grades, books, units, lessons)
                </label>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Eye size={16} className="text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">⚠️ View-Only Access</p>
                    <ul className="text-xs space-y-1">
                      <li>• No "New Curriculum" or "Add" buttons</li>
                      <li>• No editing or deleting capabilities</li>
                      <li>• No settings or configuration access</li>
                      <li>• Recipients can only browse and view content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateShareableLink}
                disabled={!newLink.expiryDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Create View-Only Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">How Shareable Links Work</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>View-Only:</strong> Recipients can browse curriculum structure but cannot make changes</p>
          <p>• <strong>No Authentication:</strong> Links work without login requirements</p>
          <p>• <strong>Automatic Expiry:</strong> Links become inactive after the set expiry date</p>
          <p>• <strong>Usage Tracking:</strong> Monitor how many times each link has been accessed</p>
          <p>• <strong>Instant Control:</strong> Activate/deactivate or delete links anytime</p>
        </div>
      </div>
    </div>
  );
}