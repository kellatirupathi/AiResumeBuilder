// import puppeteer from 'puppeteer';
// import chromium from '@sparticuz/chromium';
// import handlebars from 'handlebars';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// // Get current directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Register handlebars helpers (no changes needed here)
// handlebars.registerHelper('isEqual', function(arg1, arg2, options) {
//   return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
// });

// handlebars.registerHelper('formatDate', function(date) {
//   if (!date) return '';
  
//   try {
//     const dateObj = new Date(date);
//     if (isNaN(dateObj.getTime())) return date;
    
//     const month = dateObj.toLocaleString('default', { month: 'short' });
//     const year = dateObj.getFullYear();
    
//     return `${month} ${year}`;
//   } catch (e) {
//     return date;
//   }
// });

// handlebars.registerHelper('json', function(context) {
//   return JSON.stringify(context);
// });

// handlebars.registerHelper('or', function(a, b) {
//   return a || b;
// });

// handlebars.registerHelper('formatUrl', function(url) {
//   if (!url) return '';
//   if (!/^https?:\/\//i.test(url)) {
//     return 'https://' + url;
//   }
//   return url;
// });

// handlebars.registerHelper('replaceSeparator', function(str, oldSep, newSep) {
//   if (!str) return '';
//   return str.split(oldSep).join(newSep);
// });

// handlebars.registerHelper('firstChar', function(str) {
//   if (!str) return '';
//   return str.charAt(0);
// });

// handlebars.registerHelper('if_even', function(index, options) {
//   if ((index % 2) === 0) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

// handlebars.registerHelper('if_odd', function(index, options) {
//   if ((index % 2) === 1) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

// // Main PDF generation function
// export const generatePDF = async (resumeData) => {
//   try {
//     // Ensure we have template data
//     const template = resumeData.template || 'modern';
//     const themeColor = resumeData.themeColor || '#059669';
    
//     // Convert the hex color to RGB for use in rgba() values
//     const hexToRgb = (hex) => {
//       hex = hex.replace('#', '');
//       const r = parseInt(hex.substring(0, 2), 16);
//       const g = parseInt(hex.substring(2, 4), 16);
//       const b = parseInt(hex.substring(4, 6), 16);
//       return `${r}, ${g}, ${b}`;
//     };
    
//     const themeColorRGB = hexToRgb(themeColor);
    
//     const templatePath = path.join(__dirname, '..', 'templates', `${template}.handlebars`);
    
//     let templateContent;
//     try {
//       templateContent = fs.readFileSync(templatePath, 'utf8');
//     } catch (error) {
//       console.warn(`Template ${template} not found, using modern template instead`);
//       templateContent = fs.readFileSync(
//         path.join(__dirname, '..', 'templates', 'modern.handlebars'), 
//         'utf8'
//       );
//     }
    
//     const compiledTemplate = handlebars.compile(templateContent);
    
//     const html = compiledTemplate({
//       ...resumeData,
//       themeColor,
//       themeColorRGB,
//     });

//     // **FIX FOR SERVER DEPLOYMENT**
//     const browser = await puppeteer.launch({
//         args: [
//           ...chromium.args,
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-dev-shm-usage',
//           '--single-process'
//         ],
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath(),
//         headless: chromium.headless,
//         ignoreHTTPSErrors: true,
//     });
    
//     const page = await browser.newPage();
    
//     await page.setContent(html, { waitUntil: 'networkidle0' });
    
//     const pdf = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       displayHeaderFooter: false,
//       margin: { top: 0, right: 0, bottom: 0, left: 0 }
//     });
    
//     await browser.close();
    
//     return pdf;
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw new Error('Failed to generate PDF');
//   }
// };



import puppeteer from 'puppeteer';
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

// Main PDF generation function
export const generatePDF = async (resumeData) => {
  try {
    // Ensure we have template data
    const template = resumeData.template || 'modern';
    const themeColor = resumeData.themeColor || '#059669';
    
    // Convert the hex color to RGB for use in rgba() values
    const hexToRgb = (hex) => {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex value
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    };
    
    // Add the RGB version of the theme color and create transparent versions
    const themeColorRGB = hexToRgb(themeColor);
    const themeColorTransparent80 = `${themeColor}99`;
    const themeColorTransparent50 = `${themeColor}55`;
    const themeColorTransparent20 = `${themeColor}33`;
    const themeColorTransparent10 = `${themeColor}22`;
    const themeColorTransparent05 = `${themeColor}10`;
    
    // Load the appropriate template based on the template name
    const templatePath = path.join(__dirname, '..', 'templates', `${template}.handlebars`);
    
    // Use default template if the requested one doesn't exist
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
    
    // Compile the template with handlebars
    const compiledTemplate = handlebars.compile(templateContent);
    
    // Process tech stack for better display if needed
    if (resumeData.projects && Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach(project => {
        if (project.techStack) {
          // Replace commas with pipe separators in techStack
          project.techStack = project.techStack.split(',').map(item => item.trim()).join(' | ');
        }
      });
    }
    
    // Render the HTML with the resume data and color variables
    const html = compiledTemplate({
      ...resumeData,
      themeColor,
      themeColorRGB,
      themeColorTransparent80,
      themeColorTransparent50,
      themeColorTransparent20,
      themeColorTransparent10,
      themeColorTransparent05
    });

    // Add page break styles for proper section breaks
    const htmlWithPageBreakStyles = html.replace('</style>', `
      /* Page break styles */
      @media print {
        @page {
          /* Add a top margin for all pages after the first one */
          margin-top: 50px;
        }
        @page:first {
          /* The first page has its own padding, so no top margin is needed here */
          margin-top: 0;
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

    // Launch puppeteer for PDF generation
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set the page content
    await page.setContent(htmlWithPageBreakStyles, { waitUntil: 'networkidle0' });
    
    // Generate PDF with proper page break settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });
    
    // Close the browser
    await browser.close();
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
