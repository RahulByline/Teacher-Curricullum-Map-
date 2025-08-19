import React, { useState, useRef } from 'react';
import { Upload, Image, X, Check } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoChange: (logoUrl: string) => void;
}

export function LogoUploader({ currentLogo, onLogoChange }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (previewUrl) {
      onLogoChange(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange('');
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Portal Logo</h4>
        {currentLogo && !previewUrl && (
          <button
            onClick={handleRemoveLogo}
            className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
          >
            <X size={14} />
            <span>Remove Logo</span>
          </button>
        )}
      </div>

      {/* Current/Preview Logo Display */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          {previewUrl || currentLogo ? (
            <img
              src={previewUrl || currentLogo}
              alt="Portal Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <Image size={24} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          {previewUrl ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">New logo preview</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Check size={14} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload size={16} />
                <span>{isUploading ? 'Uploading...' : currentLogo ? 'Change Logo' : 'Upload Logo'}</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Supports JPG, PNG, GIF. Max size: 2MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}