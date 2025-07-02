import { generatePDF } from '../services/pdf.service.js';
import Resume from '../models/resume.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Generate and download PDF for a specific resume
export const generateResumePDF = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json(new ApiError(400, "Resume ID is required"));
    }
    
    // Find the resume by ID
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found"));
    }
    
    // Check if the resume belongs to the current user
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(
        new ApiError(403, "You are not authorized to access this resume")
      );
    }
    
    // Generate PDF using the service
    const pdfBuffer = await generatePDF(resume.toObject());
    
    // Set up response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'resume'}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to generate PDF", [error.message], error.stack)
    );
  }
};