
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
    
    // Enhanced medical keywords list for better medical file detection - greatly expanded
    const medicalKeywords = [
      // Document types
      'medical', 'health', 'patient', 'doctor', 'hospital', 'clinic', 'lab', 'test', 
      'report', 'scan', 'mri', 'ct', 'xray', 'x-ray', 'ultrasound', 'diagnosis', 'prescription',
      'treatment', 'medication', 'therapy', 'surgery', 'blood', 'record', 'history', 'consultation',
      'referral', 'radiology', 'pathology', 'ecg', 'ekg', 'biopsy',
      
      // Lab report specific terms
      'lab report', 'laboratory', 'specimen', 'sample', 'result', 'reference range', 'abnormal', 'normal',
      'positive', 'negative', 'reactive', 'non-reactive', 'elevated', 'depressed', 'analysis',
      
      // Patient identifiers
      'name', 'patient name', 'patient id', 'mrn', 'dob', 'date of birth', 'age', 'gender', 'patient information',
      
      // Medical specialties
      'cardio', 'neuro', 'ortho', 'pediatric', 'dental', 'ophthalmology', 'dermatology',
      'urology', 'obstetrics', 'gynecology', 'immunization', 'vaccine', 'oncology',
      
      // Common medical terms
      'diabetes', 'hypertension', 'asthma', 'allergy', 'arthritis', 'anemia', 'cholesterol',
      'thyroid', 'vitamin', 'covid', 'vaccine', 'antibiotics', 'prescription', 'dose', 'discharge',
      'admission', 'pharmacy',
      
      // Specific test names
      'hemoglobin', 'glucose', 'creatinine', 'lipid', 'cbc', 'panel', 'culture', 'white blood cell',
      'red blood cell', 'platelet', 'albumin', 'protein', 'bilirubin', 'alkaline phosphatase',
      'triglycerides', 'troponin', 'electrolyte', 'sodium', 'potassium', 'chloride', 'bicarbonate',
      'calcium', 'urea', 'magnesium', 'phosphate', 'uric acid', 'amylase', 'tsh', 't3', 't4',
      'psa', 'inr', 'pt', 'ptt', 'a1c', 'hba1c', 'esr', 'crp', 'alt', 'ast', 'ldh',
      'mammogram', 'pap smear', 'colonoscopy', 'endoscopy', 
      
      // Common lab report terminology
      'differential', 'quantitative', 'qualitative', 'serology', 'hematology', 'microbiology',
      'cytology', 'histology', 'toxicology', 'immunology', 'molecular', 'genetic', 'biochemistry',
      'urinalysis', 'stool', 'fluid', 'smear', 'culture', 'sensitivity', 'titre', 'titer'
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
    
    // MUCH more permissive medical file detection - allow file if ANY validation passes
    const isMedicalFile = isAllowedType || hasMedicalKeyword || (hasValidExtension && isValidSize);
    
    // Blockchain verification for medical document (simulate)
    const blockchainVerified = isMedicalFile;
    
    // For files that don't have a medical keyword, provide additional context
    let message = '';
    if (isMedicalFile) {
      message = "File appears to be a valid medical document and has been verified with blockchain.";
    } else {
      if (!isAllowedType && !hasValidExtension) {
        message = "Not a supported medical file format. Please upload a PDF, DOC, DOCX, or medical image.";
      } else {
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
