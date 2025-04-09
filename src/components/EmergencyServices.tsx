
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MapPin, Ambulance, AlertCircle, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  
  return (
    <Card className="w-full border-healophile-emergency">
      <CardHeader className="bg-healophile-emergency/10">
        <div className="flex items-center justify-center mb-2">
          <AlertCircle className="h-8 w-8 text-healophile-emergency" />
        </div>
        <CardTitle className="font-display text-center">Emergency Services</CardTitle>
        <CardDescription className="text-center">
          Quick access to emergency contacts and services
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
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
        
        <div className="bg-healophile-emergency/10 p-4 rounded-lg">
          <p className="text-center text-sm font-medium text-healophile-emergency">
            If this is a life-threatening emergency, please call 911 immediately or visit the nearest emergency room.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyServices;
