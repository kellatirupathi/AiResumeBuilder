import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import { FolderGit, Plus, Trash2 } from 'lucide-react';

const emptyProject = { projectName: "", techStack: "", projectSummary: "", githubLink: "", deployedLink: "" };

function ProfileProjects() {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.editUser.userData);
    const projectList = profileData?.projects || [];

    const handleUpdate = (newList) => {
        dispatch(addUserData({ ...profileData, projects: newList }));
    };

    const handleAddProject = () => {
        handleUpdate([...projectList, emptyProject]);
    };

    const handleRemoveProject = (index) => {
        handleUpdate(projectList.filter((_, i) => i !== index));
    };

    const handleProjectChange = (index, field, value) => {
        const newList = projectList.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        handleUpdate(newList);
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">

            <div className="space-y-6">
                {projectList.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50/50 relative">
                        <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleRemoveProject(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Project Name</label>
                                <Input value={project.projectName} onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium">Tech Stack</label>
                                <Input value={project.techStack} onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)} placeholder="e.g., React, Node.js" />
                            </div>
                            <div>
                                <label className="text-xs font-medium">GitHub URL</label>
                                <Input value={project.githubLink} onChange={(e) => handleProjectChange(index, 'githubLink', e.target.value)} />
                            </div>
                             <div>
                                <label className="text-xs font-medium">Live Demo URL</label>
                                <Input value={project.deployedLink} onChange={(e) => handleProjectChange(index, 'deployedLink', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium">Project Summary</label>
                                <GenericRichTextEditor 
                                    defaultValue={project.projectSummary}
                                    onUpdate={(val) => handleProjectChange(index, 'projectSummary', val)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={handleAddProject}>
                    <Plus className="h-4 w-4 mr-2" /> Add Project
                </Button>
            </div>
        </div>
    );
}

export default ProfileProjects;
