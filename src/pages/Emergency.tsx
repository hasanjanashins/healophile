
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyServices from "@/components/EmergencyServices";
import HospitalBedAvailability from "@/components/HospitalBedAvailability";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Emergency = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6 text-center">Emergency Services</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Quick access to emergency contacts and services. In case of a medical emergency, 
          use the options below to get immediate assistance.
        </p>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="contacts" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="beds">Hospital Bed Availability</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts">
              <EmergencyServices />
            </TabsContent>
            <TabsContent value="beds">
              <HospitalBedAvailability />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Emergency;
