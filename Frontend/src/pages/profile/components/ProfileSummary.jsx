import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ProfileSummary({
  onGenerateSummary,
  isAiLoading = false,
  targetRole = "",
  onTargetRoleChange,
}) {
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.editUser.userData);

  const handleChange = (e) => {
    dispatch(addUserData({ ...profileData, summary: e.target.value }));
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
      <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              AI Summary Writer
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Generate a sharper summary for a target role without leaving the profile page.
            </p>
            <Input
              className="mt-3 bg-white"
              value={targetRole}
              onChange={(event) => onTargetRoleChange?.(event.target.value)}
              placeholder={profileData?.jobTitle || "Target role, e.g. Full Stack Developer"}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onGenerateSummary} disabled={isAiLoading}>
              {isAiLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>
      </div>

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
