import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PreviewPage from '@/pages/dashboard/edit-resume/components/PreviewPage';
import { useDispatch, useSelector } from 'react-redux';
import { addResumeData } from '@/features/resume/resumeFeatures';
import { getPublicResumeData } from '@/Services/resumeAPI';
import { LoaderCircle } from 'lucide-react';

function PublicResumeView() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (resume_id) {
      const fetchPublicData = async () => {
        setIsLoading(true);
        try {
          const response = await getPublicResumeData(resume_id);
          if (response.success && response.data) {
            dispatch(addResumeData(response.data));
            setError(null);
          } else {
            setError(response.message || "Could not load resume.");
          }
        } catch (err) {
          setError(err.message || "Failed to fetch resume data.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPublicData();
    }
  }, [resume_id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-gray-500">
          <LoaderCircle className="h-12 w-12 mx-auto animate-spin text-indigo-500" />
          <p className="mt-4 text-lg">Loading Resume...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center text-red-600 p-8 border border-red-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-200 min-h-screen p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-[210mm]">
        <PreviewPage />
      </div>
    </div>
  );
}

export default PublicResumeView;
