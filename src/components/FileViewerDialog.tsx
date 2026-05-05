import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileItem } from "@/types/file";
import { FileText } from "lucide-react";

interface FileViewerDialogProps {
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FileViewerDialog = ({ file, open, onOpenChange }: FileViewerDialogProps) => {
  if (!file) return null;

  const isImage = file.type === "image" || file.dataUrl?.startsWith("data:image/");
  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.dataUrl?.startsWith("data:application/pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="truncate">{file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center min-h-[300px]">
          {file.dataUrl ? (
            isImage ? (
              <img
                src={file.dataUrl}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            ) : isPdf ? (
              <iframe
                src={file.dataUrl}
                title={file.name}
                className="w-full h-[70vh] rounded border"
              />
            ) : (
              <div className="text-center space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Preview not available for this file type.</p>
                <a
                  href={file.dataUrl}
                  download={file.name}
                  className="text-healophile-blue underline"
                >
                  Download file
                </a>
              </div>
            )
          ) : (
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                No preview available. This file was uploaded before viewer support was added.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewerDialog;