
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, CheckCircle, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const specialties = [
  { id: "cardiology", name: "Cardiology" },
  { id: "dermatology", name: "Dermatology" },
  { id: "neurology", name: "Neurology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "psychiatry", name: "Psychiatry" },
  { id: "gynecology", name: "Gynecology" },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM", "5:00 PM"
];

// Mock doctors data
const doctors = [
  { id: "1", name: "Dr. Emma Wilson", specialty: "cardiology", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=EW" },
  { id: "2", name: "Dr. Michael Chen", specialty: "dermatology", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=MC" },
  { id: "3", name: "Dr. Sarah Johnson", specialty: "neurology", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=SJ" },
  { id: "4", name: "Dr. James Brown", specialty: "orthopedics", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=JB" },
  { id: "5", name: "Dr. Lisa Martinez", specialty: "pediatrics", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=LM" },
  { id: "6", name: "Dr. Robert Taylor", specialty: "psychiatry", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=RT" },
  { id: "7", name: "Dr. Jennifer Davis", specialty: "gynecology", image: "https://placehold.co/100x100/d3e4fd/0EA5E9?text=JD" },
];

const Appointments = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    specialty: "",
    doctorId: "",
    timeSlot: "",
    reason: "",
    notes: ""
  });
  const [success, setSuccess] = useState(false);

  const filteredDoctors = doctors.filter(
    doctor => !formData.specialty || doctor.specialty === formData.specialty
  );

  const selectedDoctor = doctors.find(doctor => doctor.id === formData.doctorId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!date || !formData.doctorId || !formData.timeSlot) {
      toast({
        title: "Incomplete information",
        description: "Please select a date, doctor and time slot",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor?.name} on ${format(date, 'PPPP')} at ${formData.timeSlot} has been confirmed.`,
    });
    
    setSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      setStep(1);
      setDate(undefined);
      setFormData({
        specialty: "",
        doctorId: "",
        timeSlot: "",
        reason: "",
        notes: ""
      });
    }, 3000);
  };

  const nextStep = () => {
    if (step === 1 && !formData.specialty) {
      toast({
        title: "Select a specialty",
        description: "Please select a medical specialty first",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !formData.doctorId) {
      toast({
        title: "Select a doctor",
        description: "Please select a doctor for your appointment",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 3 && (!date || !formData.timeSlot)) {
      toast({
        title: "Schedule required",
        description: "Please select both a date and time for your appointment",
        variant: "destructive"
      });
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6 text-center">Book an Appointment</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Schedule a consultation with our qualified healthcare professionals quickly and easily.
        </p>
        
        {success ? (
          <Card className="max-w-lg mx-auto animate-fade-in border-green-500">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-medium">Appointment Confirmed!</h2>
                <p className="text-center text-muted-foreground">
                  Your appointment has been scheduled successfully. You'll receive a confirmation email shortly.
                </p>
                <div className="bg-muted p-4 rounded-lg w-full max-w-sm">
                  <div className="flex items-start space-x-3 mb-2">
                    <User className="h-5 w-5 text-healophile-blue mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedDoctor?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {specialties.find(s => s.id === formData.specialty)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mb-2">
                    <CalendarIcon className="h-5 w-5 text-healophile-blue mt-0.5" />
                    <div>
                      <p className="font-medium">{date && format(date, 'PPPP')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-healophile-blue mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.timeSlot}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setSuccess(false)}
                  className="bg-healophile-blue hover:bg-healophile-blue-dark"
                >
                  Return to Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                {step === 1 ? "Select a Specialty" : 
                 step === 2 ? "Choose a Doctor" :
                 step === 3 ? "Pick a Date & Time" : "Appointment Details"}
              </CardTitle>
              <CardDescription className="text-center">
                Step {step} of 4
                <div className="flex justify-center mt-2 space-x-1">
                  {[1, 2, 3, 4].map((stepNumber) => (
                    <div 
                      key={stepNumber}
                      className={`h-2 rounded-full w-12 ${
                        stepNumber === step 
                          ? "bg-healophile-purple" 
                          : stepNumber < step 
                            ? "bg-healophile-blue" 
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <Label className="text-lg">Select a Medical Specialty</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {specialties.map((specialty) => (
                      <div
                        key={specialty.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.specialty === specialty.id
                            ? "border-healophile-blue bg-healophile-blue/10"
                            : "hover:border-healophile-blue-light hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectChange("specialty", specialty.id)}
                      >
                        <p className="font-medium text-center">{specialty.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <Label className="text-lg">Choose a Doctor</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors ${
                          formData.doctorId === doctor.id
                            ? "border-healophile-blue bg-healophile-blue/10"
                            : "hover:border-healophile-blue-light hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectChange("doctorId", doctor.id)}
                      >
                        <img 
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-16 w-16 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {specialties.find(s => s.id === doctor.specialty)?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <Label className="text-lg mb-4 block">Select a Date</Label>
                    <div className="border rounded-lg">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          // Disable dates in the past and weekends
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const day = date.getDay();
                          return date < now || day === 0 || day === 6;
                        }}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg mb-4 block">Choose a Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className={`border rounded-lg p-3 text-center cursor-pointer ${
                            formData.timeSlot === time
                              ? "border-healophile-blue bg-healophile-blue/10"
                              : "hover:border-healophile-blue-light"
                          }`}
                          onClick={() => handleSelectChange("timeSlot", time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Input
                      id="reason"
                      name="reason"
                      placeholder="Brief description of your concern"
                      value={formData.reason}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional information the doctor should know"
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <p className="font-medium">Appointment Summary</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Specialist</p>
                        <p>{specialties.find(s => s.id === formData.specialty)?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p>{selectedDoctor?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p>{date ? format(date, 'PPPP') : 'Not selected'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p>{formData.timeSlot}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {step < 4 ? (
                    <Button 
                      type="button" 
                      className="bg-healophile-blue hover:bg-healophile-blue-dark" 
                      onClick={nextStep}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      className="bg-healophile-purple hover:bg-healophile-purple-dark" 
                      onClick={handleSubmit}
                    >
                      Book Appointment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Appointments;
