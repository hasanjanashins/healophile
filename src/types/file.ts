
// File types
export interface FileItem {
  id: string;
  name: string;
  type: string; // Changed from specific types to allow any file type
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
