import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DatabaseStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export function DatabaseStatus({ isConnected, isLoading, error }: DatabaseStatusProps) {
  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700 font-medium">Connecting to Backend...</span>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700 font-medium">Backend Connected</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 shadow-md z-50">
        <div className="flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-sm text-red-700 font-medium">Backend Connection Failed</span>
        </div>
      </div>
    );
  }

  return null;
}
