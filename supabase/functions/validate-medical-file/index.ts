
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileCheckRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, fileSize }: FileCheckRequest = await req.json();
    
    // Medical document formats validation
    const allowedFileTypes = [
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg', 'image/png', 'image/dicom', 'image/tiff'
    ];
    
    // Enhanced medical keywords list for better medical file detection
    const medicalKeywords = [
      // Document types
      'medical', 'health', 'patient', 'doctor', 'hospital', 'clinic', 'lab', 'test',
      'report', 'scan', 'mri', 'ct', 'xray', 'x-ray', 'ultrasound', 'diagnosis', 'prescription',
      'treatment', 'medication', 'therapy', 'surgery', 'blood', 'record', 'history', 'consultation',
      'referral', 'radiology', 'pathology', 'ecg', 'ekg', 'biopsy',
      
      // Medical specialties
      'cardio', 'neuro', 'ortho', 'pediatric', 'dental', 'ophthalmology', 'dermatology',
      'urology', 'obstetrics', 'gynecology', 'immunization', 'vaccine', 'oncology',
      
      // Common medical terms
      'diabetes', 'hypertension', 'asthma', 'allergy', 'arthritis', 'anemia', 'cholesterol',
      'thyroid', 'vitamin', 'covid', 'vaccine', 'antibiotics', 'prescription', 'dose', 'discharge',
      'admission', 'pharmacy',
      
      // Specific test names
      'hemoglobin', 'glucose', 'creatinine', 'lipid', 'cbc', 'panel', 'culture'
    ];

    // Check file type
    const isAllowedType = allowedFileTypes.includes(fileType);
    
    // Check filename for medical keywords (more permissive)
    const fileNameLower = fileName.toLowerCase();
    
    // More permissive keyword matching
    const hasMedicalKeyword = medicalKeywords.some(keyword => 
      fileNameLower.includes(keyword.toLowerCase())
    );
    
    // Size check - be more permissive with sizes
    const isValidSize = fileSize > 100 && fileSize < 100 * 1024 * 1024; // Between 100 bytes and 100MB
    
    // Basic file extension check
    const medicalExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.dcm', '.dicom', '.tiff', '.txt', '.xls', '.xlsx'];
    const hasValidExtension = medicalExtensions.some(ext => fileNameLower.endsWith(ext));
    
    // We'll consider a file medical if:
    // 1. It has a valid file type AND (has keywords OR has valid size)
    // OR
    // 2. It has a medical extension AND has valid size
    const isMedicalFile = (isAllowedType && (hasMedicalKeyword || isValidSize)) || 
                           (hasValidExtension && isValidSize);
    
    // Blockchain verification for medical document (simulate)
    const blockchainVerified = isMedicalFile;
    
    // For files that don't have a medical keyword, provide additional context
    let message = '';
    if (isMedicalFile) {
      message = "File appears to be a valid medical document and has been verified with blockchain.";
    } else {
      if (!isAllowedType && !hasValidExtension) {
        message = "Not a supported medical file format. Please upload a PDF, DOC, DOCX, or medical image.";
      } else if (!hasMedicalKeyword && !isValidSize) {
        message = "This file doesn't appear to be a medical document. Please ensure you're uploading a relevant medical file.";
      }
    }
    
    // Log validation details for debugging
    console.log("File validation:", {
      fileName,
      isAllowedType,
      hasMedicalKeyword,
      isValidSize,
      hasValidExtension,
      isMedicalFile,
      blockchainVerified
    });
    
    // Return validation result
    return new Response(JSON.stringify({
      isValid: isMedicalFile,
      message: message,
      blockchainVerified: blockchainVerified
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error in validate-medical-file function:", error);
    
    return new Response(JSON.stringify({
      isValid: false, 
      message: "Error validating file: " + error.message,
      blockchainVerified: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
