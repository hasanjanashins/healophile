import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneCall, MapPin, Ambulance, AlertCircle, Heart, Building2, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
    image: "https://placehold.co/300x200/d3e4fd/0EA5E9?text=City+General",
    location: { lat: 28.6139, lng: 77.2090 } // Delhi coordinates
  },
  {
    id: 2,
    name: "Mercy Medical Center",
    distance: "3.7 miles",
    waitTime: "~25 min",
    address: "456 Healthcare Drive",
    phone: "555-987-6543",
    services: ["Emergency", "Pediatric ER", "Cardiology"],
    image: "https://placehold.co/300x200/e5deff/7E69AB?text=Mercy+Medical",
    location: { lat: 28.6304, lng: 77.2177 } // Near Delhi
  },
  {
    id: 3,
    name: "University Hospital",
    distance: "5.1 miles",
    waitTime: "~40 min",
    address: "789 University Parkway",
    phone: "555-876-5432",
    services: ["Level 1 Trauma", "Emergency", "Stroke Center"],
    image: "https://placehold.co/300x200/FDE1D3/F97316?text=University+Hospital",
    location: { lat: 28.6258, lng: 77.2209 } // Near Delhi
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
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [ambulancePosition, setAmbulancePosition] = useState<{lat: number; lng: number} | null>(null);

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
          const userLocation = { lat: latitude, lng: longitude };
          setLocation(userLocation);
          setIsLocating(false);
          setMapVisible(true);
          
          toast({
            title: "Location shared",
            description: "Your current location has been shared with emergency services.",
          });
          
          // Find the nearest hospital
          let nearest = 0;
          let minDistance = Number.MAX_VALUE;
          
          hospitals.forEach((hospital, index) => {
            const distance = calculateDistance(
              userLocation.lat, userLocation.lng,
              hospital.location.lat, hospital.location.lng
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              nearest = index;
            }
          });
          
          setSelectedHospital(nearest);
          
          // Set initial ambulance position at the selected hospital
          setAmbulancePosition(hospitals[nearest].location);
          
          // Simulate ambulance moving towards the user
          simulateAmbulanceMovement(hospitals[nearest].location, userLocation);
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
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };
  
  const simulateAmbulanceMovement = (start: {lat: number; lng: number}, end: {lat: number; lng: number}) => {
    const steps = 20; // Number of steps for animation
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        // Linear interpolation between points
        const newLat = start.lat + (end.lat - start.lat) * (currentStep / steps);
        const newLng = start.lng + (end.lng - start.lng) * (currentStep / steps);
        
        setAmbulancePosition({ lat: newLat, lng: newLng });
      } else {
        clearInterval(interval);
      }
    }, 1000);
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
      setMapVisible(true);
      toast({
        title: "Ambulance dispatched",
        description: "An ambulance has been dispatched to your location and will arrive in approximately 8 minutes.",
      });
    }
  };
  
  const resetAmbulanceStatus = () => {
    setAmbulanceRequested(false);
    setMapVisible(false);
    setAmbulancePosition(null);
  };
  
  const closeMapView = () => {
    setMapVisible(false);
  };

  const renderMapView = () => {
    if (!location) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-background p-4 rounded-lg shadow-lg w-[90%] max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Emergency Response Map</h3>
            <Button variant="ghost" size="sm" onClick={closeMapView}>
              ✕
            </Button>
          </div>
          
          <div className="relative w-full h-[400px] bg-gray-100 rounded-md overflow-hidden mb-4">
            <div className="w-full h-full relative bg-blue-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100/50">
                <div className="w-full h-full" style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px), 
                                    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="absolute" style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-ping absolute"></div>
                  <div className="h-4 w-4 bg-blue-600 rounded-full relative"></div>
                </div>
                
                {selectedHospital !== null && (
                  <div className="absolute" style={{
                    top: '30%',
                    left: '30%',
                  }}>
                    <div className="h-4 w-4 bg-healophile-purple rounded-full"></div>
                  </div>
                )}
                
                {ambulancePosition && (
                  <div className="absolute" style={{
                    top: '40%',
                    left: '40%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <div className="h-5 w-5 bg-healophile-emergency rounded-full flex items-center justify-center">
                      <Ambulance className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}

                <svg className="absolute inset-0 w-full h-full" style={{ 
                  overflow: 'visible', 
                  zIndex: 0 
                }}>
                  {selectedHospital !== null && (
                    <path 
                      d="M30%,30% Q40%,40% 50%,50%" 
                      stroke="rgba(220, 38, 38, 0.6)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeDasharray="5,5"
                    />
                  )}
                </svg>
              </div>
              <div className="absolute z-10 text-gray-600 font-medium">
                Demo Map View
              </div>
            </div>
            
            <div className="absolute left-0 bottom-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Your Location</p>
                  <p className="text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
                {ambulanceRequested && (
                  <div className="bg-healophile-emergency/90 rounded-full px-3 py-1 text-sm flex items-center">
                    <Ambulance className="h-3 w-3 mr-1" /> 
                    <span>ETA: 8 min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {ambulanceRequested && selectedHospital !== null && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="flex items-start">
                <div className="bg-healophile-blue/10 p-2 rounded-full">
                  <Ambulance className="h-5 w-5 text-healophile-blue" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Ambulance Dispatched</h4>
                  <p className="text-sm text-muted-foreground">
                    From {hospitals[selectedHospital].name} • ETA: 8 minutes
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={closeMapView}>
              Close Map
            </Button>
            {!ambulanceRequested && (
              <Button className="flex-1 bg-healophile-emergency" onClick={requestAmbulance}>
                <Ambulance className="mr-2 h-4 w-4" /> Request Ambulance
              </Button>
            )}
          </div>
        </div>
      </div>
    );
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
            {mapVisible && location && renderMapView()}
            
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
                <div className="flex space-x-2 justify-center">
                  <Button variant="outline" onClick={resetAmbulanceStatus}>
                    Return to Emergency Options
                  </Button>
                  {location && (
                    <Button className="bg-healophile-blue" onClick={() => setMapVisible(true)}>
                      <MapPin className="mr-2 h-4 w-4" /> View on Map
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
