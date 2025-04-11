
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, FileText, Image, Download, Eye, Calendar, Share, Lock, Shield, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    isShared: true,
    blockchainHash: "8f7d88e4c3a0aaf6e25a8c137426310bd01f72f54376c37cbce41452a98d5950",
    blockchainVerified: true,
    uploadedAt: "2025-03-15T10:30:00.000Z"
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
    isShared: true,
    blockchainHash: "a1c2e3g4i5k6m7o8q9s0u1w2y3a4c5e6g7i8k9m0o1q2s3u4w5y6",
    blockchainVerified: true,
    uploadedAt: "2025-02-28T15:45:00.000Z"
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
    isShared: false,
    blockchainHash: "b2d3f4h5j6l7n8p9r0t1v2x3z4b5d6f7h8j9l0n1p2r3t4v5x6z7",
    blockchainVerified: true,
    uploadedAt: "2025-03-10T09:15:00.000Z"
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
    isShared: true,
    blockchainHash: "c3e4g5i6k7m8o9q0s1u2w3y4a5c6e7g8i9k0m1o2q3s4u5w6y7",
    blockchainVerified: true,
    uploadedAt: "2025-01-20T11:20:00.000Z"
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
    isShared: false,
    blockchainHash: "d4f5h6j7l8n9p0r1t2v3x4z5b6d7f8h9j0l1n2p3r4t5v6x7z8",
    blockchainVerified: true,
    uploadedAt: "2024-12-05T14:50:00.000Z"
  },
];

// Function to verify blockchain integrity of a file
const verifyBlockchainIntegrity = async (fileId, blockchainHash) => {
  // In a real implementation, this would check against the blockchain
  // For this demo, we're just simulating the verification process
  
  // Simulate blockchain verification by checking if hash exists
  return !!blockchainHash;
};

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
  
  // Verify blockchain integrity for all files on first load
  useEffect(() => {
    const verifyAllFiles = async () => {
      const updatedFiles = await Promise.all(files.map(async (file) => {
        const isVerified = await verifyBlockchainIntegrity(file.id, file.blockchainHash);
        return { ...file, blockchainVerified: isVerified };
      }));
      
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
    };
    
    verifyAllFiles();
  }, []);

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

  const handleVerifyBlockchain = async (fileId) => {
    // Find the file
    const fileToVerify = files.find(f => f.id === fileId);
    if (!fileToVerify) return;
    
    toast({
      title: "Verifying document integrity",
      description: "Checking blockchain record..."
    });
    
    // Simulate verification process
    setTimeout(() => {
      // In a real implementation, this would be an actual blockchain verification
      const isVerified = !!fileToVerify.blockchainHash;
      
      const updatedFiles = files.map(file => {
        if (file.id === fileId) {
          return { ...file, blockchainVerified: isVerified };
        }
        return file;
      });
      
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
      
      toast({
        title: isVerified ? "Document verified" : "Verification failed",
        description: isVerified 
          ? "This document's integrity is confirmed by blockchain" 
          : "This document has been tampered with or is missing blockchain verification",
        variant: isVerified ? "default" : "destructive"
      });
    }, 1500);
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
                  onVerify={() => handleVerifyBlockchain(file.id)}
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
                    onVerify={() => handleVerifyBlockchain(file.id)}
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
                    onVerify={() => handleVerifyBlockchain(file.id)}
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
                      onVerify={() => handleVerifyBlockchain(file.id)}
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

// FileCard component with blockchain verification
const FileCard = ({ file, isDoctor, onShare, onVerify }) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "File download started",
      description: `${file.name} is being downloaded to your device.`
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
          <span>{formatDate(file.uploadedAt || file.date)}</span>
          <span className="mx-1">•</span>
          <span>{file.size}</span>
        </div>
        
        <TooltipProvider>
          <div className="mt-2 flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={file.blockchainVerified ? "outline" : "destructive"} className="text-xs cursor-help">
                  {file.blockchainVerified ? (
                    <span className="flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1 text-green-600" /> 
                      Blockchain verified
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" /> 
                      Not verified
                    </span>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {file.blockchainVerified 
                  ? `This document is secured with blockchain technology (${file.blockchainHash.substring(0, 8)}...)`
                  : "This document's blockchain verification has failed or is missing"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        
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
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button size="sm" variant="outline" className="w-full" onClick={handleDownload}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={onVerify}>
            <ShieldCheck className="h-4 w-4 mr-1" />
            Verify
          </Button>
          {!isDoctor && !file.isShared && (
            <Button size="sm" className="w-full bg-healophile-purple" onClick={onShare}>
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
