import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LoaderCircle,
  BookOpen,
  FileText,
  CheckCircle,
  ThumbsUp,
  Lightbulb as LightbulbIcon,
  X,
  Wand2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

const PROMPT_GENERATE = `Create a JSON object with 3 professional summaries for a {jobTitle} position, with the following structure:
{
  "summaries": [
    {
      "level": "Entry Level",
      "text": "Enthusiastic and technically skilled {jobTitle} with foundational knowledge in [relevant technologies]..."
    },
    {
      "level": "Mid Level",
      "text": "Results-driven {jobTitle} with [X] years of experience developing and implementing..."
    },
    {
      "level": "Senior Level",
      "text": "Accomplished {jobTitle} with extensive experience leading projects and teams..."
    }
  ]
}

Each summary should be 3-4 sentences, professionally written, and focused on key skills and achievements relevant to the role.
Avoid clichés and generic statements. Focus on specific, relevant technical skills and measurable accomplishments.`;

const PROMPT_ENHANCE = `You are a professional resume writer. Rephrase and enhance the following professional summary to be more impactful for a {jobTitle} role. Focus on highlighting key achievements and skills clearly.
IMPORTANT: Your response MUST be ONLY the enhanced summary text, NOT a JSON object. For example, if the original summary is 'I am a developer', a good response would be 'A skilled developer with experience in...'. Do NOT wrap your response in JSON.

Original summary:
"{summary}"

Enhanced summary:
`;

const SUMMARY_TIPS = [
  "Keep it concise (3-4 sentences)",
  "Focus on your most relevant skills and achievements",
  "Tailor it to the specific job you're applying for",
  "Include keywords from the job description",
  "Quantify accomplishments where possible",
  "Avoid generic statements and clichés",
];

const LEVEL_COLORS = {
  "Entry Level":  { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700"   },
  "Mid Level":    { bg: "bg-indigo-50",  text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  "Senior Level": { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
};

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [aiSummaries, setAiSummaries] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const { resume_id } = useParams();

  const charCount = summary ? summary.length : 0;
  const idealCharRange = { min: 300, max: 600 };
  const charCountStatus =
    charCount === 0 ? "empty" :
    charCount < idealCharRange.min ? "tooShort" :
    charCount > idealCharRange.max ? "tooLong" : "good";

  useEffect(() => {
    setSummary(resumeInfo?.summary || "");
  }, [resumeInfo?.summary]);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, summary }));
  }, [summary]);

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { data: { summary } };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => {
          toast("Summary Updated", { description: "Your professional summary has been saved successfully" });
        })
        .catch((error) => {
          toast("Update Failed", { description: error.message, variant: "destructive" });
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const generateSummariesFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Job Title Required", { description: "Please add a job title in the Personal Details section", variant: "destructive" });
      return;
    }
    setAiGenerating(true);
    try {
      const prompt = PROMPT_GENERATE.replace(/\{jobTitle\}/g, resumeInfo?.jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      try {
        const parsedResponse = JSON.parse(responseText);
        setAiSummaries(parsedResponse.summaries);
        toast("AI Summaries Generated", { description: `Generated summaries for ${resumeInfo?.jobTitle} position` });
      } catch {
        toast("Parsing Error", { description: "Error processing AI response", variant: "destructive" });
      }
    } catch (error) {
      toast("Generation Failed", { description: error.message || "An error occurred while generating summaries", variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

  const enhanceSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Job Title Required", { description: "Please add a job title for better enhancement suggestions.", variant: "destructive" });
      return;
    }
    if (!summary || summary.trim().length < 20) {
      toast("Not enough text", { description: "Please write a brief summary before enhancing.", variant: "destructive" });
      return;
    }
    setEnhanceLoading(true);
    try {
      const prompt = PROMPT_ENHANCE.replace("{jobTitle}", resumeInfo?.jobTitle).replace("{summary}", summary);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();

      let enhancedText = responseText;
      try {
        const parsedJson = JSON.parse(responseText);
        if (Array.isArray(parsedJson) && parsedJson.length > 0) {
          enhancedText = parsedJson[0];
        } else if (typeof parsedJson === "object" && parsedJson !== null) {
          enhancedText = parsedJson.enhanced_summary || parsedJson.text || parsedJson.summary || responseText;
        }
      } catch {
        console.log("Response is not JSON, treating as plain text.");
      }

      const cleanText = enhancedText
        .trim()
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/#+\s/g, "")
        .replace(/>\s/g, "")
        .trim();

      setSummary(cleanText);
      toast.success("Summary enhanced by AI!", { description: "Your summary has been improved with AI." });
    } catch (error) {
      toast("Enhancement Failed", { description: error.message || "An error occurred.", variant: "destructive" });
    } finally {
      setEnhanceLoading(false);
    }
  };

  const applySummary = (text) => {
    setSummary(text);
    toast("Summary Applied", { description: "You can still edit the text to personalize it further" });
  };

  const getCharCountStyle = () => {
    if (charCountStatus === "empty") return "text-gray-400";
    if (charCountStatus === "tooShort") return "text-amber-500";
    if (charCountStatus === "tooLong") return "text-red-500";
    return "text-emerald-500";
  };

  const charBarColor =
    charCountStatus === "empty" ? "bg-gray-300" :
    charCountStatus === "tooShort" ? "bg-amber-400" :
    charCountStatus === "tooLong" ? "bg-red-400" : "bg-emerald-500";

  const charBarWidth =
    charCount === 0 ? "0%" :
    charCount < idealCharRange.min ? `${(charCount / idealCharRange.min) * 75}%` : "100%";

  return (
    <div className="bg-white overflow-hidden">

      {/* ── Section Header ── */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100">
            <FileText className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Professional Summary</h2>
            <p className="text-xs text-gray-400">A 3–4 sentence snapshot of your career &amp; strengths</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showTips
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
            }`}
          >
            <LightbulbIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tips</span>
          </button>

          <Button
            type="button"
            size="sm"
            onClick={enhanceSummaryFromAI}
            disabled={aiGenerating || enhanceLoading || !summary.trim()}
            className="h-8 gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 shadow-sm disabled:opacity-50"
          >
            {enhanceLoading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{enhanceLoading ? "Enhancing..." : "Enhance"}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={generateSummariesFromAI}
            disabled={aiGenerating || enhanceLoading || !resumeInfo?.jobTitle}
            className="h-8 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 shadow-sm disabled:opacity-50"
          >
            {aiGenerating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{aiGenerating ? "Generating..." : "Generate"}</span>
          </Button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">

        {/* ── Writing Tips Panel ── */}
        {showTips && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-amber-800">
                <LightbulbIcon className="h-4 w-4" />
                Tips for an effective summary
              </div>
              <button onClick={() => setShowTips(false)} className="text-amber-500 hover:text-amber-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-1 pl-1">
              {SUMMARY_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Textarea ── */}
        <form onSubmit={onSave} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                Your Professional Summary
              </label>
              <span className={`text-xs font-medium ${getCharCountStyle()}`}>
                {charCount} / {idealCharRange.min}–{idealCharRange.max}
                {charCountStatus === "good" && (
                  <span className="ml-1 inline-flex items-center gap-0.5">
                    <ThumbsUp className="h-3 w-3" /> Good
                  </span>
                )}
              </span>
            </div>

            <Textarea
              name="summary"
              value={summary}
              onChange={handleInputChange}
              className="min-h-36 resize-y text-xs border-gray-200 focus:border-violet-400 focus:ring-violet-100 transition-all leading-relaxed"
              placeholder="Describe your professional background, key skills, and what makes you stand out. Aim for 300–600 characters."
            />

            {/* Character progress bar */}
            <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${charBarColor}`}
                style={{ width: charBarWidth }}
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={loading || !summary.trim()}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 h-9 text-sm shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4" /> Save Summary</>
              )}
            </Button>
          </div>
        </form>

        {/* ── AI Suggestions ── */}
        {aiSummaries && (
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                AI-Generated Suggestions
              </h3>
              <button
                onClick={() => { setAiSummaries(null); setSelectedLevel(null); }}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {aiSummaries.map((summaryItem, index) => {
                const colors = LEVEL_COLORS[summaryItem.level] || LEVEL_COLORS["Mid Level"];
                const isSelected = selectedLevel === index;
                return (
                  <div
                    key={index}
                    className={`rounded-lg border p-3.5 transition-all ${
                      isSelected ? `${colors.border} ${colors.bg}` : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
                        <BookOpen className="h-3 w-3" />
                        {summaryItem.level}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedLevel(index); applySummary(summaryItem.text); }}
                        className={`h-7 px-2.5 text-xs transition-colors ${
                          isSelected
                            ? `${colors.border} ${colors.text} ${colors.bg}`
                            : "border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"
                        }`}
                      >
                        {isSelected ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Applied</>
                        ) : (
                          "Use This"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{summaryItem.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Summary;
