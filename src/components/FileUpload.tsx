
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, FilePlus, FileX, CheckCircle, Share } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

// Available doctors list
const availableDoctors = [
  { id: "doc123", name: "Dr. Arjun Singh", specialty: "Cardiology" },
  { id: "d2", name: "Dr. Kavita Deshmukh", specialty: "Neurology" },
  { id: "d3", name: "Dr. Rajesh Gupta", specialty: "Orthopedics" }
];

// Function to get files from localStorage or initialize with default data
const getStoredFiles = () => {
  const storedFiles = localStorage.getItem('healophileFiles');
  if (storedFiles) {
    return JSON.parse(storedFiles);
  }
  return [];
};

// Function to save files to localStorage
const saveFilesToStorage = (files) => {
  localStorage.setItem('healophileFiles', JSON.stringify(files));
};

const FileUpload = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState({});

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDoctorSelection = (doctorId, checked) => {
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
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
            const fileType = isImage ? 'image' : 'document';
            
            // Create thumbnail based on file type
            const thumbnail = isImage 
              ? "https://placehold.co/400x400/d3e4fd/0EA5E9?text=Image" 
              : "https://placehold.co/400x500/e5deff/7E69AB?text=Doc";
            
            // Add the new file to storage
            const newFile = {
              id: `${Date.now()}-${index}`,
              name: file.name,
              type: fileType,
              date: new Date().toISOString().split('T')[0],
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              patientId: currentUser?.id,
              patientName: currentUser?.name,
              thumbnail: thumbnail,
              sharedWith: selectedDoctorsList.map(doc => doc.name),
              sharedWithIds: selectedDoctorsList.map(doc => doc.id),
              isShared: selectedDoctorsList.length > 0
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
          Upload your medical files securely. We support PDFs, images, and documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            files.length > 0 ? "border-healophile-blue" : "border-muted"
          }`}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-lg font-medium">Upload Successful!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium mb-2">Drag files here or</p>
              <Button
                disabled={uploading}
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
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
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
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
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
              <span>Uploading...</span>
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
          disabled={files.length === 0 || uploading}
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
