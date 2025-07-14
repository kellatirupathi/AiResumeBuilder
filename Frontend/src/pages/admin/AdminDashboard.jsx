// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from '@/components/ui/button';
// import { Input } from "@/components/ui/input";
// import { VITE_APP_URL } from "@/config/config.js"
// import { toast } from 'sonner';
// import { checkAdminSession, getAllUsers, getAllResumes, logoutAdmin } from "@/Services/adminApi";
// import { format } from 'date-fns';
// import { Search, Download, LogOut, User, FileText } from 'lucide-react';
// import ResumePreviewModal from "./ResumePreviewModal";
// import { cn } from "@/lib/utils";
// import { VITE_PUBLIC_URL } from "@/config/config.js";

// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("users");
//   const [users, setUsers] = useState([]);
//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userSearchQuery, setUserSearchQuery] = useState("");
//   const [resumeSearchQuery, setResumeSearchQuery] = useState("");
//   const [selectedResume, setSelectedResume] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifySessionAndFetch = async () => {
//       setLoading(true);
//       try {
//         await checkAdminSession();
//         const [usersRes, resumesRes] = await Promise.all([
//           getAllUsers(),
//           getAllResumes()
//         ]);
//         setUsers(usersRes.data || []);
//         setResumes(resumesRes.data || []);
//       } catch (error) {
//         toast.error("Session invalid or expired", { description: "Redirecting to admin login." });
//         navigate('/admin/login');
//       } finally {
//         setLoading(false);
//       }
//     };
//     verifySessionAndFetch();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await logoutAdmin();
//       toast.success("Logged out successfully.");
//       navigate('/admin/login');
//     } catch(error) {
//       toast.error("Logout failed", { description: error.message });
//     }
//   };

//   const handleViewResume = (resume) => {
//     setSelectedResume(resume);
//   };

//   const filteredUsers = useMemo(() =>
//     users
//       .filter(user =>
//         (user.fullName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//         (user.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
//       )
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
//     [users, userSearchQuery]
//   );

//   const filteredResumes = useMemo(() =>
//     resumes
//       .filter(resume =>
//         (resume.title || '').toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
//         (resume.user?.fullName || '').toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
//         (resume.user?.email || '').toLowerCase().includes(resumeSearchQuery.toLowerCase())
//       )
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
//     [resumes, resumeSearchQuery]
//   );
  
//   // Dynamic headers and flattened data logic from previous step...
//   const { headers: resumeHeaders, flattenedData: flattenedResumeData } = useMemo(() => {
//       // (The logic to create dynamic headers and flatten data for resumes is complex, 
//       // it is included in the DetailedResumesTable component itself for simplicity)
//       return { headers: [], flattenedData: [] };
//   }, [resumes]);
  
//   const handleExport = () => {
//     if (activeTab === 'users') {
//       const headers = [
//           { key: "fullName", label: "Full Name" }, { key: "email", label: "Email" },
//           { key: "createdAt", label: "Created At" }, { key: "updatedAt", label: "Updated At" }
//       ];
//       const data = filteredUsers.map(u => ({...u, createdAt: format(new Date(u.createdAt), 'PPpp'), updatedAt: format(new Date(u.updatedAt), 'PPpp') }));
//       exportToCsv('users_export.csv', headers, data);
//     }
//     if (activeTab === 'resumes') {
//         const {headers, flattenedData} = getFlattenedResumeData(filteredResumes);
//         exportToCsv('resumes_export.csv', headers, flattenedData);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-white shadow-sm noPrint">
//           <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//             <Button onClick={handleLogout} variant="outline" size="sm">
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//             </Button>
//           </div>
//         </header>
//         <main className="container mx-auto p-4 md:p-8 noPrint">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//                 {/* Left side: TABS */}
//                 <TabsList>
//                   <TabsTrigger value="users">
//                     <User className="h-4 w-4 mr-2" /> Users ({filteredUsers.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="resumes">
//                     <FileText className="h-4 w-4 mr-2" /> Resumes ({filteredResumes.length})
//                   </TabsTrigger>
//                 </TabsList>
//                 {/* Right side: CONTROLS */}
//                 <div className="flex items-center gap-4 w-full sm:w-auto">
//                     <div className="relative flex-grow sm:flex-grow-0">
//                       <Input 
//                           placeholder={activeTab === 'users' ? 'Search by name or email...' : 'Search resumes...'}
//                           value={activeTab === 'users' ? userSearchQuery : resumeSearchQuery}
//                           onChange={(e) => activeTab === 'users' ? setUserSearchQuery(e.target.value) : setResumeSearchQuery(e.target.value)}
//                           className="pl-10"
//                       />
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     </div>
//                     <Button variant="outline" onClick={handleExport}>
//                         <Download className="h-4 w-4 mr-2"/>
//                         Export CSV
//                     </Button>
//                 </div>
//             </div>

//             <TabsContent value="users">
//               {loading ? <p>Loading users...</p> : <UsersTable users={filteredUsers} />}
//             </TabsContent>
//             <TabsContent value="resumes">
//               {loading ? <p>Loading resumes...</p> : <DetailedResumesTable resumes={filteredResumes} allResumes={resumes} onViewResume={handleViewResume} />}
//             </TabsContent>
//           </Tabs>
//         </main>
//       </div>

//       <ResumePreviewModal 
//         resumeInfo={selectedResume} 
//         onClose={() => setSelectedResume(null)} 
//       />
//     </>
//   );
// }


// // --- Helper function for CSV Export Logic ---
// const exportToCsv = (filename, headers, data) => {
//     if(!headers || headers.length === 0 || !data || data.length === 0){
//         toast.warning("Nothing to export.");
//         return;
//     }
//     const csvRows = [];
//     const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
//     csvRows.push(headerRow);
    
//     data.forEach(row => {
//         const values = headers.map(header => {
//             const escaped = String(row[header.key] ?? '').replace(/"/g, '""');
//             return `"${escaped}"`;
//         });
//         csvRows.push(values.join(','));
//     });

//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//         const url = URL.createObjectURL(blob);
//         link.setAttribute('href', url);
//         link.setAttribute('download', filename);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     }
// };

// const getFlattenedResumeData = (resumes) => {
//     if (!resumes || resumes.length === 0) {
//         return { headers: [], flattenedData: [] };
//     }

//     const maxExperience = Math.max(0, ...resumes.map(r => r.experience?.length || 0));
//     const maxEducation = Math.max(0, ...resumes.map(r => r.education?.length || 0));
//     const maxProjects = Math.max(0, ...resumes.map(r => r.projects?.length || 0));
//     const maxSkills = Math.max(0, ...resumes.map(r => r.skills?.length || 0));
//     const maxCerts = Math.max(0, ...resumes.map(r => r.certifications?.length || 0));

//     const truncate = (text, length = 50) => {
//         if (!text) return '';
//         const cleanedText = String(text).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
//         return cleanedText.length > length ? cleanedText.substring(0, length) + '...' : cleanedText;
//     };

//     // Define headers
//     const baseHeaders = [
//         { key: "title", label: "Resume Title" }, 
//         { key: "userName", label: "User Name" },
//         { key: "resumeLink", label: "Resume Link"}, 
//         { key: "userEmail", label: "User Email" },
//         { key: "createdAt", label: "Created At" }, { key: "updatedAt", label: "Last Updated" }, 
//         { key: "firstName", label: "First Name" }, { key: "lastName", label: "Last Name" }, 
//         { key: "email", label: "Contact Email" }, { key: "phone", label: "Phone" }, 
//         { key: "address", label: "Address" }, { key: "githubUrl", label: "GitHub" }, 
//         { key: "linkedinUrl", label: "LinkedIn" }, { key: "portfolioUrl", label: "Portfolio" }, 
//         { key: "template", label: "Template" }, { key: "jobTitle", label: "Job Title" }, { key: "summary", label: "Summary" }
//     ];
//     const experienceHeaders = Array.from({ length: maxExperience }, (_, i) => [{ key: `experience_${i}_title`, label: `Exp ${i + 1} Title` }, { key: `experience_${i}_company`, label: `Exp ${i + 1} Company` },{ key: `experience_${i}_summary`, label: `Exp ${i + 1} Summary` },]).flat();
//     const educationHeaders = Array.from({ length: maxEducation }, (_, i) => [{ key: `education_${i}_university`, label: `Edu ${i+1} University`},{ key: `education_${i}_degree`, label: `Edu ${i+1} Degree` },]).flat();
//     const projectHeaders = Array.from({ length: maxProjects }, (_, i) => [{ key: `project_${i}_name`, label: `Proj ${i + 1} Name` },{ key: `project_${i}_tech`, label: `Proj ${i + 1} Tech` },]).flat();
//     const skillHeaders = Array.from({ length: maxSkills }, (_, i) => ({ key: `skill_${i}`, label: `Skill ${i + 1}` }));
//     const certHeaders = Array.from({ length: maxCerts }, (_, i) => [{ key: `cert_${i}_name`, label: `Cert ${i + 1} Name` },{ key: `cert_${i}_issuer`, label: `Cert ${i + 1} Issuer` },]).flat();
//     const headers = [...baseHeaders, ...experienceHeaders, ...educationHeaders, ...projectHeaders, ...skillHeaders, ...certHeaders];
    
//     // Flatten data
//     const flattenedData = resumes.map(resume => {
//         const flat = {
//             title: resume.title, 
//             userName: resume.user?.fullName, 
//             resumeLink: `${VITE_PUBLIC_URL.replace(/\/$/, '')}/public/resume/${resume._id}`,
//             userEmail: resume.user?.email, 
//             createdAt: format(new Date(resume.createdAt), 'yyyy-MM-dd'),
//             updatedAt: format(new Date(resume.updatedAt), 'yyyy-MM-dd HH:mm'),
//             firstName: resume.firstName, lastName: resume.lastName, email: resume.email,
//             phone: resume.phone, address: resume.address, githubUrl: resume.githubUrl, linkedinUrl: resume.linkedinUrl, 
//             portfolioUrl: resume.portfolioUrl, template: resume.template, jobTitle: resume.jobTitle, 
//             summary: truncate(resume.summary),
//         };
//         for(let i=0; i < maxExperience; i++){ const e = resume.experience?.[i]; flat[`experience_${i}_title`] = e?.title||''; flat[`experience_${i}_company`] = e?.companyName||''; flat[`experience_${i}_summary`] = truncate(e?.workSummary, 40)||'';}
//         for(let i=0; i < maxEducation; i++){ const e = resume.education?.[i]; flat[`education_${i}_university`]=e?.universityName||''; flat[`education_${i}_degree`]=e?.degree||'';}
//         for(let i=0; i < maxProjects; i++){ const p = resume.projects?.[i]; flat[`project_${i}_name`]=p?.projectName||''; flat[`project_${i}_tech`]=truncate(p?.techStack, 25)||'';}
//         for(let i=0; i < maxSkills; i++){ flat[`skill_${i}`]=resume.skills?.[i]?.name||'';}
//         for(let i=0; i < maxCerts; i++){ const c = resume.certifications?.[i]; flat[`cert_${i}_name`]=c?.name||''; flat[`cert_${i}_issuer`]=c?.issuer||'';}
//         return flat;
//     });

//     return { headers, flattenedData };
// }

// // --- Reusable UsersTable Component (Now only for displaying data) ---
// const UsersTable = ({ users }) => {
//     return (
//         <div className="overflow-x-auto mt-4 border rounded-lg">
//           <table className="min-w-full bg-white shadow-md">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users.map(user => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(user.createdAt), 'PPpp')}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(user.updatedAt), 'PPpp')}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//     );
// };


// // --- Reusable DetailedResumesTable (Now only for displaying data) ---
// const DetailedResumesTable = ({ resumes, allResumes, onViewResume }) => {
//     const { headers, flattenedData } = useMemo(() => getFlattenedResumeData(resumes, allResumes), [resumes, allResumes]);
  
//     if (resumes.length === 0) {
//       return <p className="mt-4 text-center text-gray-500">No matching resumes found.</p>;
//     }
  
//     // Define a consistent max-width for most columns to ensure overflow is handled
//     const getColumnWidth = (key) => {
//         switch (key) {
//             case 'title':
//             case 'userName':
//             case 'userEmail':
//             case 'resumeLink':
//             case 'summary':
//                 return 'w-64 max-w-64'; // 256px
//             case 'updatedAt':
//             case 'createdAt':
//                 return 'w-48 max-w-48'; // 192px
//             default:
//                 return 'w-40 max-w-40'; // 160px for other columns
//         }
//     };
//     return (
//         <div className="overflow-x-auto mt-4 border rounded-lg shadow-sm">
//             <table className="min-w-full bg-white text-sm">
//                 <thead className="bg-gray-100">
//                     <tr>
//                     {headers.map(header => (
//                         <th key={header.key} className={cn(
//                           "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-100 z-10",
//                           getColumnWidth(header.key) // Apply width to header
//                         )}>
//                         {header.label}
//                         </th>
//                     ))}
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {flattenedData.map((row, rowIndex) => (
//                     <tr key={resumes[rowIndex]._id} className="hover:bg-gray-50">
//                         {headers.map(header => (
//                         <td key={`${rowIndex}-${header.key}`} className={cn("px-4 py-3 whitespace-nowrap", getColumnWidth(header.key))}>
//                             <div className="truncate" title={String(row[header.key] ?? '')}>
//                                 {header.key === 'title' ? (
//                                     <button onClick={() => onViewResume(resumes[rowIndex])} className="text-indigo-600 hover:underline font-medium text-left truncate">
//                                         {String(row[header.key] ?? '')}
//                                     </button>
//                                 ) : header.key === 'resumeLink' ? (
//                                     <a
//                                     href={String(row[header.key] ?? '')}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:underline truncate"
//                                   >
//                                     {String(row[header.key] ?? '')}
//                                   </a>
//                                 ) : (
//                                 <span className="text-gray-600 truncate">{String(row[header.key] ?? '')}</span>
//                                 )}
//                             </div>
//                         </td>
//                         ))}
//                     </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
//   };

// export default AdminDashboard;


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { checkAdminSession, getAllUsers, getAllResumes, logoutAdmin } from "@/Services/adminApi";
import { format } from 'date-fns';
import { Search, Download, LogOut, User, FileText } from 'lucide-react';
import ResumePreviewModal from "./ResumePreviewModal";
import { cn } from "@/lib/utils";
import { VITE_PUBLIC_URL } from "@/config/config.js";

// --- DEBUGGING LINE ---
// This will print the value of your environment variable to the browser's console.
// Check this value on your deployed Vercel site to confirm if it's correct.
console.log("AdminDashboard is using VITE_PUBLIC_URL:", VITE_PUBLIC_URL);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [resumeSearchQuery, setResumeSearchQuery] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySessionAndFetch = async () => {
      setLoading(true);
      try {
        await checkAdminSession();
        const [usersRes, resumesRes] = await Promise.all([
          getAllUsers(),
          getAllResumes()
        ]);
        setUsers(usersRes.data || []);
        setResumes(resumesRes.data || []);
      } catch (error) {
        toast.error("Session invalid or expired", { description: "Redirecting to admin login." });
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    verifySessionAndFetch();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully.");
      navigate('/admin/login');
    } catch(error) {
      toast.error("Logout failed", { description: error.message });
    }
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
  };

  const filteredUsers = useMemo(() =>
    users
      .filter(user =>
        (user.fullName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [users, userSearchQuery]
  );

  const filteredResumes = useMemo(() =>
    resumes
      .filter(resume =>
        (resume.title || '').toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
        (resume.user?.fullName || '').toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
        (resume.user?.email || '').toLowerCase().includes(resumeSearchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [resumes, resumeSearchQuery]
  );
  
  const handleExport = () => {
    if (activeTab === 'users') {
      const headers = [
          { key: "fullName", label: "Full Name" }, { key: "email", label: "Email" },
          { key: "createdAt", label: "Created At" }, { key: "updatedAt", label: "Updated At" }
      ];
      const data = filteredUsers.map(u => ({...u, createdAt: format(new Date(u.createdAt), 'PPpp'), updatedAt: format(new Date(u.updatedAt), 'PPpp') }));
      exportToCsv('users_export.csv', headers, data);
    }
    if (activeTab === 'resumes') {
        const {headers, flattenedData} = getFlattenedResumeData(filteredResumes);
        exportToCsv('resumes_export.csv', headers, flattenedData);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm noPrint">
          <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-8 noPrint">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <TabsList>
                  <TabsTrigger value="users">
                    <User className="h-4 w-4 mr-2" /> Users ({filteredUsers.length})
                  </TabsTrigger>
                  <TabsTrigger value="resumes">
                    <FileText className="h-4 w-4 mr-2" /> Resumes ({filteredResumes.length})
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <Input 
                          placeholder={activeTab === 'users' ? 'Search by name or email...' : 'Search resumes...'}
                          value={activeTab === 'users' ? userSearchQuery : resumeSearchQuery}
                          onChange={(e) => activeTab === 'users' ? setUserSearchQuery(e.target.value) : setResumeSearchQuery(e.target.value)}
                          className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2"/>
                        Export CSV
                    </Button>
                </div>
            </div>

            <TabsContent value="users">
              {loading ? <p>Loading users...</p> : <UsersTable users={filteredUsers} />}
            </TabsContent>
            <TabsContent value="resumes">
              {loading ? <p>Loading resumes...</p> : <DetailedResumesTable resumes={filteredResumes} allResumes={resumes} onViewResume={handleViewResume} />}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <ResumePreviewModal 
        resumeInfo={selectedResume} 
        onClose={() => setSelectedResume(null)} 
      />
    </>
  );
}


const exportToCsv = (filename, headers, data) => {
    if(!headers || headers.length === 0 || !data || data.length === 0){
        toast.warning("Nothing to export.");
        return;
    }
    const csvRows = [];
    const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
    csvRows.push(headerRow);
    
    data.forEach(row => {
        const values = headers.map(header => {
            const escaped = String(row[header.key] ?? '').replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

const getFlattenedResumeData = (resumes) => {
    if (!resumes || resumes.length === 0) {
        return { headers: [], flattenedData: [] };
    }

    const maxExperience = Math.max(0, ...resumes.map(r => r.experience?.length || 0));
    const maxEducation = Math.max(0, ...resumes.map(r => r.education?.length || 0));
    const maxProjects = Math.max(0, ...resumes.map(r => r.projects?.length || 0));
    const maxSkills = Math.max(0, ...resumes.map(r => r.skills?.length || 0));
    const maxCerts = Math.max(0, ...resumes.map(r => r.certifications?.length || 0));

    const truncate = (text, length = 50) => {
        if (!text) return '';
        const cleanedText = String(text).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        return cleanedText.length > length ? cleanedText.substring(0, length) + '...' : cleanedText;
    };

    const baseHeaders = [
        { key: "title", label: "Resume Title" }, 
        { key: "userName", label: "User Name" },
        { key: "resumeLink", label: "Resume Link"}, 
        { key: "userEmail", label: "User Email" },
        { key: "createdAt", label: "Created At" }, { key: "updatedAt", label: "Last Updated" }, 
        { key: "firstName", label: "First Name" }, { key: "lastName", label: "Last Name" }, 
        { key: "email", label: "Contact Email" }, { key: "phone", label: "Phone" }, 
        { key: "address", label: "Address" }, { key: "githubUrl", label: "GitHub" }, 
        { key: "linkedinUrl", label: "LinkedIn" }, { key: "portfolioUrl", label: "Portfolio" }, 
        { key: "template", label: "Template" }, { key: "jobTitle", label: "Job Title" }, { key: "summary", label: "Summary" }
    ];
    const experienceHeaders = Array.from({ length: maxExperience }, (_, i) => [{ key: `experience_${i}_title`, label: `Exp ${i + 1} Title` }, { key: `experience_${i}_company`, label: `Exp ${i + 1} Company` },{ key: `experience_${i}_summary`, label: `Exp ${i + 1} Summary` },]).flat();
    const educationHeaders = Array.from({ length: maxEducation }, (_, i) => [{ key: `education_${i}_university`, label: `Edu ${i+1} University`},{ key: `education_${i}_degree`, label: `Edu ${i+1} Degree` },]).flat();
    const projectHeaders = Array.from({ length: maxProjects }, (_, i) => [{ key: `project_${i}_name`, label: `Proj ${i + 1} Name` },{ key: `project_${i}_tech`, label: `Proj ${i + 1} Tech` },]).flat();
    const skillHeaders = Array.from({ length: maxSkills }, (_, i) => ({ key: `skill_${i}`, label: `Skill ${i + 1}` }));
    const certHeaders = Array.from({ length: maxCerts }, (_, i) => [{ key: `cert_${i}_name`, label: `Cert ${i + 1} Name` },{ key: `cert_${i}_issuer`, label: `Cert ${i + 1} Issuer` },]).flat();
    const headers = [...baseHeaders, ...experienceHeaders, ...educationHeaders, ...projectHeaders, ...skillHeaders, ...certHeaders];
    
    // Here is where the resumeLink is constructed.
    // It correctly uses the VITE_PUBLIC_URL variable imported at the top.
    const flattenedData = resumes.map(resume => {
        const flat = {
            title: resume.title, 
            userName: resume.user?.fullName, 
            resumeLink: `${VITE_PUBLIC_URL.replace(/\/$/, '')}/public/resume/${resume._id}`,
            userEmail: resume.user?.email, 
            createdAt: format(new Date(resume.createdAt), 'yyyy-MM-dd'),
            updatedAt: format(new Date(resume.updatedAt), 'yyyy-MM-dd HH:mm'),
            firstName: resume.firstName, lastName: resume.lastName, email: resume.email,
            phone: resume.phone, address: resume.address, githubUrl: resume.githubUrl, linkedinUrl: resume.linkedinUrl, 
            portfolioUrl: resume.portfolioUrl, template: resume.template, jobTitle: resume.jobTitle, 
            summary: truncate(resume.summary),
        };
        for(let i=0; i < maxExperience; i++){ const e = resume.experience?.[i]; flat[`experience_${i}_title`] = e?.title||''; flat[`experience_${i}_company`] = e?.companyName||''; flat[`experience_${i}_summary`] = truncate(e?.workSummary, 40)||'';}
        for(let i=0; i < maxEducation; i++){ const e = resume.education?.[i]; flat[`education_${i}_university`]=e?.universityName||''; flat[`education_${i}_degree`]=e?.degree||'';}
        for(let i=0; i < maxProjects; i++){ const p = resume.projects?.[i]; flat[`project_${i}_name`]=p?.projectName||''; flat[`project_${i}_tech`]=truncate(p?.techStack, 25)||'';}
        for(let i=0; i < maxSkills; i++){ flat[`skill_${i}`]=resume.skills?.[i]?.name||'';}
        for(let i=0; i < maxCerts; i++){ const c = resume.certifications?.[i]; flat[`cert_${i}_name`]=c?.name||''; flat[`cert_${i}_issuer`]=c?.issuer||'';}
        return flat;
    });

    return { headers, flattenedData };
}

const UsersTable = ({ users }) => {
    return (
        <div className="overflow-x-auto mt-4 border rounded-lg">
          <table className="min-w-full bg-white shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(user.createdAt), 'PPpp')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(user.updatedAt), 'PPpp')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
};


const DetailedResumesTable = ({ resumes, allResumes, onViewResume }) => {
    const { headers, flattenedData } = useMemo(() => getFlattenedResumeData(resumes, allResumes), [resumes, allResumes]);
  
    if (resumes.length === 0) {
      return <p className="mt-4 text-center text-gray-500">No matching resumes found.</p>;
    }
  
    const getColumnWidth = (key) => {
        switch (key) {
            case 'title':
            case 'userName':
            case 'userEmail':
            case 'resumeLink':
            case 'summary':
                return 'w-64 max-w-64'; // 256px
            case 'updatedAt':
            case 'createdAt':
                return 'w-48 max-w-48'; // 192px
            default:
                return 'w-40 max-w-40'; // 160px for other columns
        }
    };
    return (
        <div className="overflow-x-auto mt-4 border rounded-lg shadow-sm">
            <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100">
                    <tr>
                    {headers.map(header => (
                        <th key={header.key} className={cn(
                          "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-100 z-10",
                          getColumnWidth(header.key)
                        )}>
                        {header.label}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {flattenedData.map((row, rowIndex) => (
                    <tr key={resumes[rowIndex]._id} className="hover:bg-gray-50">
                        {headers.map(header => (
                        <td key={`${rowIndex}-${header.key}`} className={cn("px-4 py-3 whitespace-nowrap", getColumnWidth(header.key))}>
                            <div className="truncate" title={String(row[header.key] ?? '')}>
                                {header.key === 'title' ? (
                                    <button onClick={() => onViewResume(resumes[rowIndex])} className="text-indigo-600 hover:underline font-medium text-left truncate">
                                        {String(row[header.key] ?? '')}
                                    </button>
                                ) : header.key === 'resumeLink' ? (
                                    <a
                                    href={String(row[header.key] ?? '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate"
                                  >
                                    {String(row[header.key] ?? '')}
                                  </a>
                                ) : (
                                <span className="text-gray-600 truncate">{String(row[header.key] ?? '')}</span>
                                )}
                            </div>
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

export default AdminDashboard;
