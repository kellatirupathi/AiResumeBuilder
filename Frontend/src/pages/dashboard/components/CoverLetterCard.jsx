import React, { useEffect, useRef, useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  ChevronRight,
  Share2,
  Copy,
  Download,
  Mail,
  Building2,
  Briefcase,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  deleteCoverLetter,
  cloneCoverLetter,
  downloadCoverLetterPDF,
} from "@/Services/coverLetterAPI";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import CloneResumeModal from "./CloneResumeModal";
import PreviewCoverLetter from "../cover-letter/components/PreviewCoverLetter";

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

const PREVIEW_BASE_WIDTH = 820;
const PREVIEW_BASE_HEIGHT = 1160;

const CoverLetterExactPreview = ({ coverLetter }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const updateSize = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scaleX = size.width ? size.width / PREVIEW_BASE_WIDTH : 1;
  const scaleY = size.height ? size.height / PREVIEW_BASE_HEIGHT : 1;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white pointer-events-none">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${PREVIEW_BASE_WIDTH}px`,
          height: `${PREVIEW_BASE_HEIGHT}px`,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      >
        <PreviewCoverLetter coverLetterInfo={coverLetter} />
      </div>
      <div className="absolute inset-0 bg-white/6 dark:bg-gray-900/8" />
    </div>
  );
};

function CoverLetterCard({ coverLetter, refreshData, viewMode = "grid" }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCloneModalOpen, setCloneModalOpen] = useState(false);

  const navigate = useNavigate();

  const id = coverLetter?._id;
  const gradientIndex = id
    ? Math.abs(id.charCodeAt(0) + id.charCodeAt(id.length - 1)) %
      gradients.length
    : 0;
  const gradient = gradients[gradientIndex];

  const openCoverLetter = () => {
    navigate(`/dashboard/cover-letter/${id}`);
  };

  const handleShare = () => {
    if (coverLetter?.googleDriveLink) {
      navigator.clipboard
        .writeText(coverLetter.googleDriveLink)
        .then(() => {
          toast.success("Cover letter link copied to clipboard!", {
            description:
              "Anyone with the link can view your cover letter on Google Drive.",
          });
        })
        .catch(() => {
          toast.error("Failed to copy link", {
            description: "Please try again manually.",
          });
        });
    } else {
      toast.info("Drive link not available", {
        description:
          "Open the cover letter and click 'Generate Drive Link', or use Download PDF to save the file directly.",
        duration: 6000,
      });
    }
  };

  const handleClone = async (newTitle) => {
    setCloneLoading(true);
    try {
      await cloneCoverLetter(id, newTitle);
      toast.success("Cover Letter Cloned", {
        description: `A copy "${newTitle}" has been created.`,
      });
      refreshData?.();
    } catch (error) {
      toast.error("Failed to clone cover letter", {
        description: error.message,
      });
    } finally {
      setCloneLoading(false);
      setCloneModalOpen(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCoverLetter(id);
      toast("Cover letter deleted successfully", {
        description: "Your cover letter has been permanently removed",
      });
    } catch (error) {
      toast("Failed to delete cover letter", {
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setOpenAlert(false);
      refreshData?.();
    }
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      await downloadCoverLetterPDF(id);
      toast.success("Cover letter downloaded");
    } catch (error) {
      toast.error("Failed to download cover letter", {
        description: error.message,
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const subtitleParts = [];
  if (coverLetter?.jobTitle) subtitleParts.push(coverLetter.jobTitle);
  if (coverLetter?.companyName) subtitleParts.push(coverLetter.companyName);
  const subtitle = subtitleParts.join(" \u00B7 ");

  if (viewMode === "list") {
    return (
      <>
        <div className="group flex items-center justify-between rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center flex-1">
            <div
              className={`w-1.5 self-stretch bg-gradient-to-b ${gradient}`}
            ></div>
            <div className="p-3 pl-4">
              <Link to={`/dashboard/cover-letter/${id}`}>
                <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                  {coverLetter?.title || "Untitled Cover Letter"}
                </h3>
              </Link>
              {subtitle && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1 text-gray-500 dark:text-gray-400 text-xs">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Last updated: {formatDate(coverLetter?.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center" title="Total Views">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{coverLetter?.viewCount || 0} views</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-3">
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={openCoverLetter}
                className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                title="Edit Cover Letter"
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                title="Share Cover Letter Link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCloneModalOpen(true)}
                className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                title="Clone Cover Letter"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={downloadLoading}
                className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenAlert(true)}
                className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                title="Delete Cover Letter"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="sm:hidden relative">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-7 w-7 p-0 flex items-center justify-center"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        openCoverLetter();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Eye className="mr-2 h-4 w-4 text-blue-500" /> View
                    </button>
                    <button
                      onClick={() => {
                        openCoverLetter();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        handleShare();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Share2 className="mr-2 h-4 w-4 text-emerald-500" /> Share
                      Link
                    </button>
                    <button
                      onClick={() => {
                        setCloneModalOpen(true);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Copy className="mr-2 h-4 w-4 text-green-500" /> Clone
                    </button>
                    <button
                      onClick={() => {
                        handleDownload();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Download className="mr-2 h-4 w-4 text-amber-500" />{" "}
                      Download PDF
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        setOpenAlert(true);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openCoverLetter}
              className={`hidden md:flex items-center gap-1 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity rounded-md px-3 py-1 text-xs shadow-sm`}
            >
              {" "}
              Continue <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-rose-600 dark:text-rose-400">
                Delete this cover letter?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                cover letter and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteLoading ? "Deleting..." : "Delete Cover Letter"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CloneResumeModal
          isOpen={isCloneModalOpen}
          onClose={() => setCloneModalOpen(false)}
          onClone={handleClone}
          originalTitle={coverLetter?.title || "Cover Letter"}
          loading={cloneLoading}
        />
      </>
    );
  }

  // Grid View
  return (
    <>
      <div className="group relative flex flex-col h-[348px] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${gradient}`}
        ></div>

        <div className="absolute top-2 right-2 z-10 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-7 w-7 p-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreVertical className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
          </Button>
          {showMobileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                <button
                  onClick={() => {
                    openCoverLetter();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-500" /> View
                </button>
                <button
                  onClick={() => {
                    openCoverLetter();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Share2 className="mr-2 h-4 w-4 text-emerald-500" /> Share
                  Link
                </button>
                <button
                  onClick={() => {
                    setCloneModalOpen(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Copy className="mr-2 h-4 w-4 text-green-500" /> Clone
                </button>
                <button
                  onClick={() => {
                    handleDownload();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Download className="mr-2 h-4 w-4 text-amber-500" /> Download
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    setOpenAlert(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <Link
          to={`/dashboard/cover-letter/${id}`}
          className="relative flex-grow overflow-hidden bg-white block"
        >
          <CoverLetterExactPreview coverLetter={coverLetter} />

          {/* Hover overlay with title + meta */}
          <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/85 via-black/55 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm font-bold text-white line-clamp-1">
              {coverLetter?.title || "Untitled Cover Letter"}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/85">
              {coverLetter?.companyName && (
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  {coverLetter.companyName}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Title + meta strip below preview */}
        <div className="relative z-[1] border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 px-3 py-2">
          <h3
            className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1"
            title={coverLetter?.title}
          >
            {coverLetter?.title || "Untitled Cover Letter"}
          </h3>
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            {coverLetter?.jobTitle && (
              <span className="flex items-center gap-1 truncate">
                <Briefcase className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{coverLetter.jobTitle}</span>
              </span>
            )}
            <span className="flex items-center gap-1 flex-shrink-0">
              <Calendar className="h-3 w-3" />
              {formatDate(coverLetter?.updatedAt)}
            </span>
          </div>
        </div>

        <div className="relative z-[1] border-t border-white/80 dark:border-white/10 bg-white/88 dark:bg-gray-900/80 backdrop-blur-sm p-3 pt-2 pb-2 flex justify-between items-center mt-auto">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={openCoverLetter}
              className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              title="Edit Cover Letter"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              title="Share Cover Letter Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCloneModalOpen(true)}
              className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              title="Clone Cover Letter"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={downloadLoading}
              className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenAlert(true)}
              className="rounded-full w-7 h-7 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              title="Delete Cover Letter"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={openCoverLetter}
            className={`flex items-center gap-1 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity rounded-md px-2.5 py-1 text-xs shadow-sm`}
          >
            {" "}
            Continue <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CloneResumeModal
        isOpen={isCloneModalOpen}
        onClose={() => setCloneModalOpen(false)}
        onClone={handleClone}
        originalTitle={coverLetter?.title || "Cover Letter"}
        loading={cloneLoading}
      />
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 dark:text-rose-400">
              Delete this cover letter?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              cover letter and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleteLoading ? "Deleting..." : "Delete Cover Letter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CoverLetterCard;
