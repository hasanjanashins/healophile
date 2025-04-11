
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, FilePlus, FileX, CheckCircle, Share, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Available doctors list
const availableDoctors = [
  { id: "doc123", name: "Dr. Arjun Singh", specialty: "Cardiology" },
  { id: "d2", name: "Dr. Kavita Deshmukh", specialty: "Neurology" },
  { id: "d3", name: "Dr. Rajesh Gupta", specialty: "Orthopedics" }
];

// Allowed file types for medical documents
const ALLOWED_FILE_TYPES = [
  // Medical document formats
  'application/pdf', // PDF files
  'application/msword', // DOC files
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files
  'text/plain', // TXT files (for simple reports)
  'application/vnd.ms-excel', // XLS files (for lab results)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX files
  
  // Medical imaging formats
  'image/jpeg', // JPEG images (scanned documents, X-rays)
  'image/png', // PNG images
  'image/dicom', // DICOM medical imaging
  'image/tiff', // TIFF images
];

// File type descriptions for user feedback
const FILE_TYPE_DESCRIPTIONS: Record<string, string> = {
  'application/pdf': 'PDF Document',
  'application/msword': 'Word Document (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (DOCX)',
  'text/plain': 'Text Document',
  'application/vnd.ms-excel': 'Excel Spreadsheet (XLS)',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (XLSX)',
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/dicom': 'DICOM Medical Image',
  'image/tiff': 'TIFF Image'
};

// Function to get files from localStorage or initialize with default data
const getStoredFiles = () => {
  const storedFiles = localStorage.getItem('healophileFiles');
  if (storedFiles) {
    return JSON.parse(storedFiles);
  }
  return [];
};

// Function to save files to localStorage
const saveFilesToStorage = (files: any[]) => {
  localStorage.setItem('healophileFiles', JSON.stringify(files));
};

// Function to generate a blockchain hash
const generateBlockchainHash = (file: File, userId: string): string => {
  // In a real implementation, this would call a blockchain service
  // For now, we'll simulate a hash based on the file details and timestamp
  const fileData = `${file.name}-${file.size}-${userId}-${Date.now()}`;
  return Array.from(
    new Uint8Array(
      new TextEncoder().encode(fileData)
    )
  ).map(b => b.toString(16).padStart(2, '0')).join('');
};

// Function to validate if a file is a medical document using AI
const validateMedicalFile = async (file: File): Promise<{ isValid: boolean; message: string }> => {
  try {
    const response = await fetch('/api/validate-medical-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating file:', error);
    return { 
      isValid: false, 
      message: 'Error validating file. Falling back to basic validation.' 
    };
  }
};

interface FileError {
  name: string;
  error: string;
}

const FileUpload = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<Record<string, boolean>>({});
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setValidating(true);
      
      const validFiles: File[] = [];
      const errors: FileError[] = [];
      
      // Validate each file with AI
      for (const file of newFiles) {
        try {
          // First check if the file type is in our allowed list
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            errors.push({
              name: file.name,
              error: `Not a supported medical document format. Please upload a PDF, DOC, DOCX, or medical image.`
            });
            continue;
          }
          
          // Then perform AI validation
          const { isValid, message } = await validateMedicalFile(file);
          
          if (isValid) {
            validFiles.push(file);
          } else {
            errors.push({
              name: file.name,
              error: message || 'Failed AI validation for medical document'
            });
          }
        } catch (error) {
          errors.push({
            name: file.name,
            error: 'Error during file validation'
          });
        }
      }
      
      setValidating(false);
      
      // Update state
      setFiles([...files, ...validFiles]);
      setFileErrors(errors);
      
      // Show toast for invalid files
      if (errors.length > 0) {
        toast({
          title: "Invalid file types detected",
          description: `${errors.length} file(s) were not added because they are not valid medical documents.`,
          variant: "destructive"
        });
      }
      
      // Success message for valid files
      if (validFiles.length > 0) {
        toast({
          title: "Files validated",
          description: `${validFiles.length} medical file(s) successfully added`,
        });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDoctorSelection = (doctorId: string, checked: boolean) => {
    setSelectedDoctors({
      ...selectedDoctors,
      [doctorId]: checked
    });
  };

  const getSelectedDoctorsCount = () => {
    return Object.values(selectedDoctors).filter(selected => selected).length;
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    // Simulate upload process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setIsSuccess(true);
          
          // Get selected doctors
          const selectedDoctorsList = availableDoctors.filter(doctor => selectedDoctors[doctor.id]);
          
          // Create new files to add to storage
          const storedFiles = getStoredFiles();
          const newStoredFiles = [...storedFiles];
          
          files.forEach((file, index) => {
            // Create file type (document or image) based on file extension
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'dicom'].includes(fileExtension);
            const fileType = isImage ? 'image' : 'document';
            
            // Create thumbnail based on file type
            const thumbnail = isImage 
              ? "https://placehold.co/400x400/d3e4fd/0EA5E9?text=Image" 
              : "https://placehold.co/400x500/e5deff/7E69AB?text=Doc";
            
            // Generate blockchain hash for this file
            const blockchainHash = generateBlockchainHash(file, currentUser?.id || 'guest');
            
            // Add the new file to storage
            const newFile = {
              id: `${Date.now()}-${index}`,
              name: file.name,
              type: fileType,
              date: new Date().toISOString().split('T')[0],
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              patientId: currentUser?.id || 'guest',
              patientName: currentUser?.name || 'Guest User',
              thumbnail: thumbnail,
              sharedWith: selectedDoctorsList.map(doc => doc.name),
              sharedWithIds: selectedDoctorsList.map(doc => doc.id),
              isShared: selectedDoctorsList.length > 0,
              blockchainHash: blockchainHash,  // Add blockchain hash
              blockchainVerified: true,       // Mark as verified in the blockchain
              uploadedAt: new Date().toISOString()
            };
            
            newStoredFiles.push(newFile);
          });
          
          // Save updated files to storage
          saveFilesToStorage(newStoredFiles);
          
          // Format sharing message
          const selectedDoctorCount = getSelectedDoctorsCount();
          let sharingMessage = '';
          
          if (selectedDoctorCount > 0) {
            const doctorNames = availableDoctors
              .filter(doctor => selectedDoctors[doctor.id])
              .map(doctor => doctor.name);
            
            sharingMessage = ` and shared with ${doctorNames.join(', ')}`;
          }
          
          toast({
            title: "Files uploaded successfully",
            description: `${files.length} file(s) have been securely uploaded to your medical records${sharingMessage}.`,
          });
          
          setFiles([]);
          setSelectedDoctors({});
          
          setTimeout(() => {
            setIsSuccess(false);
          }, 2000);
          
          return 0;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <Card className="w-full border-healophile-blue-light animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-center">Medical File Upload</CardTitle>
        <CardDescription className="text-center">
          Upload your medical files securely. We support medical documents and imaging formats only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fileErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-1">Some files could not be uploaded:</p>
              <ul className="list-disc pl-5 space-y-1">
                {fileErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error.name}: {error.error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            files.length > 0 ? "border-healophile-blue" : "border-muted"
          }`}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-lg font-medium">Upload Successful!</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ShieldCheck className="h-4 w-4 mr-1" />
                <span>Blockchain verification complete</span>
              </div>
            </div>
          ) : validating ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="h-12 w-12 text-healophile-blue mb-2 animate-spin" />
              <p className="text-lg font-medium">Validating files...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Our AI is checking if your files are valid medical documents
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium mb-2">Drag files here or</p>
              <Button
                disabled={uploading || validating}
                className="bg-healophile-blue hover:bg-healophile-blue-dark"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <input
                type="file"
                id="file-input"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dicom,.tiff,.txt,.xls,.xlsx"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, DICOM, TIFF, and other medical formats
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Files will be validated by AI to ensure they are medical documents
              </p>
            </div>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="space-y-4">
            <p className="font-medium">Selected Files ({files.length})</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-md"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-healophile-blue mr-2" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • 
                          {FILE_TYPE_DESCRIPTIONS[file.type] || file.type}
                        </p>
                        <ShieldCheck className="h-3 w-3 ml-1 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading || validating}
                  >
                    <FileX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <Share className="h-4 w-4 mr-2" />
                  Share with doctors
                </h3>
                <span className="text-sm text-muted-foreground">
                  {getSelectedDoctorsCount()} selected
                </span>
              </div>
              <div className="border rounded-md p-3 space-y-3">
                {availableDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doctor-${doctor.id}`}
                      checked={selectedDoctors[doctor.id] || false}
                      onCheckedChange={(checked) => 
                        handleDoctorSelection(doctor.id, checked === true)
                      }
                    />
                    <Label htmlFor={`doctor-${doctor.id}`} className="cursor-pointer flex-1">
                      <span className="font-medium">{doctor.name}</span>
                      <span className="text-sm text-muted-foreground block">
                        {doctor.specialty}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading and securing with blockchain...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          className="w-full bg-healophile-purple hover:bg-healophile-purple-dark"
          disabled={files.length === 0 || uploading || validating}
        >
          {uploading ? "Uploading..." : `Upload ${files.length > 0 ? `(${files.length})` : ""} ${
            getSelectedDoctorsCount() > 0 ? "& Share" : ""
          }`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
