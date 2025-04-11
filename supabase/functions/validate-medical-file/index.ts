
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
    
    // AI based validation logic
    // For now, we'll use a rule-based approach, but this can be replaced with an actual AI model
    
    // Medical document formats validation
    const allowedFileTypes = [
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg', 'image/png', 'image/dicom', 'image/tiff'
    ];
    
    // Medical keywords to check in filename (case insensitive)
    const medicalKeywords = [
      'medical', 'health', 'patient', 'doctor', 'hospital', 'clinic', 'lab', 'test',
      'report', 'scan', 'mri', 'ct', 'xray', 'x-ray', 'ultrasound', 'diagnosis', 'prescription',
      'treatment', 'medication', 'therapy', 'surgery', 'blood', 'record', 'history', 'consultation',
      'referral', 'radiology', 'pathology', 'cardio', 'neuro', 'ortho', 'pediatric', 'dental',
      'ophthalmology', 'dermatology', 'urology', 'obstetrics', 'gynecology', 'immunization', 'vaccine'
    ];

    // Check file type
    const isAllowedType = allowedFileTypes.includes(fileType);
    
    // Check filename for medical keywords
    const fileNameLower = fileName.toLowerCase();
    const hasMedicalKeyword = medicalKeywords.some(keyword => 
      fileNameLower.includes(keyword.toLowerCase())
    );
    
    // Size check - most medical documents would be at least a few KB
    // For security, also check that the file is not too large (e.g., < 50MB)
    const isValidSize = fileSize > 100 && fileSize < 50 * 1024 * 1024; // Between 100 bytes and 50MB
    
    // Combined validation
    // For a basic system, we'll accept files that have both valid type AND either a medical keyword or appropriate size
    const isMedicalFile = isAllowedType && (hasMedicalKeyword || isValidSize);
    
    // For files that don't have a medical keyword, provide additional context
    let message = '';
    if (isMedicalFile) {
      message = "File appears to be a valid medical document.";
    } else {
      if (!isAllowedType) {
        message = "Not a supported medical file format. Please upload a PDF, DOC, DOCX, or medical image.";
      } else if (!hasMedicalKeyword && !isValidSize) {
        message = "This file doesn't appear to be a medical document. Please ensure you're uploading a relevant medical file.";
      }
    }
    
    // Return validation result
    return new Response(JSON.stringify({
      isValid: isMedicalFile,
      message: message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error in validate-medical-file function:", error);
    
    return new Response(JSON.stringify({
      isValid: false, 
      message: "Error validating file: " + error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
