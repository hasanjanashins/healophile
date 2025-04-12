
import { FileItem } from "@/types/file";

// Function to verify blockchain integrity of a file
export const verifyBlockchainIntegrity = async (fileId: string, blockchainHash: string): Promise<boolean> => {
  // In a real implementation, this would check against the blockchain
  // For this demo, we're just simulating the verification process
  
  // Simulate blockchain verification by checking if hash exists
  return !!blockchainHash;
};

// Function to get files from localStorage or initialize with default data
export const getStoredFiles = (): FileItem[] => {
  const storedFiles = localStorage.getItem('healophileFiles');
  if (storedFiles) {
    return JSON.parse(storedFiles);
  }
  // Initialize with default sample data
  localStorage.setItem('healophileFiles', JSON.stringify(globalFileStorage));
  return globalFileStorage;
};

// Function to save files to localStorage
export const saveFilesToStorage = (files: FileItem[]): void => {
  localStorage.setItem('healophileFiles', JSON.stringify(files));
};

// Sample data - with shared state across all users in this demo app
// This will simulate a database for our demo purposes
export const globalFileStorage: FileItem[] = [
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

// Available doctors list
export const availableDoctors = [
  { id: "doc123", name: "Dr. Arjun Singh", specialty: "Cardiology" },
  { id: "d2", name: "Dr. Kavita Deshmukh", specialty: "Neurology" },
  { id: "d3", name: "Dr. Rajesh Gupta", specialty: "Orthopedics" }
];
