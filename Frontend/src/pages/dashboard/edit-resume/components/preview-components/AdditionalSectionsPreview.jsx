import React from 'react';

function AdditionalSectionsPreview({ resumeInfo }) {
  const { additionalSections, themeColor } = resumeInfo;

  if (!additionalSections || additionalSections.length === 0) {
    return null;
  }

  return (
    <>
      {additionalSections.map((section, index) => (
        <div className="my-3" key={index}>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{ color: themeColor }}
          >
            {section.title.toUpperCase()}
          </h2>
          <hr style={{ borderColor: themeColor }} />
          <div
            className="text-xs mt-2 rsw-ce" // 'rsw-ce' applies basic WYSIWYG styles
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </>
  );
}

export default AdditionalSectionsPreview;
