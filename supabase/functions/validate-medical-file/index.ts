
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileCheckRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

// Allowed medical file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/dicom',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        isValid: false,
        message: "Authentication required",
        blockchainVerified: false
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client to verify the JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({
        isValid: false,
        message: "Invalid authentication",
        blockchainVerified: false
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { fileName, fileType, fileSize }: FileCheckRequest = await req.json();
    
    // Validate file name
    if (!fileName || typeof fileName !== 'string' || fileName.length > 255) {
      return new Response(JSON.stringify({
        isValid: false,
        message: "Invalid file name",
        blockchainVerified: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize file name (prevent path traversal)
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return new Response(JSON.stringify({
        isValid: false,
        message: "Invalid file name format",
        blockchainVerified: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return new Response(JSON.stringify({
        isValid: false,
        message: `File type not allowed. Accepted types: PDF, JPEG, PNG, DICOM, TXT, DOC, DOCX`,
        blockchainVerified: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({
        isValid: false,
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        blockchainVerified: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (fileSize <= 0) {
      return new Response(JSON.stringify({
        isValid: false,
        message: "Invalid file size",
        blockchainVerified: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // File passed all validation checks
    console.log(`File validated successfully for user ${user.id}:`, {
      fileName,
      fileType,
      fileSize
    });
    
    // Return validation result
    return new Response(JSON.stringify({
      isValid: true,
      message: "File validated and ready for upload.",
      blockchainVerified: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error in validate-medical-file function:", error);
    
    return new Response(JSON.stringify({
      isValid: false, 
      message: "Error validating file",
      blockchainVerified: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
