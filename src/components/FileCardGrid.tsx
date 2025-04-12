
import React from "react";
import { FileText } from "lucide-react";
import FileCard from "@/components/FileCard";
import { FileItem } from "@/types/file";

interface FileCardGridProps {
  files: FileItem[];
  isDoctor: boolean;
  onShare: (fileId: string) => void;
  onVerify: (fileId: string) => void;
}

export const FileCardGrid = ({ files, isDoctor, onShare, onVerify }: FileCardGridProps) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No files found</h3>
        <p className="text-muted-foreground">
          {isDoctor 
            ? "No files have been shared with you yet"
            : "Upload some files to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          isDoctor={isDoctor}
          onShare={() => onShare(file.id)}
          onVerify={() => onVerify(file.id)}
        />
      ))}
    </div>
  );
};
