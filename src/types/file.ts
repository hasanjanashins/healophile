
// File types
export interface FileItem {
  id: string;
  name: string;
  type: "document" | "image";
  date: string;
  size: string;
  patientId: string;
  patientName: string;
  thumbnail: string;
  sharedWith: string[];
  sharedWithIds: string[];
  isShared: boolean;
  blockchainHash: string;
  blockchainVerified: boolean;
  uploadedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}
