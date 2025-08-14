import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { VITE_APP_URL } from '@/config/config';

// Helper function to calculate scores for different sections of a resume.
// This provides a quick glance at the completeness of each resume.
const calculateResumeScores = (resume) => {
  if (!resume) return {};

  const scores = {
    personal: 0,
    summary: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
    certifications: 0,
  };

  // Personal Details Score (based on filled fields)
  const personalFields = [resume.firstName, resume.lastName, resume.jobTitle, resume.email, resume.phone, resume.address];
  const filledPersonalFields = personalFields.filter(field => field && field.trim().length > 0).length;
  scores.personal = personalFields.length > 0 ? Math.round((filledPersonalFields / personalFields.length) * 100) : 0;

  // Summary Score (based on length)
  const summaryLength = resume.summary?.trim().length || 0;
  if (summaryLength > 300) scores.summary = 95;
  else if (summaryLength > 150) scores.summary = 80;
  else if (summaryLength > 50) scores.summary = 60;
  else if (summaryLength > 0) scores.summary = 40;
  
  // Experience Score (based on number and completeness of entries)
  if (resume.experience?.length > 0) {
    const totalPossibleScore = resume.experience.length * 100;
    let totalScore = 0;
    resume.experience.forEach(exp => {
      let entryScore = 0;
      if (exp.title) entryScore += 20;
      if (exp.companyName) entryScore += 20;
      if (exp.startDate) entryScore += 10;
      if (exp.endDate || exp.currentlyWorking) entryScore += 10;
      if (exp.workSummary?.trim().length > 50) entryScore += 40;
      totalScore += entryScore;
    });
    scores.experience = Math.round((totalScore / totalPossibleScore) * 100) || 0;
  }

  // Education Score
  if (resume.education?.length > 0) {
    const eduCount = resume.education.length;
    let totalScore = 0;
    resume.education.forEach(edu => {
        let entryScore = 0;
        if(edu.universityName) entryScore += 30;
        if(edu.degree) entryScore += 25;
        if(edu.startDate) entryScore += 10;
        if(edu.endDate) entryScore += 10;
        if(edu.grade) entryScore += 15;
        if(edu.description?.trim().length > 20) entryScore += 10;
        totalScore += entryScore/100;
    });
    scores.education = Math.min(100, Math.round((totalScore/eduCount)*100));
  }

  // Skills Score
  const skillsCount = resume.skills?.length || 0;
  if (skillsCount >= 10) scores.skills = 95;
  else if (skillsCount >= 7) scores.skills = 80;
  else if (skillsCount >= 5) scores.skills = 70;
  else if (skillsCount >= 3) scores.skills = 60;
  else if (skillsCount > 0) scores.skills = 50;

  // Projects Score
  if (resume.projects?.length > 0) {
    const projCount = resume.projects.length;
    let totalScore = 0;
    resume.projects.forEach(proj => {
        let entryScore = 0;
        if (proj.projectName) entryScore += 30;
        if (proj.techStack) entryScore += 25;
        if (proj.projectSummary?.trim().length > 50) entryScore += 45;
        totalScore += entryScore/100;
    });
    scores.projects = Math.min(100, Math.round((totalScore/projCount)*100));
  }

  // Certifications Score
  if (resume.certifications?.length > 0) {
    const certCount = resume.certifications.length;
    let totalScore = 0;
    resume.certifications.forEach(cert => {
        let entryScore = 0;
        if(cert.name) entryScore += 40;
        if(cert.issuer) entryScore += 30;
        if(cert.date) entryScore += 15;
        if(cert.credentialLink) entryScore += 15;
        totalScore += entryScore/100;
    });
    scores.certifications = Math.min(100, Math.round((totalScore/certCount)*100));
  }

  return scores;
};

// A small component to render the score with color-coding for quick visual feedback
const ScoreCell = ({ score }) => {
  let colorClass = 'text-gray-500';
  if (score >= 80) colorClass = 'text-green-600';
  else if (score >= 50) colorClass = 'text-yellow-600';
  else if (score > 0) colorClass = 'text-red-600';

  return (
    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
      <span className={`font-semibold ${colorClass}`}>{score}%</span>
    </td>
  );
};

function UserResumesModal({ isOpen, onClose, user }) {
  if (!user) {
    return null;
  }

  const resumesWithScores = user.resumes?.map(resume => ({
    ...resume,
    scores: calculateResumeScores(resume),
  })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl"> {/* CHANGED: Increased max-width */}
        <DialogHeader>
          <DialogTitle>Resumes for {user.fullName}</DialogTitle>
          <DialogDescription>
            This user has created {resumesWithScores.length} resume(s). Scores represent section completeness.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[85vh] overflow-y-auto border-t pt-4"> {/* CHANGED: Increased max-height */}
          {resumesWithScores.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Resume Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Public Link
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Details
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Summary
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Experience
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Projects
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Education
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Skills
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                    Certifications
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resumesWithScores.map(resume => (
                  <tr key={resume._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {resume.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a 
                        href={`${VITE_APP_URL.replace(/\/$/, '')}/api/pdf/public/${resume._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View PDF
                      </a>
                    </td>
                    <ScoreCell score={resume.scores.personal} />
                    <ScoreCell score={resume.scores.summary} />
                    <ScoreCell score={resume.scores.experience} />
                    <ScoreCell score={resume.scores.projects} />
                    <ScoreCell score={resume.scores.education} />
                    <ScoreCell score={resume.scores.skills} />
                    <ScoreCell score={resume.scores.certifications} />
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">This user has not created any resumes yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserResumesModal;
