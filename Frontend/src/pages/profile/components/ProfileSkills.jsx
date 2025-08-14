import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Input } from '@/components/ui/input';
import { BadgePlus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProfileSkills() {
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
