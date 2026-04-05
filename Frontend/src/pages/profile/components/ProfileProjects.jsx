import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import { FolderGit, Plus, Trash2, Sparkles, LoaderCircle, MessageSquareMore } from 'lucide-react';

const emptyProject = { projectName: "", techStack: "", projectSummary: "", githubLink: "", deployedLink: "" };

function ProfileProjects({
    onGenerateProject,
    onEnhanceProject,
    loadingMap = {},
    generateLoadingMap = {},
    impactQuestions = {},
    targetRole = "",
}) {
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
                        <div className="mb-4 rounded-2xl border border-emerald-100 bg-white p-3">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">AI Project Generator</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => onGenerateProject?.(index)}
                                        disabled={generateLoadingMap[index]}
                                    >
                                        {generateLoadingMap[index] ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Generate
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => onEnhanceProject?.(index)}
                                        disabled={loadingMap[index]}
                                    >
                                        {loadingMap[index] ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Enhance With AI
                                    </Button>
                                </div>
                            </div>
                            {impactQuestions[index]?.length > 0 && (
                                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                        <MessageSquareMore className="h-3.5 w-3.5" />
                                        Impact Finder Questions
                                    </div>
                                    <ul className="mt-2 space-y-2 text-sm text-emerald-900">
                                        {impactQuestions[index].map((question) => (
                                            <li key={question} className="flex gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                                                <span>{question}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
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
