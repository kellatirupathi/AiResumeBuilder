import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { getResumesByUser } from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, FileText, Download, GraduationCap, Briefcase,
  Code, FolderOpen, Award, Layers, Globe, Linkedin, Github, Phone, MapPin
} from "lucide-react";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Badge({ children, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function ResumeCard({ resume }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Resume Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: resume.themeColor || "#6366f1" }} />
          <div>
            <p className="text-sm font-bold text-gray-800">{resume.title}</p>
            <p className="text-xs text-gray-500 capitalize">
              {resume.template} · {resume.viewCount || 0} views · Created {format(new Date(resume.createdAt), "PP")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {resume.googleDriveLink && (
            <a href={resume.googleDriveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              <Download className="h-3 w-3" /> PDF
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-indigo-600 hover:underline">
            {expanded ? "Collapse" : "View Full Data"}
          </button>
        </div>
      </div>

      {/* Basic info always visible */}
      <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-gray-100 text-xs text-gray-600">
        {resume.firstName && <span><span className="text-gray-400">Name: </span>{resume.firstName} {resume.lastName}</span>}
        {resume.email && <span><span className="text-gray-400">Email: </span>{resume.email}</span>}
        {resume.phone && <span><span className="text-gray-400">Phone: </span>{resume.phone}</span>}
        {resume.jobTitle && <span><span className="text-gray-400">Job Title: </span>{resume.jobTitle}</span>}
        {resume.address && <span><span className="text-gray-400">Address: </span>{resume.address}</span>}
        {resume.themeColor && <span><span className="text-gray-400">Theme: </span>{resume.themeColor}</span>}
      </div>

      {/* Expanded full data */}
      {expanded && (
        <div className="p-5 space-y-5 bg-gray-50/50">

          {/* Links */}
          {(resume.githubUrl || resume.linkedinUrl || resume.portfolioUrl) && (
            <div className="flex flex-wrap gap-3">
              {resume.githubUrl && <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Github className="h-3 w-3" /> GitHub</a>}
              {resume.linkedinUrl && <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Linkedin className="h-3 w-3" /> LinkedIn</a>}
              {resume.portfolioUrl && <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Globe className="h-3 w-3" /> Portfolio</a>}
            </div>
          )}

          {/* Summary */}
          {resume.summary && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Summary</p>
              <p className="text-xs text-gray-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills ({resume.skills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s, i) => <Badge key={i} color="indigo">{s.name || s}</Badge>)}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Experience ({resume.experience.length})</p>
              <div className="space-y-3">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{exp.title}</p>
                        <p className="text-xs text-gray-500">{exp.companyName} {exp.city && `· ${exp.city}`}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {exp.startDate} {exp.startDate && "–"} {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.workSummary && (
                      <div className="mt-1.5 text-xs text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: exp.workSummary }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Education ({resume.education.length})</p>
              <div className="space-y-3">
                {resume.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{edu.universityName}</p>
                        <p className="text-xs text-gray-500">{edu.degree} {edu.major && `· ${edu.major}`}</p>
                        {edu.grade && <p className="text-xs text-gray-400">Grade: {edu.grade}</p>}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {edu.startDate} {edu.startDate && "–"} {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Projects ({resume.projects.length})</p>
              <div className="space-y-3">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex justify-between gap-2">
                      <p className="text-xs font-semibold text-gray-800">{proj.projectName}</p>
                      {proj.projectUrl && <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex-shrink-0">Link</a>}
                    </div>
                    {proj.techStack && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.techStack.split(",").map((t, j) => <Badge key={j} color="blue">{t.trim()}</Badge>)}
                      </div>
                    )}
                    {proj.projectSummary && (
                      <div className="mt-1.5 text-xs text-gray-600"
                        dangerouslySetInnerHTML={{ __html: proj.projectSummary }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Certifications ({resume.certifications.length})</p>
              <div className="space-y-2">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="flex items-start justify-between rounded-lg border border-gray-100 bg-white p-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                      {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Credential</a>}
                    </div>
                    {cert.date && <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{cert.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections */}
          {resume.additionalSections?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Additional Sections ({resume.additionalSections.length})</p>
              <div className="space-y-3">
                {resume.additionalSections.map((sec, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
                    <p className="text-xs font-semibold text-gray-800 mb-1">{sec.title}</p>
                    <div className="text-xs text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sec.content }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminUserResumesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getResumesByUser(userId)
      .then((res) => setData(res.data))
      .catch((err) => {
        toast.error("Failed to load resumes", { description: err.message });
        navigate("/admin/resumes");
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  const { user, resumes } = data;

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <Button variant="outline" onClick={() => navigate("/admin/resumes")} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resumes
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{user.fullName}'s Resumes</h1>
          <p className="mt-0.5 text-xs text-gray-500">{user.email} · {resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FileText className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">No resumes found</p>
            <p className="text-sm">This user hasn't created any resumes yet.</p>
          </div>
        ) : (
          resumes.map((resume) => <ResumeCard key={resume._id} resume={resume} />)
        )}
      </main>
    </>
  );
}
