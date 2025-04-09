
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Calendar, FileText, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

// Mock patient data for the doctor dashboard
const patients = [
  {
    id: "p1",
    name: "Emily Johnson",
    age: 34,
    email: "emily.johnson@example.com",
    phone: "(555) 123-4567",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    lastVisit: "2025-03-15",
    nextAppointment: "2025-04-20",
    medicalRecords: [
      { id: "rec1", name: "Blood Test Results", date: "2025-03-15", type: "lab" },
      { id: "rec2", name: "Annual Physical", date: "2025-03-15", type: "report" }
    ]
  },
  {
    id: "p2",
    name: "Thomas Wilson",
    age: 45,
    email: "thomas.wilson@example.com",
    phone: "(555) 234-5678",
    conditions: ["Asthma", "Arthritis"],
    lastVisit: "2025-02-28",
    nextAppointment: "2025-04-15",
    medicalRecords: [
      { id: "rec3", name: "Lung Function Test", date: "2025-02-28", type: "lab" },
      { id: "rec4", name: "X-Ray - Right Knee", date: "2025-02-28", type: "image" }
    ]
  },
  {
    id: "p3",
    name: "Sofia Martinez",
    age: 29,
    email: "sofia.martinez@example.com",
    phone: "(555) 345-6789",
    conditions: ["Anxiety", "Migraine"],
    lastVisit: "2025-03-05",
    nextAppointment: "2025-04-25",
    medicalRecords: [
      { id: "rec5", name: "Psychiatric Evaluation", date: "2025-03-05", type: "report" },
      { id: "rec6", name: "Medication History", date: "2025-03-05", type: "document" }
    ]
  },
  {
    id: "p4",
    name: "Michael Chen",
    age: 52,
    email: "michael.chen@example.com",
    phone: "(555) 456-7890",
    conditions: ["Coronary Artery Disease", "High Cholesterol"],
    lastVisit: "2025-03-10",
    nextAppointment: "2025-04-10",
    medicalRecords: [
      { id: "rec7", name: "Cardiac Stress Test", date: "2025-03-10", type: "lab" },
      { id: "rec8", name: "Echocardiogram", date: "2025-03-10", type: "image" }
    ]
  },
  {
    id: "p5",
    name: "Amelia Taylor",
    age: 38,
    email: "amelia.taylor@example.com",
    phone: "(555) 567-8901",
    conditions: ["Hypothyroidism", "Vitamin D Deficiency"],
    lastVisit: "2025-03-18",
    nextAppointment: "2025-04-18",
    medicalRecords: [
      { id: "rec9", name: "Thyroid Panel", date: "2025-03-18", type: "lab" },
      { id: "rec10", name: "Blood Work", date: "2025-03-18", type: "lab" }
    ]
  }
];

// Mock upcoming appointments
const upcomingAppointments = [
  {
    id: "app1",
    patientName: "Emily Johnson",
    patientId: "p1",
    date: "2025-04-20",
    time: "10:30 AM",
    reason: "Follow-up on diabetes management"
  },
  {
    id: "app2",
    patientName: "Thomas Wilson",
    patientId: "p2",
    date: "2025-04-15",
    time: "9:00 AM",
    reason: "Asthma medication review"
  },
  {
    id: "app3",
    patientName: "Amelia Taylor",
    patientId: "p5",
    date: "2025-04-18",
    time: "2:15 PM",
    reason: "Thyroid function check"
  },
  {
    id: "app4",
    patientName: "Michael Chen",
    patientId: "p4",
    date: "2025-04-10",
    time: "11:45 AM",
    reason: "Post-cardiac evaluation"
  },
  {
    id: "app5",
    patientName: "Sofia Martinez",
    patientId: "p3",
    date: "2025-04-25",
    time: "3:30 PM",
    reason: "Anxiety treatment follow-up"
  }
];

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  
  const togglePatientDetails = (patientId: string) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };
  
  const filteredPatients = patients.filter(
    patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-healophile-purple">Doctor Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.name || "Doctor"}! Here's your patient overview.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button className="bg-healophile-purple hover:bg-healophile-purple-dark">
              <Calendar className="mr-2 h-4 w-4" /> Today's Schedule
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-healophile-blue/10 to-healophile-blue/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold">{patients.length}</p>
                </div>
                <div className="h-12 w-12 bg-healophile-blue/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-healophile-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-healophile-purple/10 to-healophile-purple/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <div className="h-12 w-12 bg-healophile-purple/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-healophile-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-healophile-emergency/10 to-healophile-emergency/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <div className="h-12 w-12 bg-healophile-emergency/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-healophile-emergency" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="patients">All Patients</TabsTrigger>
            <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-10">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No patients found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or add a new patient.
                  </p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <Card key={patient.id} className="overflow-hidden">
                    <div
                      className={`p-4 cursor-pointer border-l-4 ${
                        expandedPatient === patient.id 
                          ? "border-healophile-blue bg-healophile-blue/5" 
                          : "border-transparent hover:bg-gray-50"
                      }`}
                      onClick={() => togglePatientDetails(patient.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-healophile-purple-light rounded-full flex items-center justify-center">
                            <span className="text-healophile-purple font-medium">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.age} yrs • {patient.conditions.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right hidden md:block">
                            <p className="text-sm">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                            <p className="text-sm">Next: {new Date(patient.nextAppointment).toLocaleDateString()}</p>
                          </div>
                          {expandedPatient === patient.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {expandedPatient === patient.id && (
                      <CardContent className="bg-gray-50 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Patient Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p>{patient.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{patient.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Next Appointment</p>
                                <p>{new Date(patient.nextAppointment).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Last Visit</p>
                                <p>{new Date(patient.lastVisit).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                              <div className="flex flex-wrap gap-2">
                                {patient.conditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary">{condition}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-medium">Medical Records</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {patient.medicalRecords.map((record) => (
                                <div key={record.id} className="flex items-center justify-between p-2 border rounded hover:bg-white">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-healophile-blue mr-2" />
                                    <div>
                                      <p className="text-sm font-medium">{record.name}</p>
                                      <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Badge variant="outline">{record.type}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                View All Records
                              </Button>
                              <Button size="sm" className="flex-1 bg-healophile-blue hover:bg-healophile-blue-dark">
                                Add Notes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-3">
                        <div className="h-10 w-10 bg-healophile-blue-light rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-healophile-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            <span className="mx-1">•</span>
                            <span>{appointment.time}</span>
                          </div>
                          <p className="text-sm mt-2">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" className="bg-healophile-purple hover:bg-healophile-purple-dark">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
