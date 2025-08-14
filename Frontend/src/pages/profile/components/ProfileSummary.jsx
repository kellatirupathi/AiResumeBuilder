import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

function ProfileSummary() {
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.editUser.userData);

  const handleChange = (e) => {
    dispatch(addUserData({ ...profileData, summary: e.target.value }));
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
      
      <div>
        <label htmlFor="masterSummary" className="text-sm font-medium text-gray-700">Your Summary</label>
        <Textarea
          id="masterSummary"
          className="mt-1 min-h-40"
          value={profileData?.summary || ''}
          onChange={handleChange}
          placeholder="Craft a compelling summary of your career, skills, and goals..."
        />
      </div>
    </div>
  );
}

export default ProfileSummary;
