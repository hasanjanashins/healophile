
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneCall, MapPin, Ambulance, AlertCircle, Heart, Building2, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo hospitals data
const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    distance: "2.3 miles",
    waitTime: "~15 min",
    address: "123 Medical Center Blvd",
    phone: "555-234-5678",
    services: ["Emergency", "Trauma Center", "ICU"],
    image: "https://placehold.co/300x200/d3e4fd/0EA5E9?text=City+General"
  },
  {
    id: 2,
    name: "Mercy Medical Center",
    distance: "3.7 miles",
    waitTime: "~25 min",
    address: "456 Healthcare Drive",
    phone: "555-987-6543",
    services: ["Emergency", "Pediatric ER", "Cardiology"],
    image: "https://placehold.co/300x200/e5deff/7E69AB?text=Mercy+Medical"
  },
  {
    id: 3,
    name: "University Hospital",
    distance: "5.1 miles",
    waitTime: "~40 min",
    address: "789 University Parkway",
    phone: "555-876-5432",
    services: ["Level 1 Trauma", "Emergency", "Stroke Center"],
    image: "https://placehold.co/300x200/FDE1D3/F97316?text=University+Hospital"
  }
];

const emergencyContacts = [
  {
    id: 1,
    name: "Emergency Services",
    number: "911",
    icon: <Ambulance className="h-5 w-5" />,
    color: "bg-healophile-emergency",
  },
  {
    id: 2,
    name: "Primary Physician",
    number: "555-123-4567",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-healophile-blue",
  },
  {
    id: 3,
    name: "Local Hospital",
    number: "555-987-6543",
    icon: <MapPin className="h-5 w-5" />,
    color: "bg-healophile-purple",
  },
];

const EmergencyServices = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [ambulanceRequested, setAmbulanceRequested] = useState(false);

  const handleEmergencyCall = (number: string, name: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${number}... (This is a demo)`,
    });
    console.log(`Calling ${name}: ${number}`);
  };

  const shareLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsLocating(false);
          
          toast({
            title: "Location shared",
            description: "Your current location has been shared with emergency services.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          
          toast({
            title: "Location error",
            description: "Unable to share your location. Please try again.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: "Location not supported",
        description: "Your browser does not support location sharing.",
        variant: "destructive",
      });
    }
  };
  
  const requestAmbulance = () => {
    if (!location) {
      shareLocation();
      setTimeout(() => {
        setAmbulanceRequested(true);
        toast({
          title: "Ambulance dispatched",
          description: "An ambulance has been dispatched to your location and will arrive in approximately 8 minutes.",
        });
      }, 2000);
    } else {
      setAmbulanceRequested(true);
      toast({
        title: "Ambulance dispatched",
        description: "An ambulance has been dispatched to your location and will arrive in approximately 8 minutes.",
      });
    }
  };
  
  const resetAmbulanceStatus = () => {
    setAmbulanceRequested(false);
  };
  
  return (
    <Card className="w-full border-healophile-emergency animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-healophile-emergency/20 to-healophile-emergency/5">
        <div className="flex items-center justify-center mb-2">
          <AlertCircle className="h-8 w-8 text-healophile-emergency" />
        </div>
        <CardTitle className="font-display text-center">Emergency Services</CardTitle>
        <CardDescription className="text-center">
          Quick access to emergency help when you need it most
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="options" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
          <TabsTrigger value="options" className="data-[state=active]:text-healophile-emergency">Emergency Options</TabsTrigger>
          <TabsTrigger value="hospitals" className="data-[state=active]:text-healophile-blue">Nearby Hospitals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="options" className="pt-6">
          <CardContent className="space-y-6">
            {ambulanceRequested ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-green-800 mb-2">Ambulance On The Way</h3>
                <p className="mb-4 text-green-700">
                  An ambulance has been dispatched to your location.
                  Estimated arrival time: <span className="font-bold">8 minutes</span>
                </p>
                <p className="text-sm text-green-600 mb-6">
                  Please stay where you are and keep your phone nearby.
                  An emergency responder may call you for further details.
                </p>
                <Button variant="outline" onClick={resetAmbulanceStatus}>
                  Return to Emergency Options
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ambulance Request Card */}
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-healophile-emergency">
                    <div className="bg-healophile-emergency h-36 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-healophile-emergency/90">
                        <Ambulance className="h-20 w-20 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-display font-bold mb-2 text-healophile-emergency">Request Ambulance</h3>
                      <p className="text-muted-foreground mb-4">
                        Request emergency medical transport to the nearest hospital. Paramedics will be dispatched immediately.
                      </p>
                      <Button 
                        onClick={requestAmbulance}
                        className="w-full bg-healophile-emergency hover:bg-healophile-emergency/90"
                      >
                        <Ambulance className="mr-2 h-4 w-4" /> Request Now
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Call Emergency Card */}
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                    <div className="bg-healophile-purple h-36 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-healophile-purple/90">
                        <PhoneCall className="h-20 w-20 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-display font-bold mb-2 text-healophile-purple">Call Emergency</h3>
                      <p className="text-muted-foreground mb-4">
                        Directly call emergency services (911) to report a medical emergency or request assistance.
                      </p>
                      <Button 
                        onClick={() => handleEmergencyCall("911", "Emergency Services")}
                        className="w-full bg-healophile-purple hover:bg-healophile-purple/90"
                      >
                        <PhoneCall className="mr-2 h-4 w-4" /> Call 911
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {emergencyContacts.map((contact) => (
                    <Card key={contact.id} className="overflow-hidden card-hover">
                      <CardContent className="p-0">
                        <div className={`${contact.color} p-4 flex justify-center`}>
                          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                            {contact.icon}
                          </div>
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{contact.number}</p>
                          <Button 
                            onClick={() => handleEmergencyCall(contact.number, contact.name)}
                            className={`w-full ${
                              contact.id === 1 
                                ? "bg-healophile-emergency hover:bg-healophile-emergency/90" 
                                : "bg-healophile-blue hover:bg-healophile-blue-dark"
                            }`}
                          >
                            <PhoneCall className="mr-2 h-4 w-4" /> Call Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="font-display text-lg">Share Your Location</h3>
                      <p className="text-muted-foreground">
                        In case of emergency, share your precise location with emergency services
                      </p>
                      
                      <Button 
                        onClick={shareLocation} 
                        disabled={isLocating}
                        className="w-full bg-healophile-purple hover:bg-healophile-purple-dark"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {isLocating ? "Getting Location..." : "Share My Location"}
                      </Button>
                      
                      {location && (
                        <p className="text-sm text-muted-foreground">
                          Location shared: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            <div className="bg-healophile-emergency/10 p-4 rounded-lg">
              <p className="text-center text-sm font-medium text-healophile-emergency">
                If this is a life-threatening emergency, please call 911 immediately or visit the nearest emergency room.
              </p>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="hospitals" className="pt-6">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={hospital.image} 
                      alt={hospital.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{hospital.name}</h3>
                      <Badge variant="outline" className="bg-blue-50">{hospital.distance}</Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{hospital.address}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-orange-500" />
                        <span className="font-medium text-orange-600">Wait time: {hospital.waitTime}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {hospital.services.map((service, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleEmergencyCall(hospital.phone, hospital.name)} 
                        className="flex-1 bg-healophile-blue hover:bg-healophile-blue-dark"
                      >
                        <PhoneCall className="mr-1 h-4 w-4" /> Call
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MapPin className="mr-1 h-4 w-4" /> Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" className="flex">
                <MapPin className="mr-2 h-4 w-4" /> View More Hospitals
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmergencyServices;
