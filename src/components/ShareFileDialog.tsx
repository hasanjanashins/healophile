
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types/file";

interface ShareFileDialogProps {
  selectedFile: string | null;
  shareDoctor: string | null;
  setShareDoctor: (doctorId: string | null) => void;
  onCancel: () => void;
  onShare: () => void;
  doctors: Doctor[];
}

const ShareFileDialog = ({
  selectedFile,
  shareDoctor,
  setShareDoctor,
  onCancel,
  onShare,
  doctors
}: ShareFileDialogProps) => {
  if (!selectedFile) return null;

  return (
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
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1 bg-healophile-blue" onClick={onShare}>
              Share File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareFileDialog;
