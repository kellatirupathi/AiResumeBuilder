import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, FileText, Download, Mail, Phone, MapPin, Briefcase,
  Github, Linkedin, Globe, BadgeCheck, BadgeX, GraduationCap,
  Code, FolderOpen, Award, BookOpen, Layers
} from "lucide-react";
import { useAdminUserDetailQuery } from "@/hooks/useAdminQueryData";

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

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col py-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 break-all">{value}</span>
    </div>
  );
}

function Badge({ children, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const userDetailQuery = useAdminUserDetailQuery(userId);
  const data = userDetailQuery.data;
  const loading = userDetailQuery.isPending && !data;

  useEffect(() => {
    if (!userDetailQuery.isError) {
      return;
    }

    toast.error("Failed to load user");
    navigate("/admin/users");
  }, [navigate, userDetailQuery.isError]);

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
        <Button variant="outline" onClick={() => navigate("/admin/users")} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white flex-shrink-0">
            {(user.fullName || "").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user.fullName}</h1>
            <p className="text-xs text-gray-500">{user.email} · Joined {format(new Date(user.createdAt), "PPP")}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Profile */}
          <div className="lg:col-span-1 space-y-5">
            <Section title="Profile" icon={Briefcase}>
              <div className="space-y-0.5">
                <InfoRow label="Full Name" value={user.fullName} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phone} />
                <InfoRow label="Address" value={user.address} />
                <InfoRow label="Job Title" value={user.jobTitle} />
                <InfoRow label="Student ID" value={user.niatId} />
                <InfoRow label="User Type" value={user.userType} />
                <InfoRow label="Auth Provider" value={user.authProvider} />
                <div className="flex flex-col py-1.5">
                  <span className="text-xs text-gray-400">ID Verified</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {user.niatIdVerified
                      ? <><BadgeCheck className="h-4 w-4 text-emerald-500" /><span className="text-sm text-emerald-600">Verified</span></>
                      : <><BadgeX className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-500">Not Verified</span></>}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Links" icon={Globe}>
              <div className="space-y-2">
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                    <Github className="h-4 w-4 flex-shrink-0" /><span className="truncate">{user.githubUrl}</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                    <Linkedin className="h-4 w-4 flex-shrink-0" /><span className="truncate">{user.linkedinUrl}</span>
                  </a>
                )}
                {user.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                    <Globe className="h-4 w-4 flex-shrink-0" /><span className="truncate">{user.portfolioUrl}</span>
                  </a>
                )}
                {!user.githubUrl && !user.linkedinUrl && !user.portfolioUrl && (
                  <p className="text-xs text-gray-400">No links added</p>
                )}
              </div>
            </Section>

            <Section title="Resumes" icon={FileText}>
              {resumes.length === 0 ? (
                <p className="text-xs text-gray-400">No resumes created yet</p>
              ) : (
                <div className="space-y-2">
                  {resumes.map((r) => (
                    <div key={r._id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.themeColor || "#6366f1" }} />
                        <span className="text-xs font-medium text-gray-700 truncate">{r.title}</span>
                      </div>
                      {r.googleDriveLink && (
                        <a href={r.googleDriveLink} target="_blank" rel="noopener noreferrer" className="ml-2 flex-shrink-0">
                          <Download className="h-3 w-3 text-blue-500 hover:text-blue-700" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Right side */}
          <div className="lg:col-span-2 space-y-5">

            {/* Summary */}
            {user.summary && (
              <Section title="Summary" icon={BookOpen}>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{user.summary}</p>
              </Section>
            )}

            {/* Skills */}
            {user.skills?.length > 0 && (
              <Section title={`Skills (${user.skills.length})`} icon={Code}>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <Badge key={i} color="indigo">{skill.name || skill}</Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Experience */}
            {user.experience?.length > 0 && (
              <Section title={`Experience (${user.experience.length})`} icon={Briefcase}>
                <div className="space-y-4">
                  {user.experience.map((exp, i) => (
                    <div key={i} className={i > 0 ? "border-t border-gray-100 pt-4" : ""}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
                          <p className="text-xs text-gray-500">{exp.companyName}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                          {exp.startDate} {exp.startDate && "—"} {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.workSummary && (
                        <div className="mt-2 text-xs text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: exp.workSummary }} />
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Education */}
            {user.education?.length > 0 && (
              <Section title={`Education (${user.education.length})`} icon={GraduationCap}>
                <div className="space-y-4">
                  {user.education.map((edu, i) => (
                    <div key={i} className={i > 0 ? "border-t border-gray-100 pt-4" : ""}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{edu.universityName}</p>
                          <p className="text-xs text-gray-500">{edu.degree} {edu.major && `· ${edu.major}`}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                          {edu.startDate} {edu.startDate && "—"} {edu.endDate}
                        </span>
                      </div>
                      {edu.description && <p className="mt-1 text-xs text-gray-500">{edu.description}</p>}
                      {edu.grade && <p className="mt-1 text-xs text-gray-500">Grade: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Projects */}
            {user.projects?.length > 0 && (
              <Section title={`Projects (${user.projects.length})`} icon={FolderOpen}>
                <div className="space-y-4">
                  {user.projects.map((proj, i) => (
                    <div key={i} className={i > 0 ? "border-t border-gray-100 pt-4" : ""}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">{proj.projectName}</p>
                        {proj.projectUrl && (
                          <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex-shrink-0">Link</a>
                        )}
                      </div>
                      {proj.techStack && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.techStack.split(",").map((t, j) => (
                            <Badge key={j} color="blue">{t.trim()}</Badge>
                          ))}
                        </div>
                      )}
                      {proj.projectSummary && (
                        <div className="mt-2 text-xs text-gray-600"
                          dangerouslySetInnerHTML={{ __html: proj.projectSummary }} />
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Certifications */}
            {user.certifications?.length > 0 && (
              <Section title={`Certifications (${user.certifications.length})`} icon={Award}>
                <div className="space-y-3">
                  {user.certifications.map((cert, i) => (
                    <div key={i} className={`flex items-start justify-between gap-2 ${i > 0 ? "border-t border-gray-100 pt-3" : ""}`}>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer}</p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Credential</a>
                        )}
                      </div>
                      {cert.date && <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Additional Sections */}
            {user.additionalSections?.length > 0 && (
              <Section title={`Additional Sections (${user.additionalSections.length})`} icon={Layers}>
                <div className="space-y-4">
                  {user.additionalSections.map((sec, i) => (
                    <div key={i} className={i > 0 ? "border-t border-gray-100 pt-4" : ""}>
                      <p className="text-sm font-semibold text-gray-800 mb-2">{sec.title}</p>
                      <div className="text-xs text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sec.content }} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
