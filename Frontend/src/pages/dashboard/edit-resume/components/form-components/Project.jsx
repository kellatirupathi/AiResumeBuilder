import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Code, LoaderCircle, Plus, Github, Globe, Save, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpleRichTextEditor from "@/components/custom/SimpleRichTextEditor";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures"; // Correct import
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { debounce } from "lodash-es";

const emptyProject = { projectName: "", techStack: "", projectSummary: "", githubLink: "", deployedLink: "" };

function FieldLabel({ icon: Icon, label }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
      <Icon className="h-3.5 w-3.5 text-gray-400" />
      {label}
    </label>
  );
}

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  
  const reduxProjectList = useSelector(state => state.editResume.resumeData?.projects) || [];
  const [localProjectList, setLocalProjectList] = useState(reduxProjectList);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalProjectList(reduxProjectList);
  }, [reduxProjectList]);
  
  const debouncedReduxUpdate = useMemo(
    () => debounce((newList) => {
        // THIS IS THE CORRECTED LINE:
        dispatch(addResumeData({ ...resumeInfo, projects: newList }));
        setHasUnsavedChanges(true);
    }, 500),
    [dispatch, resumeInfo]
  );
  
  useEffect(() => {
    return () => debouncedReduxUpdate.cancel();
  }, [debouncedReduxUpdate]);

  const addProject = () => {
    const newList = [...localProjectList, emptyProject];
    setLocalProjectList(newList);
    setActiveProject(newList.length - 1);
    debouncedReduxUpdate(newList);
  };
  
  const removeProject = async (index) => {
    const newList = localProjectList.filter((_, i) => i !== index);
    
    setLocalProjectList(newList);
    dispatch(addResumeData({ ...resumeInfo, projects: newList }));

    if (activeProject >= newList.length) {
      setActiveProject(Math.max(0, newList.length - 1));
    }
    
    try {
      await updateThisResume(resume_id, { data: { projects: newList } });
      toast.success("Project removed successfully.");
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Error removing project", { description: "Reverting change." });
      setLocalProjectList(reduxProjectList); 
      dispatch(addResumeData({ ...resumeInfo, projects: reduxProjectList }));
    }
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    
    const { name, value } = e.target;
    const newList = [...localProjectList];
    newList[index] = { ...newList[index], [name]: value };
    
    setLocalProjectList(newList);
    debouncedReduxUpdate(newList);
  };

  const handleRichTextEditor = (value, name, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);

    const newList = [...localProjectList];
    newList[index] = { ...newList[index], [name]: value };
    
    setLocalProjectList(newList);
    debouncedReduxUpdate(newList);
  };

  const onSave = async () => {
    setLoading(true);
    debouncedReduxUpdate.cancel();

    dispatch(addResumeData({ ...resumeInfo, projects: localProjectList }));
    
    const data = { data: { projects: localProjectList } };
    
    try {
      await updateThisResume(resume_id, data);
      toast.success("Project details updated successfully!");
      setHasUnsavedChanges(false);
      setEnabledNext(true);
      setEnabledPrev(true);
    } catch (error) {
      toast.error("Error updating projects", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
            <Code className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Projects</p>
            <p className="text-xs text-gray-400">Highlight your strongest builds, repos, and live demos</p>
          </div>
        </div>
        {hasUnsavedChanges && (
          <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-500">
            Unsaved
          </span>
        )}
      </div>

      <div className="space-y-4 px-5 py-5">
        {localProjectList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Code className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">No projects added yet</h3>
            <p className="mb-4 text-xs text-gray-400">Add projects to show real product work, code ownership, and results</p>
            <Button
              onClick={addProject}
              className="h-8 gap-1.5 bg-emerald-600 px-4 text-xs text-white hover:bg-emerald-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </Button>
          </div>
        )}

        {localProjectList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {localProjectList.map((project, index) => (
                <button
                  key={`tab-${index}`}
                  type="button"
                  onClick={() => setActiveProject(index)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeProject === index
                      ? "bg-emerald-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  {project.projectName || `Project ${index + 1}`}
                </button>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-emerald-300 hover:text-emerald-500"
              >
                <Plus className="h-3 w-3" /> Add More
              </button>
            </div>

            {localProjectList.map((project, index) => (
              <div
                key={`content-${index}`}
                className={`overflow-hidden rounded-lg border border-gray-100 ${activeProject === index ? "block" : "hidden"}`}
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    {project.projectName || `Project ${index + 1}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <div>
                    <FieldLabel icon={Code} label="Project Name" />
                    <Input
                      type="text"
                      name="projectName"
                      value={project?.projectName || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 border-gray-200 text-sm focus:border-emerald-400"
                      placeholder="e.g. E-commerce Website"
                    />
                  </div>

                  <div>
                    <FieldLabel icon={Wrench} label="Tech Stack" />
                    <Input
                      type="text"
                      name="techStack"
                      value={project?.techStack || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 border-gray-200 text-sm focus:border-emerald-400"
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                  </div>

                  <div>
                    <FieldLabel icon={Github} label="GitHub Repository URL" />
                    <Input
                      type="text"
                      name="githubLink"
                      value={project?.githubLink || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 border-gray-200 text-sm focus:border-emerald-400"
                      placeholder="github.com/username/project"
                    />
                  </div>

                  <div>
                    <FieldLabel icon={Globe} label="Live Demo URL" />
                    <Input
                      type="text"
                      name="deployedLink"
                      value={project?.deployedLink || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 border-gray-200 text-sm focus:border-emerald-400"
                      placeholder="myproject.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel icon={Code} label="Project Description" />
                    <SimpleRichTextEditor
                      index={index}
                      defaultValue={project?.projectSummary}
                      onRichTextEditorChange={(event) =>
                        handleRichTextEditor(event, "projectSummary", index)
                      }
                      resumeInfo={resumeInfo}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {localProjectList.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <Button
            onClick={addProject}
            variant="outline"
            className="h-8 gap-1.5 border-emerald-200 px-3 text-xs text-emerald-600 hover:bg-emerald-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Another Project
          </Button>

          <Button
            onClick={onSave}
            disabled={loading}
            className="h-8 gap-2 bg-emerald-600 px-4 text-xs text-white hover:bg-emerald-700"
          >
            {loading ? (
              <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-3.5 w-3.5" /> Save Projects</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Project;
