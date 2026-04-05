import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Input } from '@/components/ui/input';
import { BadgePlus, Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProfileSkills({
    suggestedSkills = [],
    onApplySuggestedSkill,
    suggestionReason = "",
}) {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.editUser.userData);
    const skills = profileData?.skills || [];

    const handleUpdate = (newSkills) => {
        dispatch(addUserData({ ...profileData, skills: newSkills }));
    };

    const handleAddSkill = () => {
        handleUpdate([...skills, { name: "", rating: 0 }]); // Add an empty skill object
    };

    const handleRemoveSkill = (index) => {
        handleUpdate(skills.filter((_, i) => i !== index));
    };
    
    const handleSkillChange = (index, value) => {
        const newList = skills.map((item, i) =>
            i === index ? { ...item, name: value } : item
        );
        handleUpdate(newList);
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
            {(suggestedSkills.length > 0 || suggestionReason) && (
                <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        AI Skill Suggestions
                    </div>
                    {suggestionReason ? (
                        <p className="mt-2 text-sm text-slate-600">{suggestionReason}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {suggestedSkills.slice(0, 10).map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => onApplySuggestedSkill?.(skill)}
                                className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                            >
                                + {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input 
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            placeholder={`Skill #${index + 1}`}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
            </div>
        </div>
    );
}

export default ProfileSkills;
