import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus, Sparkles, XCircle, Code, Database, Server, Cloud, CheckCircle2, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";

const MAX_SKILL_LINES = 4;

const SKILL_CATEGORIES = [
  { key: "Frontend", label: "Frontend", icon: <Code className="h-4 w-4" />, placeholder: "HTML, CSS, JavaScript, React, TypeScript, Redux..." },
  { key: "Backend", label: "Backend", icon: <Server className="h-4 w-4" />, placeholder: "Node.js, Express.js, Python, REST API, GraphQL..." },
  { key: "Database", label: "Database", icon: <Database className="h-4 w-4" />, placeholder: "MongoDB, MySQL, PostgreSQL, SQLite, Redis..." },
  { key: "DevOps", label: "Other", icon: <Cloud className="h-4 w-4" />, placeholder: "AWS, Docker, CI/CD, Git, GitHub Actions..." }
];

const PROMPT = `Based on the job title "{jobTitle}", provide EXACTLY 4 lines of related skills. 
Format the response as a JSON object with these 4 key-value pairs:
{
  "line1": "HTML, CSS, JavaScript, React, TypeScript, Redux",
  "line2": "Node.js, Express.js, REST API, GraphQL",
  "line3": "MongoDB, PostgreSQL, Redis, Firebase",
  "line4": "Git, GitHub, Docker, AWS, CI/CD"
}

The first line should contain frontend skills, the second line backend skills, the third line database skills, and the fourth line DevOps/other skills. 
Each line should contain 4-6 related skills, comma-separated.`;

function Skills({ resumeInfo }) {
  const [skillLines, setSkillLines] = useState(Array(MAX_SKILL_LINES).fill(""));
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const dispatch = useDispatch();
  const { resume_id } = useParams();
  const hasSkills = skillLines.some((line) => line && line.trim() !== "");

  // Helper: convert skillLines array to skills objects and dispatch to Redux.
  // Preserve empty slots so that deleting a middle row doesn't shift lower rows up.
  const dispatchSkillsToRedux = (lines) => {
    const padded = Array(MAX_SKILL_LINES).fill("");
    lines.forEach((line, index) => {
      if (index < MAX_SKILL_LINES) padded[index] = line || "";
    });
    const skillsArray = padded.map((line) => ({ name: line }));
    dispatch(addResumeData({ ...resumeInfo, skills: skillsArray }));
  };

  // Sync local skillLines from Redux whenever resumeInfo.skills changes (initial load or import).
  useEffect(() => {
    if (resumeInfo?.skills && resumeInfo.skills.length > 0) {
      const lines = Array(MAX_SKILL_LINES).fill("");
      resumeInfo.skills.forEach((skill, index) => {
        if (index < MAX_SKILL_LINES && skill.name) {
          lines[index] = skill.name;
        }
      });
      setSkillLines(lines);
    } else {
      setSkillLines(Array(MAX_SKILL_LINES).fill(""));
    }
  }, [resumeInfo?.skills]);

  const handleLineChange = (index, value) => {
    const newLines = [...skillLines];
    newLines[index] = value;
    setSkillLines(newLines);
    dispatchSkillsToRedux(newLines);
  };

  const addNewLine = () => {
    for (let i = 0; i < MAX_SKILL_LINES; i++) {
      if (!skillLines[i] || skillLines[i].trim() === "") {
        setActiveLineIndex(i);
        return;
      }
    }
    setActiveLineIndex(MAX_SKILL_LINES - 1);
  };

  const onSave = () => {
    setLoading(true);
    // Persist all 4 slots, including blanks, so the category/position of a
    // cleared row is preserved when the resume is reloaded. The right-side
    // preview templates already skip empty-name entries.
    const padded = Array(MAX_SKILL_LINES).fill("");
    skillLines.forEach((line, index) => {
      if (index < MAX_SKILL_LINES) padded[index] = line || "";
    });
    const skillsArray = padded.map((line) => ({ name: line }));

    const data = {
      data: { skills: skillsArray },
    };

    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => {
          toast.success("Skills updated successfully", {
            description: "Your resume skills have been saved"
          });
        })
        .catch((error) => {
          toast.error("Error updating skills", {
            description: error.message,
            variant: "destructive"
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const generateSkillsFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Job title required", {
        description: "Please add a job title in the Personal Details section to get AI suggestions",
        variant: "destructive"
      });
      return;
    }

    setAiLoading(true);
    try {
      const prompt = PROMPT.replace("{jobTitle}", resumeInfo.jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        const parsedResponse = JSON.parse(responseText);
        setAiSuggestions(parsedResponse);
        
        toast("AI skills generated", {
          description: `Skill suggestions for ${resumeInfo.jobTitle} are ready`,
        });
      } catch (error) {
        console.error("Error parsing AI response:", error);
        toast("Could not parse AI response", {
          description: "Try again or add skills manually",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      toast("Error generating skills", {
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = (lineIndex) => {
    if (!aiSuggestions) return;
    
    const lineKey = `line${lineIndex + 1}`;
    if (aiSuggestions[lineKey]) {
      const newLines = [...skillLines];
      newLines[lineIndex] = aiSuggestions[lineKey];
      setSkillLines(newLines);
      dispatchSkillsToRedux(newLines);
      
      toast(`Line ${lineIndex + 1} updated`, {
        description: "Skills suggestion applied"
      });
    }
  };

  const applyAllAiSuggestions = () => {
    if (!aiSuggestions) return;
    
    const newLines = [...skillLines];
    for (let i = 0; i < MAX_SKILL_LINES; i++) {
      const lineKey = `line${i + 1}`;
      if (aiSuggestions[lineKey]) {
        newLines[i] = aiSuggestions[lineKey];
      }
    }
    
    setSkillLines(newLines);
    dispatchSkillsToRedux(newLines);
    setAiSuggestions(null);
    
    toast("All suggestions applied", {
      description: "All AI suggestions have been applied to your skills"
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Skills</p>
            <p className="text-xs text-gray-400">Group your strongest skills by area for a cleaner resume section</p>
          </div>
        </div>

        <Button
          onClick={generateSkillsFromAI}
          disabled={aiLoading || !resumeInfo?.jobTitle}
          className="h-8 gap-1.5 bg-teal-600 px-4 text-xs text-white hover:bg-teal-700"
        >
          {aiLoading ? (
            <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-3.5 w-3.5" /> Generate Skills</>
          )}
        </Button>
      </div>

      <div className="space-y-4 px-5 py-5">
        {aiSuggestions && (
          <div className="rounded-lg border border-teal-100 bg-teal-50/70 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  AI Suggestions for {resumeInfo.jobTitle}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">Apply one category at a time or use all suggestions together</p>
              </div>
              <button
                onClick={() => setAiSuggestions(null)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
                title="Dismiss suggestions"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {Array(MAX_SKILL_LINES).fill(0).map((_, index) => {
                const lineKey = `line${index + 1}`;
                const category = SKILL_CATEGORIES[index];
                return (
                  <div key={index} className="flex flex-col gap-2 rounded-lg border border-white bg-white p-3 sm:flex-row sm:items-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                      {category.icon}
                      <span>{category.label}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-700">
                      {aiSuggestions[lineKey] || "No suggestion"}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-teal-200 px-3 text-xs text-teal-700 hover:bg-teal-50"
                      onClick={() => applyAiSuggestion(index)}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Apply
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={applyAllAiSuggestions}
                className="h-8 bg-teal-600 px-4 text-xs text-white hover:bg-teal-700"
              >
                Apply All Suggestions
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {SKILL_CATEGORIES.map((category, index) => (
            <div key={index} className="rounded-lg border border-gray-100 p-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                {category.icon}
                <span>{category.label} Skills</span>
              </label>

              <div className="relative">
                <Input
                  value={skillLines[index]}
                  onChange={(e) => handleLineChange(index, e.target.value)}
                  placeholder={category.placeholder}
                  className={`h-9 bg-white pr-9 text-sm ${
                    activeLineIndex === index
                      ? 'border-teal-400 ring-2 ring-teal-100'
                      : 'border-gray-200 hover:border-gray-300 focus:border-teal-400'
                  }`}
                  onFocus={() => setActiveLineIndex(index)}
                />
                {skillLines[index] && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => handleLineChange(index, "")}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>

              {!skillLines[index] && (
                <p className="mt-1.5 text-xs text-gray-400">Enter comma-separated {category.label.toLowerCase()} skills</p>
              )}
            </div>
          ))}

          {skillLines.some(line => !line || line.trim() === "") && (
            <Button
              variant="outline"
              onClick={addNewLine}
              className="h-8 w-full justify-center gap-1.5 border-dashed border-gray-300 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <Plus className="h-3.5 w-3.5" /> Focus on Next Empty Line
            </Button>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-md bg-teal-50 p-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Preview</h3>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50/40 p-4">
            {hasSkills ? (
              <div className="space-y-2">
                {skillLines.map((line, index) => (
                  line && line.trim() !== "" ? (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        {SKILL_CATEGORIES[index].icon}
                      </div>
                      <p className="text-sm text-gray-800">{line}</p>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-gray-100 p-3">
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">No skills added yet</p>
                <p className="mt-1 text-xs text-gray-400">Enter skills above or use AI suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 px-5 py-4">
        <Button
          onClick={onSave}
          disabled={loading || !hasSkills}
          className="h-8 gap-2 bg-teal-600 px-4 text-xs text-white hover:bg-teal-700"
        >
          {loading ? (
            <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-3.5 w-3.5" /> Save Skills</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
