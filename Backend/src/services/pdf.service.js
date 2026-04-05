import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register handlebars helpers
handlebars.registerHelper('isEqual', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('formatDate', function(date) {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;
    
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    
    return `${month} ${year}`;
  } catch (e) {
    return date;
  }
});

handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

handlebars.registerHelper('or', function(a, b) {
  return a || b;
});

// Add the formatUrl helper
handlebars.registerHelper('formatUrl', function(url) {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
});

// Add the replaceSeparator helper
handlebars.registerHelper('replaceSeparator', function(str, oldSep, newSep) {
  if (!str) return '';
  return str.split(oldSep).join(newSep);
});

handlebars.registerHelper('bulletList', function(text) {
  if (!text) return '';

  const normalized = String(text)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/li>|<\/h[1-6]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '')
    .replace(/<\/ul>|<\/ol>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .split(/\r?\n|\u2022/)
    .map((item) => item.replace(/^[-*\u2022]\s*/, '').trim())
    .filter(Boolean);

  if (!normalized.length) return '';

  return new handlebars.SafeString(
    `<ul class="bullet-list">${normalized.map((item) => `<li>${handlebars.escapeExpression(item)}</li>`).join('')}</ul>`
  );
});

// Helper to get first character of a string
handlebars.registerHelper('firstChar', function(str) {
  if (!str) return '';
  return str.charAt(0);
});

// Helper to check if index is even
handlebars.registerHelper('if_even', function(index, options) {
  if ((index % 2) === 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// Helper to check if index is odd
handlebars.registerHelper('if_odd', function(index, options) {
  if ((index % 2) === 1) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

const PDFSPARK_API_URL = process.env.PDFSPARK_API_URL || 'https://pdfspark.dev/api/v1/pdf/from-html';
const PDFSPARK_TIMEOUT_MS = Number(process.env.PDFSPARK_TIMEOUT_MS || 30000);

export const renderResumeHtml = (resumeData) => {
  // Ensure we have template data
  const template = resumeData.template || 'modern';
  const themeColor = resumeData.themeColor || '#059669';

  // Convert the hex color to RGB for use in rgba() values
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  };

  const themeColorRGB = hexToRgb(themeColor);
  const themeColorTransparent80 = `${themeColor}99`;
  const themeColorTransparent50 = `${themeColor}55`;
  const themeColorTransparent30 = `${themeColor}30`;
  const themeColorTransparent20 = `${themeColor}33`;
  const themeColorTransparent10 = `${themeColor}22`;
  const themeColorTransparent05 = `${themeColor}10`;

  const templatePath = path.join(__dirname, '..', 'templates', `${template}.handlebars`);

  let templateContent;
  try {
    templateContent = fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.warn(`Template ${template} not found, using modern template instead`);
    templateContent = fs.readFileSync(
      path.join(__dirname, '..', 'templates', 'modern.handlebars'),
      'utf8'
    );
  }

  const compiledTemplate = handlebars.compile(templateContent);
  const normalizedResumeData = JSON.parse(JSON.stringify(resumeData));

  if (template !== 'creative' && normalizedResumeData.projects && Array.isArray(normalizedResumeData.projects)) {
    normalizedResumeData.projects.forEach((project) => {
      if (project.techStack) {
        project.techStack = project.techStack
          .split(',')
          .map((item) => item.trim())
          .join(' | ');
      }
    });
  }

  const html = compiledTemplate({
    ...normalizedResumeData,
    themeColor,
    themeColorRGB,
    themeColorTransparent80,
    themeColorTransparent50,
    themeColorTransparent30,
    themeColorTransparent20,
    themeColorTransparent10,
    themeColorTransparent05
  });

  return html.replace('</style>', `
      /* Page break styles */
      @media print {
        @page {
          margin-top: 50px;
          margin-bottom: 50px;
        }
        @page:first {
          margin-top: 0;
          margin-bottom: 50px;
        }

        .page-break-inside-avoid {
          page-break-inside: avoid;
        }
        .page-break-before {
          page-break-before: always;
        }
        .section-title {
          break-after: avoid;
        }
        .section-content-item, .item-title, .item-subtitle {
          page-break-inside: avoid;
        }
      }
    </style>`);
};

// Main PDF generation function
export const generatePDF = async (resumeData) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PDFSPARK_TIMEOUT_MS);

  try {
    const html = renderResumeHtml(resumeData);
    const response = await fetch(PDFSPARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`PDFSpark request failed with status ${response.status}${errorBody ? `: ${errorBody}` : ''}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error generating PDF with PDFSpark:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    clearTimeout(timeout);
  }
};
