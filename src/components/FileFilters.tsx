
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCardGrid } from "@/components/FileCardGrid";
import { FileItem } from "@/types/file";

interface FileFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredFiles: FileItem[];
  isDoctor: boolean;
  onShare: (fileId: string) => void;
  onVerify: (fileId: string) => void;
}

const FileFilters = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  filteredFiles,
  isDoctor,
  onShare,
  onVerify
}: FileFiltersProps) => {
  return (
    <>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          {!isDoctor && <TabsTrigger value="shared">Shared</TabsTrigger>}
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <FileCardGrid 
            files={filteredFiles}
            isDoctor={isDoctor}
            onShare={onShare}
            onVerify={onVerify}
          />
        </TabsContent>
        <TabsContent value="document" className="mt-0">
          <FileCardGrid 
            files={filteredFiles.filter((file) => file.type === "document")}
            isDoctor={isDoctor}
            onShare={onShare}
            onVerify={onVerify}
          />
        </TabsContent>
        <TabsContent value="image" className="mt-0">
          <FileCardGrid 
            files={filteredFiles.filter((file) => file.type === "image")}
            isDoctor={isDoctor}
            onShare={onShare}
            onVerify={onVerify}
          />
        </TabsContent>
        {!isDoctor && (
          <TabsContent value="shared" className="mt-0">
            <FileCardGrid 
              files={filteredFiles.filter((file) => file.isShared)}
              isDoctor={isDoctor}
              onShare={onShare}
              onVerify={onVerify}
            />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};

export default FileFilters;
