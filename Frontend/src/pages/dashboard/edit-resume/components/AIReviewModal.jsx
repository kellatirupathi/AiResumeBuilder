import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AIChatSession } from '@/Services/AiModel';
import { toast } from 'sonner';
import { Sparkles, ThumbsUp, AlertTriangle, Lightbulb, Clipboard, LoaderCircle, BarChart3, CheckCircle, X, User, FileText, Briefcase, FolderGit, GraduationCap, BadgePlus, Award } from 'lucide-react';

const MASTER_PROMPT = `
I need you to act as a professional career coach and resume expert. Analyze this resume data and provide a detailed evaluation with specific, accurate percentage scores.

The resume belongs to a job seeker and contains the following data:
{resumeData}

Please analyze each section carefully and provide scores based on completeness, quality, and impact:

IMPORTANT: For any section that is completely empty (not filled in at all), assign a score of exactly 0%. Do not give any default minimum score.

For Personal Details:
- Score 0% if completely empty
- Score 40-60% if only basic fields are filled 
- Score 70-80% if most fields are complete
- Score 90-100% if all fields are complete with professional contact information

For Professional Summary:
- Score 0% if completely empty
- Otherwise, score based on length, specificity, relevance, and impact
- Evaluate whether it effectively communicates career goals and value proposition

For Work Experience:
- Score 0% if completely empty
- Otherwise evaluate based on number of entries, detail level, use of action verbs, and quantifiable achievements
- Higher scores for comprehensive descriptions with metrics and results

For Education:
- Score 0% if completely empty
- Otherwise score based on completeness of degree information, dates, and relevant details

For Skills:
- Score 0% if completely empty
- Otherwise evaluate based on number of skills, relevance, organization, and rating consistency

For Projects:
- Score 0% if completely empty
- Otherwise score based on detail level, technology descriptions, and connection to skills

For Certifications:
- Score 0% if completely empty
- Otherwise score based on completeness of certification information, including name, issuer, dates, and credential ID
- Higher scores for recent, relevant certifications with complete details

Format your response exactly as a valid JSON object with the following structure:
{
  "scores": {
    "personal": [0-100 number],
    "summary": [0-100 number],
    "experience": [0-100 number], 
    "education": [0-100 number],
    "skills": [0-100 number],
    "projects": [0-100 number],
    "certifications": [0-100 number],
    "totalScore": [0-100 number]
  },
  "analysis": {
    "strengths": [array of specific strengths found in this resume],
    "weaknesses": [array of specific areas for improvement]
  },
  "suggestions": [array of specific, actionable improvement suggestions]
}

Ensure your scores are fair but realistic reflections of the resume quality. Remember to give a score of 0% to any completely empty sections. The overall totalScore should be a weighted average (personal 15%, summary 15%, experience 20%, education 15%, skills 15%, projects 10%, certifications 10%).
`;

function AIReviewModal({ isOpen, onClose, resumeInfo }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStage, setCurrentStage] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const formatResumeData = (resume) => {
    if (!resume) return "No resume data available.";

    let content = "";
    
    // Personal Info
    content += `Name: ${resume.firstName || ""} ${resume.lastName || ""}\n`;
    if (resume.jobTitle) content += `Job Title: ${resume.jobTitle}\n`;
    if (resume.email) content += `Email: ${resume.email}\n`;
    if (resume.phone) content += `Phone: ${resume.phone}\n`;
    if (resume.address) content += `Location: ${resume.address}\n\n`;

    // Summary
    if (resume.summary) {
      content += `SUMMARY\n${resume.summary.replace(/<[^>]*>?/gm, '')}\n\n`;
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      content += "SKILLS\n";
      resume.skills.forEach(skill => {
        if (skill.name) content += `${skill.name}\n`;
      });
      content += "\n";
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      content += "EXPERIENCE\n";
      resume.experience.forEach(exp => {
        if (exp.title) content += `${exp.title}`;
        if (exp.companyName) content += ` at ${exp.companyName}`;
        if (exp.city || exp.state) {
          content += ` (${exp.city || ""}${exp.city && exp.state ? ", " : ""}${exp.state || ""})`;
        }
        if (exp.startDate || exp.endDate || exp.currentlyWorking) {
          content += ` | ${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""}`;
        }
        content += "\n";
        if (exp.workSummary) {
          const plainWorkSummary = exp.workSummary.replace(/<[^>]*>?/gm, ' ');
          content += `${plainWorkSummary}\n`;
        }
        content += "\n";
      });
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      content += "PROJECTS\n";
      resume.projects.forEach(project => {
        if (project.projectName) content += `${project.projectName}\n`;
        if (project.techStack) content += `Technologies: ${project.techStack}\n`;
        if (project.githubLink) content += `GitHub: ${project.githubLink}\n`;
        if (project.deployedLink) content += `Deployed: ${project.deployedLink}\n`;
        if (project.projectSummary) {
          const plainProjectSummary = project.projectSummary.replace(/<[^>]*>?/gm, ' ');
          content += `${plainProjectSummary}\n`;
        }
        content += "\n";
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      content += "EDUCATION\n";
      resume.education.forEach(edu => {
        if (edu.degree) content += `${edu.degree}`;
        if (edu.major) content += ` in ${edu.major}`;
        content += "\n";
        if (edu.universityName) content += `${edu.universityName}`;
        if (edu.startDate || edu.endDate) {
          content += ` | ${edu.startDate || ""} - ${edu.endDate || ""}`;
        }
        content += "\n";
        if (edu.grade && edu.gradeType) {
          content += `${edu.gradeType}: ${edu.grade}\n`;
        }
        if (edu.description) {
            content += `${edu.description}\n`;
        }
        content += "\n";
      });
    }
    
    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      content += "CERTIFICATIONS\n";
      resume.certifications.forEach(cert => {
        if (cert.name) content += `${cert.name}\n`;
        if (cert.issuer) content += `Issuer: ${cert.issuer}\n`;
        if (cert.date) content += `Date: ${cert.date}\n`;
        if (cert.description) content += `${cert.description}\n`;
        content += "\n";
      });
    }

    // Additional Sections
    if (resume.additionalSections && resume.additionalSections.length > 0) {
      resume.additionalSections.forEach(section => {
        if(section.title && section.content) {
          content += `${section.title.toUpperCase()}\n`;
          content += `${section.content.replace(/<[^>]*>?/gm, ' ')}\n\n`;
        }
      });
    }
    
    return content;
  };
  
  const handleAnalysis = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setAnalysisProgress(0);

    const stages = [
      { text: "Analyzing Personal Details...", icon: <User className="h-8 w-8 text-indigo-400" /> },
      { text: "Evaluating Summary...", icon: <FileText className="h-8 w-8 text-indigo-400" /> },
      { text: "Checking Experience Section...", icon: <Briefcase className="h-8 w-8 text-indigo-400" /> },
      { text: "Analyzing Projects...", icon: <FolderGit className="h-8 w-8 text-indigo-400" /> },
      { text: "Reviewing Education...", icon: <GraduationCap className="h-8 w-8 text-indigo-400" /> },
      { text: "Verifying Skills...", icon: <BadgePlus className="h-8 w-8 text-indigo-400" /> },
      { text: "Checking Certifications...", icon: <Award className="h-8 w-8 text-indigo-400" /> },
      { text: "Finalizing Score...", icon: <BarChart3 className="h-8 w-8 text-indigo-400" /> },
    ];
    
    const runSimulation = async () => {
      for (let i = 0; i < stages.length; i++) {
        if (!loadingRef.current) break; // Check if loading was cancelled
        setCurrentStage(stages[i]);
        setAnalysisProgress(((i + 1) / stages.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 600)); // Delay for each stage
      }
    };
    
    const performApiCall = async () => {
        try {
            const formattedData = formatResumeData(resumeInfo);
            const prompt = MASTER_PROMPT.replace('{resumeData}', formattedData);
            const aiResponse = await AIChatSession.sendMessage(prompt);
            const parsedResult = JSON.parse(aiResponse.response.text());
            return parsedResult;
        } catch (err) {
            setError("Failed to get AI analysis. The model may be busy, please try again in a moment.");
            toast.error("AI Analysis Failed", { description: err.message });
            return null;
        }
    };

    const [apiResult] = await Promise.all([performApiCall(), runSimulation()]);
    
    if (apiResult) {
      setResult(apiResult);
    }
    
    setLoading(false);
  };
  
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const AnalysisLoader = () => (
    <div className="flex flex-col items-center justify-center py-12">
        <div className="relative h-24 w-24 mb-6">
            <LoaderCircle className="h-24 w-24 text-indigo-200 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
                {currentStage.icon || <Sparkles className="h-8 w-8 text-indigo-400" />}
            </div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Analyzing Your Resume...</h3>
            <p className="text-indigo-600 font-medium">{currentStage.text}</p>
        </div>
        <div className="mt-8 w-full max-w-md">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                ></div>
            </div>
        </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-indigo-500" /> AI Resume Review</DialogTitle>
          <DialogDescription>Get instant feedback and suggestions from our AI-powered career coach to improve your resume.</DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <AnalysisLoader />
          ) : error ? (
             <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">{error}</div>
          ) : result ? (
            <div className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">Overall Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(result.scores.totalScore)}`}>{result.scores.totalScore}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className={`${getScoreColor(result.scores.totalScore).replace('text-','bg-')} h-2.5 rounded-full`} style={{width: `${result.scores.totalScore}%`}}></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2"><ThumbsUp className="h-5 w-5" />Strengths</h4>
                  <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                    {result.analysis.strengths.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2"><AlertTriangle className="h-5 w-5" />Weaknesses</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {result.analysis.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5" />Suggestions</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    {result.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        
        <DialogFooter className="p-6 border-t">
          {!result ? (
            <Button className="w-full" onClick={handleAnalysis} disabled={loading}>
              {loading ? 'Analyzing...' : 'Start AI Analysis'}
            </Button>
          ) : (
            <div className='w-full flex justify-between'>
                <Button variant="outline" onClick={() => { setResult(null); setAnalysisProgress(0); setCurrentStage(''); }}>Analyze Again</Button>
                <Button onClick={onClose}>Close</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AIReviewModal;
