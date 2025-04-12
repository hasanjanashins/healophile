
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyServices from "@/components/EmergencyServices";
import HospitalBedAvailability from "@/components/HospitalBedAvailability";
import EmergencyMap from "@/components/EmergencyMap";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Emergency = () => {
  const [showMap, setShowMap] = useState(false);

  const handleShareLocation = () => {
    setShowMap(true);
  };

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
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="beds">Hospital Bed Availability</TabsTrigger>
              <TabsTrigger value="location">Share My Location</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts">
              <EmergencyServices />
            </TabsContent>
            <TabsContent value="beds">
              <HospitalBedAvailability />
            </TabsContent>
            <TabsContent value="location">
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-muted">
                  <h2 className="text-xl font-semibold mb-3">Emergency Location Services</h2>
                  <p className="mb-4">
                    Share your current location to help emergency services reach you quickly. 
                    Your location will only be shared with authorized emergency responders.
                  </p>
                  
                  {showMap ? (
                    <div className="space-y-4">
                      <EmergencyMap />
                      <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <p className="text-green-800 font-medium">
                          Location shared successfully! Emergency services have been notified.
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          An ambulance has been dispatched to your location. Please stay where you are.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button 
                        onClick={handleShareLocation}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                      >
                        Share My Location
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Emergency;
