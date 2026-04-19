import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getPublicCoverLetter,
  trackPublicCoverLetterView,
} from "@/Services/coverLetterAPI";
import { resolveApiData } from "@/lib/queryCacheUtils";
import PreviewCoverLetter from "@/pages/dashboard/cover-letter/components/PreviewCoverLetter";
import PaginatedA4Preview from "@/pages/dashboard/edit-resume/components/PaginatedA4Preview";
import { API_BASE_URL } from "@/config/config";

function PublicCoverLetterPage() {
  const { slugOrId } = useParams();
  const [coverLetter, setCoverLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getPublicCoverLetter(slugOrId);
        if (cancelled) return;
        const data = resolveApiData(response);
        setCoverLetter(data);
        trackPublicCoverLetterView(slugOrId).catch(() => {});
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load cover letter");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  const handleDownload = () => {
    // Use the direct-PDF endpoint that generates on-the-fly (no Drive required)
    const url = `${API_BASE_URL}pdf/cover-letter/public-direct/${slugOrId}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !coverLetter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Cover Letter Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This cover letter is no longer available."}
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{coverLetter.title || "Cover Letter"}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-800 truncate">
              {coverLetter.title || "Cover Letter"}
            </h1>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-indigo-600 text-white hover:bg-indigo-700 gap-1.5"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </header>

        <main className="py-6">
          <div className="max-w-5xl mx-auto px-4">
            <PaginatedA4Preview>
              <PreviewCoverLetter coverLetterInfo={coverLetter} />
            </PaginatedA4Preview>
          </div>
        </main>
      </div>
    </>
  );
}

export default PublicCoverLetterPage;
