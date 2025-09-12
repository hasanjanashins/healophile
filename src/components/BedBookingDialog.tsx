import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/FileUpload";
import { 
  BedDouble, 
  FileText, 
  Shield, 
  Upload, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface BedBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: any;
}

type BookingStep = "details" | "book" | "paperwork" | "insurance" | "upload" | "complete";

const BedBookingDialog = ({ isOpen, onClose, hospital }: BedBookingDialogProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("details");
  const [bookingData, setBookingData] = useState({
    patientName: "",
    contactNumber: "",
    emergencyContact: "",
    medicalCondition: "",
    specialRequirements: "",
    insuranceProvider: "",
    policyNumber: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const steps: BookingStep[] = ["details", "book", "paperwork", "insurance", "upload", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ["details", "book", "paperwork", "insurance", "upload", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleClose = () => {
    setCurrentStep("details");
    setBookingData({
      patientName: "",
      contactNumber: "",
      emergencyContact: "",
      medicalCondition: "",
      specialRequirements: "",
      insuranceProvider: "",
      policyNumber: ""
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{hospital?.name}</h3>
              <p className="text-muted-foreground">{hospital?.location}</p>
              <div className="mt-2 flex justify-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">{hospital?.availableBeds}</span> beds available
                </div>
                <div className="text-sm">
                  <span className="font-medium">{hospital?.distance}</span> away
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {hospital?.facilities.map((facility: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {facility}
                </div>
              ))}
            </div>
            
            <div className="bg-healophile-blue/5 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Available Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {hospital?.specialties.map((specialty: string, index: number) => (
                  <span key={index} className="bg-healophile-blue/10 text-healophile-blue px-2 py-1 rounded text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "book":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <BedDouble className="h-12 w-12 text-healophile-blue mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Book a Bed</h3>
              <p className="text-muted-foreground">Please provide patient details to proceed</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={bookingData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  placeholder="Enter patient full name"
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={bookingData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={bookingData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>
            
            <div>
              <Label htmlFor="medicalCondition">Medical Condition *</Label>
              <Textarea
                id="medicalCondition"
                value={bookingData.medicalCondition}
                onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
                placeholder="Describe the medical condition or reason for admission"
                rows={3}
              />
            </div>
          </div>
        );

      case "paperwork":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 text-healophile-purple mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Start Paperwork</h3>
              <p className="text-muted-foreground">Complete additional information for admission</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  value={bookingData.specialRequirements}
                  onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                  placeholder="Any special medical requirements, allergies, or preferences"
                  rows={3}
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Please bring a valid ID for verification</li>
                  <li>• Hospital admission is subject to bed availability</li>
                  <li>• Insurance verification will be completed during admission</li>
                  <li>• Emergency cases will be prioritized</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "insurance":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Health Insurance Certificate</h3>
              <p className="text-muted-foreground">Provide your insurance information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                <Input
                  id="insuranceProvider"
                  value={bookingData.insuranceProvider}
                  onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                  placeholder="Enter insurance provider name"
                />
              </div>
              
              <div>
                <Label htmlFor="policyNumber">Policy Number *</Label>
                <Input
                  id="policyNumber"
                  value={bookingData.policyNumber}
                  onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                  placeholder="Enter policy number"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Next Step</h4>
                <p className="text-sm text-blue-700">
                  You'll need to upload your insurance certificate and any other required documents in the next step.
                </p>
              </div>
            </div>
          </div>
        );

      case "upload":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="h-12 w-12 text-healophile-blue mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Upload Documents</h3>
              <p className="text-muted-foreground">Upload your insurance certificate and other required documents</p>
            </div>
            
            <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Required Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload />
                  </CardContent>
                </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium mb-1">Insurance Certificate</h5>
                  <p className="text-muted-foreground">Current insurance policy document</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium mb-1">ID Proof</h5>
                  <p className="text-muted-foreground">Government issued ID card</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium mb-1">Medical Records</h5>
                  <p className="text-muted-foreground">Recent medical reports (if any)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium mb-1">Prescription</h5>
                  <p className="text-muted-foreground">Doctor's prescription or referral</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700">Booking Confirmed!</h3>
              <p className="text-muted-foreground">Your bed has been reserved successfully</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-left">
              <h4 className="font-medium text-green-800 mb-3">Booking Details</h4>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Hospital:</strong> {hospital?.name}</p>
                <p><strong>Patient:</strong> {bookingData.patientName}</p>
                <p><strong>Contact:</strong> {bookingData.contactNumber}</p>
                <p><strong>Booking ID:</strong> BK{Date.now().toString().slice(-6)}</p>
                <p><strong>Status:</strong> Confirmed - Please arrive within the next 4 hours</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Hospital has been notified of your booking</li>
                <li>• You'll receive a confirmation SMS shortly</li>
                <li>• Please bring your ID and insurance documents</li>
                <li>• Contact the hospital directly for any urgent queries</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === "details" && "Hospital Details"}
            {currentStep === "book" && "Book a Bed"}
            {currentStep === "paperwork" && "Paperwork"}
            {currentStep === "insurance" && "Insurance Information"}
            {currentStep === "upload" && "Document Upload"}
            {currentStep === "complete" && "Booking Complete"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === "details" ? handleClose : handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === "details" ? "Close" : "Back"}
          </Button>
          
          {currentStep !== "complete" && (
            <Button
              onClick={handleNext}
              className="bg-healophile-blue hover:bg-healophile-blue-dark flex items-center gap-2"
              disabled={
                (currentStep === "book" && (!bookingData.patientName || !bookingData.contactNumber || !bookingData.medicalCondition)) ||
                (currentStep === "insurance" && (!bookingData.insuranceProvider || !bookingData.policyNumber))
              }
            >
              {currentStep === "details" && "View Details & Contact"}
              {currentStep === "book" && "Continue to Paperwork"}
              {currentStep === "paperwork" && "Insurance Info"}
              {currentStep === "insurance" && "Upload Documents"}
              {currentStep === "upload" && "Complete Booking"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {currentStep === "complete" && (
            <Button
              onClick={handleClose}
              className="bg-green-500 hover:bg-green-600"
            >
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BedBookingDialog;