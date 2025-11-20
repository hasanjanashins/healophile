
import React from "react";
import { Share, Lock, FileText, Image, Calendar, Shield, Eye, Download, ShieldCheck, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { FileItem } from "@/types/file";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface FileCardProps {
  file: FileItem;
  isDoctor: boolean;
  onShare: () => void;
  onVerify: () => void;
}

const FileCard = ({ file, isDoctor, onShare, onVerify }: FileCardProps) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const handleDownload = () => {
    toast({
      title: "File download started",
      description: `${file.name} is being downloaded to your device.`
    });
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary('');

    try {
      const fileContent = `Medical file: ${file.name}\nType: ${file.type}\nDate: ${file.uploadedAt || file.date}\nSize: ${file.size}\nPatient: ${file.patientName || 'Unknown'}`;

      const { data, error } = await supabase.functions.invoke('summarize-medical-file', {
        body: {
          fileName: file.name,
          fileType: file.type,
          fileContent
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setSummary(data.summary);
      toast({
        title: "Summary generated",
        description: "AI analysis complete"
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Summary failed",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString: string) => {
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
        
        {summary && (
          <Alert className="mt-3 bg-muted/50">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="mt-2 text-xs whitespace-pre-wrap">
              {summary}
            </AlertDescription>
          </Alert>
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
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full" 
            onClick={generateSummary}
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                AI
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                AI Summary
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={onVerify}>
            <ShieldCheck className="h-4 w-4 mr-1" />
            Verify
          </Button>
          {!isDoctor && !file.isShared && (
            <Button size="sm" className="w-full bg-healophile-purple col-span-2" onClick={onShare}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
