import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plane, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedsByDroneProps {
  userRole: 'patient' | 'doctor' | null;
}

interface EmergencyRequest {
  id: string;
  patient_name: string;
  patient_id: string;
  request_type: string;
  details: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

const MedsByDrone = ({ userRole }: MedsByDroneProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [details, setDetails] = useState("");
  const [requestType, setRequestType] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch emergency requests for doctors
  useEffect(() => {
    if (userRole === 'doctor') {
      fetchEmergencyRequests();
    }
  }, [userRole]);

  const fetchEmergencyRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmergencyRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch emergency requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientRequest = async () => {
    if (!requestType || !details.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a request type and provide details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Create emergency request
      const { error } = await supabase
        .from('emergency_requests')
        .insert({
          patient_id: user?.id,
          patient_name: user?.user_metadata?.full_name || user?.email || 'Unknown',
          request_type: requestType,
          details: details,
          latitude: latitude,
          longitude: longitude,
          status: 'pending'
        });

      if (error) throw error;

      setShowSuccessDialog(true);
      setDetails("");
      setRequestType("");
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send emergency request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveRequest = async (requestId: string, type: string) => {
    try {
      const { error } = await supabase
        .from('emergency_requests')
        .update({ 
          status: 'approved',
          assigned_doctor_id: user?.id 
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Approved",
        description: `Drone dispatched with ${type}`,
      });

      fetchEmergencyRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  if (userRole === 'patient') {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              Request Emergency Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-type">What do you need?</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="request-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="first-aid">First Aid Kit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  placeholder="Describe what you need and your current situation..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Location sharing required</p>
                    <p>Your location will be shared with medical professionals to dispatch the drone.</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePatientRequest}
                disabled={isSubmitting || !requestType || !details.trim()}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Plane className="mr-2 h-4 w-4" />
                    Send Emergency Request
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                Request Sent Successfully
              </DialogTitle>
              <DialogDescription className="space-y-3 pt-4">
                <p>
                  Your emergency request has been sent to our medical team. 
                  A doctor will review your request and dispatch the drone shortly.
                </p>
                <p className="font-medium">
                  Someone will contact you soon. Please stay at your current location.
                </p>
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (userRole === 'doctor') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Emergency Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading requests...</p>
            ) : emergencyRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No emergency requests at this time</p>
            ) : (
              <div className="space-y-4">
                {emergencyRequests.map((request) => (
                  <Card key={request.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{request.patient_name}</h3>
                            <Badge variant={request.status === 'pending' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize">{request.request_type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.details}</p>
                        </div>

                        {request.latitude && request.longitude && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span>Location: {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleApproveRequest(request.id, request.request_type)}
                              className="flex-1"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve & Dispatch Drone
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MedsByDrone;
