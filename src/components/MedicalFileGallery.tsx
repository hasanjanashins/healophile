
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, FileText, Image, Download, Eye, Calendar, Share, Lock, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data - with shared state across all users in this demo app
// This will simulate a database for our demo purposes
const globalFileStorage = [
  {
    id: "1",
    name: "Blood Test Results.pdf",
    type: "document",
    date: "2025-03-15",
    size: "1.2 MB",
    patientId: "pat456", // Priya Sharma (test patient)
    patientName: "Priya Sharma",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
    sharedWith: ["Dr. Arjun Singh"],
    sharedWithIds: ["doc123"], // Dr. Arjun Singh (test doctor)
    isShared: true
  },
  {
    id: "2",
    name: "X-Ray Left Arm.jpg",
    type: "image",
    date: "2025-02-28",
    size: "3.5 MB",
    patientId: "pat456", // Priya Sharma
    patientName: "Priya Sharma",
    thumbnail: "https://placehold.co/400x400/d3e4fd/0EA5E9?text=X-Ray",
    sharedWith: ["Dr. Arjun Singh"],
    sharedWithIds: ["doc123"], // Dr. Arjun Singh
    isShared: true
  },
  {
    id: "3",
    name: "Doctor Prescription.pdf",
    type: "document",
    date: "2025-03-10",
    size: "0.8 MB",
    patientId: "pat456", // Priya Sharma
    patientName: "Priya Sharma",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
    sharedWith: [],
    sharedWithIds: [],
    isShared: false
  },
  {
    id: "4",
    name: "MRI Scan Results.jpg",
    type: "image",
    date: "2025-01-20",
    size: "5.2 MB",
    patientId: "pat456", // Priya Sharma
    patientName: "Priya Sharma",
    thumbnail: "https://placehold.co/400x400/d3e4fd/0EA5E9?text=MRI",
    sharedWith: ["Dr. Arjun Singh"],
    sharedWithIds: ["doc123"], // Dr. Arjun Singh
    isShared: true
  },
  {
    id: "5",
    name: "Medical History.pdf",
    type: "document",
    date: "2024-12-05",
    size: "2.1 MB",
    patientId: "pat456", // Priya Sharma
    patientName: "Priya Sharma",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
    sharedWith: [],
    sharedWithIds: [],
    isShared: false
  },
];

// Function to get files from localStorage or initialize with default data
const getStoredFiles = () => {
  const storedFiles = localStorage.getItem('healophileFiles');
  if (storedFiles) {
    return JSON.parse(storedFiles);
  }
  // Initialize with default sample data
  localStorage.setItem('healophileFiles', JSON.stringify(globalFileStorage));
  return globalFileStorage;
};

// Function to save files to localStorage
const saveFilesToStorage = (files) => {
  localStorage.setItem('healophileFiles', JSON.stringify(files));
};

// Available doctors list
const availableDoctors = [
  { id: "doc123", name: "Dr. Arjun Singh", specialty: "Cardiology" },
  { id: "d2", name: "Dr. Kavita Deshmukh", specialty: "Neurology" },
  { id: "d3", name: "Dr. Rajesh Gupta", specialty: "Orthopedics" }
];

const MedicalFileGallery = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareDoctor, setShareDoctor] = useState(null);
  const [files, setFiles] = useState(getStoredFiles());
  
  const isDoctor = currentUser?.role === "doctor";
  
  // Filter files based on user role and ID
  const userFiles = files.filter(file => {
    // If doctor, only show files shared with them
    if (isDoctor && currentUser?.id) {
      return file.sharedWithIds.includes(currentUser.id);
    }
    // If patient, show all their files
    return file.patientId === currentUser?.id;
  });
  
  const filteredFiles = userFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "shared" && file.isShared) ||
                      (activeTab === "private" && !file.isShared) ||
                      file.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleShareFile = (fileId) => {
    if (!shareDoctor) return;
    
    // Find the doctor to share with
    const doctorToShare = availableDoctors.find(d => d.id === shareDoctor);
    if (!doctorToShare) return;
    
    // Update the file share status in our files array
    const updatedFiles = files.map(file => {
      if (file.id === fileId) {
        // Check if already shared with this doctor
        if (file.sharedWithIds.includes(shareDoctor)) {
          return file; // Already shared
        }
        
        return {
          ...file,
          sharedWith: [...file.sharedWith, doctorToShare.name],
          sharedWithIds: [...file.sharedWithIds, doctorToShare.id],
          isShared: true
        };
      }
      return file;
    });
    
    // Update state and storage
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);
    
    toast({
      title: "File shared successfully",
      description: `File has been shared with ${doctorToShare.name}`,
    });
    
    setShareDoctor(null);
    setSelectedFile(null);
  };

  return (
    <Card className="w-full border-healophile-blue-light">
      <CardHeader>
        <CardTitle className="font-display text-center">
          {isDoctor ? "Patient Medical Files" : "Your Medical Files"}
        </CardTitle>
        <CardDescription className="text-center">
          {isDoctor 
            ? "Access and manage your patients' medical documents" 
            : "Securely view and manage all your medical documents"}
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            {!isDoctor && <TabsTrigger value="shared">Shared</TabsTrigger>}
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  isDoctor={isDoctor}
                  onShare={() => setSelectedFile(file.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="document" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles
                .filter((file) => file.type === "document")
                .map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    isDoctor={isDoctor}
                    onShare={() => setSelectedFile(file.id)}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="image" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles
                .filter((file) => file.type === "image")
                .map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    isDoctor={isDoctor}
                    onShare={() => setSelectedFile(file.id)}
                  />
                ))}
            </div>
          </TabsContent>
          {!isDoctor && (
            <TabsContent value="shared" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles
                  .filter((file) => file.isShared)
                  .map((file) => (
                    <FileCard 
                      key={file.id} 
                      file={file} 
                      isDoctor={isDoctor}
                      onShare={() => setSelectedFile(file.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : isDoctor 
                  ? "No files have been shared with you yet"
                  : "Upload some files to get started"}
            </p>
          </div>
        )}

        {selectedFile && !isDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Share Medical File</CardTitle>
                <CardDescription>
                  Select a doctor to share this medical file with
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select value={shareDoctor || ''} onValueChange={setShareDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-healophile-blue" onClick={() => handleShareFile(selectedFile)}>
                    Share File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// FileCard component remains mostly the same, but with updated types
const FileCard = ({ file, isDoctor, onShare }) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "File download started",
      description: `${file.name} is being downloaded to your device.`
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-36 bg-gray-100">
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {file.isShared && (
            <div className="bg-white rounded-full p-1 box-content">
              <Share className="h-4 w-4 text-healophile-blue" />
            </div>
          )}
          {!file.isShared && (
            <div className="bg-white rounded-full p-1 box-content">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {file.type === "document" ? (
            <div className="bg-white rounded-full p-1 box-content">
              <FileText className="h-4 w-4 text-healophile-purple" />
            </div>
          ) : (
            <div className="bg-white rounded-full p-1 box-content">
              <Image className="h-4 w-4 text-healophile-blue" />
            </div>
          )}
        </div>
        {isDoctor && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-white text-xs">
              From: {file.patientName}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {new Date(file.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="mx-1">•</span>
          <span>{file.size}</span>
        </div>
        
        {file.sharedWith.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" /> 
                Shared with {file.sharedWith.length} {file.sharedWith.length === 1 ? 'doctor' : 'doctors'}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="flex mt-3 space-x-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={handleDownload}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          {!isDoctor && !file.isShared && (
            <Button size="sm" className="flex-1 bg-healophile-purple" onClick={onShare}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalFileGallery;
