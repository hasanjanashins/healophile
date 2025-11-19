
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FileItem } from "@/types/file";
import { getStoredFiles, saveFilesToStorage, verifyBlockchainIntegrity, availableDoctors } from "@/utils/fileUtils";
import FileFilters from "@/components/FileFilters";
import ShareFileDialog from "@/components/ShareFileDialog";

const MedicalFileGallery = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [shareDoctor, setShareDoctor] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>(getStoredFiles());
  
  const isDoctor = userRole === "doctor";
  
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
    if (isDoctor && user?.id) {
      return file.sharedWithIds.includes(user.id);
    }
    // If patient, show all their files
    return file.patientId === user?.id;
  });
  
  const filteredFiles = userFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "shared" && file.isShared) ||
                      (activeTab === "private" && !file.isShared) ||
                      file.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleShareFile = (fileId: string) => {
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

  const handleVerifyBlockchain = async (fileId: string) => {
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
      </CardHeader>
      
      <CardContent>
        <FileFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredFiles={filteredFiles}
          isDoctor={isDoctor}
          onShare={setSelectedFile}
          onVerify={handleVerifyBlockchain}
        />
        
        <ShareFileDialog
          selectedFile={selectedFile}
          shareDoctor={shareDoctor}
          setShareDoctor={setShareDoctor}
          onCancel={() => setSelectedFile(null)}
          onShare={() => selectedFile && handleShareFile(selectedFile)}
          doctors={availableDoctors}
        />
      </CardContent>
    </Card>
  );
};

export default MedicalFileGallery;
