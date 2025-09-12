import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  Heart,
  Pill,
  Bandage,
  Activity,
  Stethoscope,
  Shield
} from "lucide-react";

const MedsByDrone = () => {
  const [medicineName, setMedicineName] = useState("");
  const [urgency, setUrgency] = useState("");
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [selectedFirstAidKit, setSelectedFirstAidKit] = useState("");

  const emergencyMedicines = [
    { name: "Aspirin", category: "Cardiac", icon: Heart, available: true, eta: "12 min" },
    { name: "Epinephrine", category: "Allergy", icon: Shield, available: true, eta: "8 min" },
    { name: "Inhaler (Albuterol)", category: "Respiratory", icon: Activity, available: true, eta: "10 min" },
    { name: "Insulin", category: "Diabetes", icon: Pill, available: true, eta: "15 min" },
    { name: "Nitroglycerin", category: "Cardiac", icon: Heart, available: false, eta: "N/A" },
    { name: "Glucose Tablets", category: "Diabetes", icon: Pill, available: true, eta: "7 min" }
  ];

  const firstAidKits = [
    {
      id: "basic",
      name: "Basic First Aid Kit",
      contents: ["Bandages", "Antiseptic Wipes", "Pain Relief Gel", "Thermometer"],
      eta: "8 minutes",
      weight: "0.5 kg"
    },
    {
      id: "advanced",
      name: "Advanced Emergency Kit",
      contents: ["Blood Pressure Monitor", "Pulse Oximeter", "Emergency Medications", "Sterile Gauze"],
      eta: "12 minutes", 
      weight: "1.2 kg"
    },
    {
      id: "cardiac",
      name: "Cardiac Emergency Kit",
      contents: ["AED Pads", "Aspirin", "Nitroglycerin", "Emergency Instructions"],
      eta: "10 minutes",
      weight: "0.8 kg"
    },
    {
      id: "trauma",
      name: "Trauma Response Kit",
      contents: ["Tourniquets", "Hemostatic Agents", "Emergency Splints", "Pressure Bandages"],
      eta: "15 minutes",
      weight: "1.5 kg"
    }
  ];

  const handleRequestMedicine = () => {
    if (medicineName.trim()) {
      setDeliveryRequested(true);
    }
  };

  const handleRequestFirstAidKit = (kitId: string) => {
    setSelectedFirstAidKit(kitId);
    setDeliveryRequested(true);
  };

  if (deliveryRequested) {
    return (
      <Card className="w-full border-healophile-blue-light">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="animate-bounce">
              <Plane className="h-16 w-16 text-healophile-blue mx-auto mb-4" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Drone Dispatched!</h3>
              <p className="text-muted-foreground mb-4">
                Your emergency medicine/supplies are on the way
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-800">Estimated Arrival</p>
                  <p className="text-green-700">8-15 minutes</p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Tracking ID</p>
                  <p className="text-green-700">DR{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
              <h4 className="font-medium text-blue-800 mb-2">Delivery Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Drone will hover at a safe altitude</li>
                <li>• Medicine will be lowered in a secured container</li>
                <li>• Please remain in your current location</li>
                <li>• Emergency services have been notified</li>
              </ul>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setDeliveryRequested(false)}
              >
                Request Another Item
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Call Emergency Services
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-healophile-blue-light">
      <CardHeader>
        <CardTitle className="font-display text-center flex items-center justify-center gap-2">
          <Plane className="h-6 w-6 text-healophile-blue" />
          Meds By Drone
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Emergency medicine and first aid supply delivery via drone technology
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="medicine" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medicine">Emergency Medicine</TabsTrigger>
            <TabsTrigger value="firstaid">First Aid Kit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="medicine" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="medicine-name">Tell me the medicine name</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="medicine-name"
                    placeholder="Enter medicine name (e.g., Aspirin, Insulin)"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleRequestMedicine}
                    disabled={!medicineName.trim()}
                    className="bg-healophile-blue hover:bg-healophile-blue-dark"
                  >
                    Request
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="urgency">Urgency Level (Optional)</Label>
                <Textarea
                  id="urgency"
                  placeholder="Describe the urgency or medical condition requiring this medicine"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Common Emergency Medicines Available</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyMedicines.map((medicine, index) => {
                  const IconComponent = medicine.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        medicine.available 
                          ? 'hover:bg-healophile-blue/5 border-healophile-blue/20' 
                          : 'opacity-50 cursor-not-allowed border-gray-200'
                      }`}
                      onClick={() => medicine.available && setMedicineName(medicine.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-healophile-blue" />
                          <div>
                            <p className="font-medium text-sm">{medicine.name}</p>
                            <p className="text-xs text-muted-foreground">{medicine.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={medicine.available ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {medicine.available ? medicine.eta : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="firstaid" className="mt-6 space-y-6">
            <div>
              <h3 className="font-medium mb-4">First Aid Kit Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {firstAidKits.map((kit) => (
                  <Card 
                    key={kit.id}
                    className="cursor-pointer transition-all hover:shadow-md border-healophile-blue/20 hover:border-healophile-blue"
                    onClick={() => handleRequestFirstAidKit(kit.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-healophile-purple" />
                          <h4 className="font-medium">{kit.name}</h4>
                        </div>
                        <Badge className="text-xs">{kit.eta}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <strong>Weight:</strong> {kit.weight}
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Contents:</p>
                          <div className="flex flex-wrap gap-1">
                            {kit.contents.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-3 bg-healophile-purple hover:bg-healophile-purple-dark"
                        size="sm"
                      >
                        Request This Kit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Important Safety Information
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Drone delivery available within 20km radius</li>
            <li>• Emergency services will be automatically notified</li>
            <li>• Only licensed medications will be delivered</li>
            <li>• Please ensure safe landing area is available</li>
            <li>• For life-threatening emergencies, call 911 immediately</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedsByDrone;