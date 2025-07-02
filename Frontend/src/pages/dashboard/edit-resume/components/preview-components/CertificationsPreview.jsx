// Updated CertificationsPreview Component
import React from "react";
import { Calendar, Link as LinkIcon } from "lucide-react";

function CertificationsPreview({ resumeInfo }) {
  // Exit early if no certifications exist
  if (!resumeInfo?.certifications || resumeInfo.certifications.length === 0) {
    return null;
  }

  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="my-3">
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2
            className="text-center font-bold text-sm"
            style={{ color: resumeInfo?.themeColor }}
          >
            CERTIFICATIONS
          </h2>
        </div>
        <hr style={{ borderColor: resumeInfo?.themeColor }} />
      </div>

      {resumeInfo.certifications.map((certification, index) => (
        <div key={index} className="mt-1 mb-2">
          {/* First row: Name and Date */}
          <div className="flex justify-between items-center">
            <h2
              className="text-sm font-bold"
              style={{ color: resumeInfo?.themeColor }}
            >
              {certification.name}
            </h2>
            
            {certification?.date && (
              <span className="text-xs text-gray-600 flex items-center whitespace-nowrap">
                <Calendar className="h-3 w-3 mr-1 inline-block" />
                {certification.date}
              </span>
            )}
          </div>
          
          {/* Second row: Issuer and View link */}
          <div className="flex justify-between items-center mt-0.5">
            <h3 className="text-xs text-gray-600">
              {certification.issuer}
            </h3>
            
            {certification?.credentialLink && (
              <a 
                href={formatUrl(certification.credentialLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:text-primary flex items-center"
                style={{ color: resumeInfo?.themeColor }}
              >
                <LinkIcon className="h-3 w-3 mr-1" style={{ color: resumeInfo?.themeColor }} />
                View
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CertificationsPreview;