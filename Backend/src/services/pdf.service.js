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


import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core'; // Switched to puppeteer-core
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Handlebars Helpers (Unchanged) ---
// Your existing helpers are fine and should be kept as they are.

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

handlebars.registerHelper('formatUrl', function(url) {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
});

handlebars.registerHelper('replaceSeparator', function(str, oldSep, newSep) {
  if (!str) return '';
  return str.split(oldSep).join(newSep);
});

handlebars.registerHelper('firstChar', function(str) {
  if (!str) return '';
  return str.charAt(0);
});

handlebars.registerHelper('if_even', function(index, options) {
  if ((index % 2) === 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

handlebars.registerHelper('if_odd', function(index, options) {
  if ((index % 2) === 1) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


// --- Updated PDF Generation Function ---
export const generatePDF = async (resumeData) => {
  let browser = null;

  try {
    const template = resumeData.template || 'modern';
    const themeColor = resumeData.themeColor || '#059669';
    
    const hexToRgb = (hex) => {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    };
    
    const themeColorRGB = hexToRgb(themeColor);
    
    const templatePath = path.join(__dirname, '..', 'templates', `${template}.handlebars`);
    
    let templateContent;
    try {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.warn(`Template ${template} not found, using modern template instead.`);
      templateContent = fs.readFileSync(
        path.join(__dirname, '..', 'templates', 'modern.handlebars'), 
        'utf8'
      );
    }
    
    const compiledTemplate = handlebars.compile(templateContent);
    
    if (resumeData.projects && Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach(project => {
        if (project.techStack) {
          project.techStack = project.techStack.split(',').map(item => item.trim()).join(' | ');
        }
      });
    }
    
    const html = compiledTemplate({
      ...resumeData,
      themeColor,
      themeColorRGB,
    });

    // --- **KEY CHANGE** ---
    // Use @sparticuz/chromium to get the executable path and recommended arguments
    const executablePath = await chromium.executablePath();
    
    browser = await puppeteer.launch({
      executablePath,
      headless: chromium.headless, // Use recommended headless mode
      args: chromium.args,
    });

    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });
    
    return pdf;

  } catch (error) {
    console.error('Error generating PDF:', error);
    // Rethrow a clearer error to be handled by the controller
    throw new Error('Failed to generate PDF. Puppeteer may have encountered an issue.');
  } finally {
    // Ensure the browser is always closed, even if an error occurs
    if (browser) {
      await browser.close();
    }
  }
};
