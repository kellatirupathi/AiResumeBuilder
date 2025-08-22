import React from 'react';
import { LoaderCircle } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading Resume Data..." }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{text}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait a moment.</p>
        </div>
    </div>
  );
};

export default LoadingSpinner;
