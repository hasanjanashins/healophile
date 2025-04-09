
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, FileText, Image, Download, Eye, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data - would come from backend in real app
const sampleFiles = [
  {
    id: "1",
    name: "Blood Test Results.pdf",
    type: "document",
    date: "2025-03-15",
    size: "1.2 MB",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
  },
  {
    id: "2",
    name: "X-Ray Left Arm.jpg",
    type: "image",
    date: "2025-02-28",
    size: "3.5 MB",
    thumbnail: "https://placehold.co/400x400/d3e4fd/0EA5E9?text=X-Ray",
  },
  {
    id: "3",
    name: "Doctor Prescription.pdf",
    type: "document",
    date: "2025-03-10",
    size: "0.8 MB",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
  },
  {
    id: "4",
    name: "MRI Scan Results.jpg",
    type: "image",
    date: "2025-01-20",
    size: "5.2 MB",
    thumbnail: "https://placehold.co/400x400/d3e4fd/0EA5E9?text=MRI",
  },
  {
    id: "5",
    name: "Medical History.pdf",
    type: "document",
    date: "2024-12-05",
    size: "2.1 MB",
    thumbnail: "https://placehold.co/400x500/e5deff/7E69AB?text=PDF",
  },
];

const MedicalFileGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredFiles = sampleFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || file.type === activeTab;
    return matchesSearch && matchesTab;
  });
  
  return (
    <Card className="w-full border-healophile-blue-light">
      <CardHeader>
        <CardTitle className="font-display text-center">Your Medical Files</CardTitle>
        <CardDescription className="text-center">
          Securely view and manage all your medical documents
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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="document" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles
                .filter((file) => file.type === "document")
                .map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="image" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles
                .filter((file) => file.type === "image")
                .map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Upload some files to get started"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    thumbnail: string;
  };
}

const FileCard = ({ file }: FileCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden card-hover">
      <div className="relative h-36 bg-gray-100">
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {file.type === "document" ? (
            <FileText className="h-5 w-5 text-healophile-purple bg-white rounded-full p-1 box-content" />
          ) : (
            <Image className="h-5 w-5 text-healophile-blue bg-white rounded-full p-1 box-content" />
          )}
        </div>
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
        <div className="flex mt-3 space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalFileGallery;
