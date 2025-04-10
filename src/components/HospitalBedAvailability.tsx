
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  Building2, 
  BedDouble, 
  Stethoscope,
  HeartPulse,
  Ambulance,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Sample data for hospital beds
const hospitalData = [
  {
    id: "h1",
    name: "Apollo Hospital",
    location: "Madhapur, Hyderabad",
    distance: "2.3 km",
    totalBeds: 50,
    availableBeds: 12,
    specialties: ["General", "ICU", "Cardiac"],
    facilities: ["Ambulance", "24x7 Pharmacy", "Lab Services"],
    image: "https://placehold.co/600x400/e5deff/7E69AB?text=Apollo+Hospital"
  },
  {
    id: "h2",
    name: "KIMS Hospital",
    location: "Secunderabad, Hyderabad",
    distance: "4.8 km",
    totalBeds: 80,
    availableBeds: 5,
    specialties: ["General", "Pediatric", "Maternity"],
    facilities: ["Emergency Care", "Blood Bank", "ICU"],
    image: "https://placehold.co/600x400/d3e4fd/0EA5E9?text=KIMS+Hospital"
  },
  {
    id: "h3",
    name: "Care Hospital",
    location: "Banjara Hills, Hyderabad",
    distance: "3.1 km",
    totalBeds: 65,
    availableBeds: 20,
    specialties: ["Cardiac", "Neurology", "Orthopedic"],
    facilities: ["CT Scan", "MRI", "Emergency Services"],
    image: "https://placehold.co/600x400/F2FCE2/22C55E?text=Care+Hospital"
  },
  {
    id: "h4",
    name: "Yashoda Hospital",
    location: "Somajiguda, Hyderabad",
    distance: "5.7 km",
    totalBeds: 120,
    availableBeds: 30,
    specialties: ["General", "Cardiac", "Oncology"],
    facilities: ["Ambulance", "Blood Bank", "Dialysis Center"],
    image: "https://placehold.co/600x400/FEF7CD/EAB308?text=Yashoda+Hospital"
  },
  {
    id: "h5",
    name: "Sunshine Hospital",
    location: "Gachibowli, Hyderabad",
    distance: "6.2 km",
    totalBeds: 90,
    availableBeds: 0,
    specialties: ["Orthopedic", "Neurology", "General"],
    facilities: ["Emergency Care", "Physiotherapy", "ICU"],
    image: "https://placehold.co/600x400/FFDEE2/F43F5E?text=Sunshine+Hospital"
  },
  {
    id: "h6",
    name: "Medanta Hospital",
    location: "Jubilee Hills, Hyderabad",
    distance: "4.5 km",
    totalBeds: 75,
    availableBeds: 8,
    specialties: ["Cardiac", "Pulmonology", "General"],
    facilities: ["Ambulance", "ICU", "24x7 Pharmacy"],
    image: "https://placehold.co/600x400/FDE1D3/F97316?text=Medanta+Hospital"
  }
];

const HospitalBedAvailability = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredHospitals = hospitalData.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = filterSpecialty === "all" || 
                           hospital.specialties.some(s => s.toLowerCase() === filterSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });
  
  const totalAvailableBeds = filteredHospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
  
  return (
    <Card className="w-full border-healophile-blue-light">
      <CardHeader>
        <CardTitle className="font-display text-center">Hospital Bed Availability</CardTitle>
        <CardDescription className="text-center">
          Find available hospital beds in real-time across multiple hospitals
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex gap-2 items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {filterSpecialty !== "all" && <Badge className="ml-1">{filterSpecialty}</Badge>}
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-3 p-3 border rounded-md bg-muted/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="specialty" className="text-sm">Specialty</Label>
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="cardiac">Cardiac</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="pediatric">Pediatric</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="pulmonology">Pulmonology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-healophile-blue/10 to-healophile-blue/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hospitals</p>
                  <p className="text-3xl font-bold">{filteredHospitals.length}</p>
                </div>
                <div className="h-12 w-12 bg-healophile-blue/20 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-healophile-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-healophile-purple/10 to-healophile-purple/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Beds</p>
                  <p className="text-3xl font-bold">{totalAvailableBeds}</p>
                </div>
                <div className="h-12 w-12 bg-healophile-purple/20 rounded-full flex items-center justify-center">
                  <BedDouble className="h-6 w-6 text-healophile-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Emergency Ready</p>
                  <p className="text-3xl font-bold">24/7</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Hospitals</TabsTrigger>
            <TabsTrigger value="available">Beds Available</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Care</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredHospitals.length > 0 ? filteredHospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              )) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No hospitals found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredHospitals.filter(h => h.availableBeds > 0).length > 0 ? 
                filteredHospitals
                  .filter(h => h.availableBeds > 0)
                  .map(hospital => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  )) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <XCircle className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No available beds</h3>
                      <p className="text-muted-foreground">There are currently no available beds matching your criteria</p>
                    </div>
                  )}
            </div>
          </TabsContent>
          
          <TabsContent value="emergency" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredHospitals.filter(h => h.facilities.some(f => f.includes("Emergency") || f.includes("Ambulance"))).length > 0 ? 
                filteredHospitals
                  .filter(h => h.facilities.some(f => f.includes("Emergency") || f.includes("Ambulance")))
                  .map(hospital => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  )) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <Ambulance className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No emergency services found</h3>
                      <p className="text-muted-foreground">There are currently no hospitals with emergency services matching your criteria</p>
                    </div>
                  )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const HospitalCard = ({ hospital }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-40">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={hospital.availableBeds > 0 ? "bg-green-500" : "bg-red-500"}>
            {hospital.availableBeds > 0 ? 
              `${hospital.availableBeds} beds available` : 
              "No beds available"}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{hospital.name}</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> 24/7
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{hospital.location}</span>
          <span className="mx-1">•</span>
          <span>{hospital.distance}</span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {hospital.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-healophile-blue/5">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-healophile-purple" />
            <div className="text-sm">
              <p>{hospital.availableBeds}/{hospital.totalBeds}</p>
              <p className="text-xs text-muted-foreground">Beds Available</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-healophile-blue" />
            <div className="text-sm">
              <p>{hospital.specialties.length}</p>
              <p className="text-xs text-muted-foreground">Specialties</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button className="w-full bg-healophile-blue hover:bg-healophile-blue-dark">
            View Details & Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalBedAvailability;
