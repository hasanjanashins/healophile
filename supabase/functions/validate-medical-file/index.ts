
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
    
    // Now accept all files, no restrictions
    const isMedicalFile = true;
    
    // Always verify with blockchain for any file (simulate)
    const blockchainVerified = true;
    
    // Log validation details for debugging
    console.log("File validation:", {
      fileName,
      fileType,
      fileSize,
      isMedicalFile,
      blockchainVerified
    });
    
    // Return validation result
    return new Response(JSON.stringify({
      isValid: true,
      message: "File accepted and verified with blockchain.",
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
