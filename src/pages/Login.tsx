
import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mb-8">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="mx-auto flex items-center justify-center text-healophile-blue mb-4 hover:underline"
          >
            {showCredentials ? "Hide Demo Credentials" : "Show Demo Credentials"}
          </button>
          
          {showCredentials && (
            <Card className="border border-healophile-blue/20 shadow-md mb-6 overflow-hidden">
              <div className="bg-healophile-blue/5 p-4 border-b border-healophile-blue/20">
                <h3 className="font-medium text-center text-lg">Demo Credentials</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Use these accounts to test the file sharing functionality
                </p>
              </div>
              <CardContent className="p-0">
                <Tabs defaultValue="patient" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none">
                    <TabsTrigger value="patient">Patient Account</TabsTrigger>
                    <TabsTrigger value="doctor">Doctor Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="patient" className="p-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-healophile-blue/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-healophile-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                        <p className="text-sm text-muted-foreground">Patient</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Email:</p>
                        <p className="font-mono bg-muted p-1 rounded text-xs">patient@healophile.com</p>
                      </div>
                      <div>
                        <p className="font-medium">Password:</p>
                        <p className="font-mono bg-muted p-1 rounded text-xs">patient123</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="doctor" className="p-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-healophile-purple/20 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-healophile-purple" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. Arjun Singh</p>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Email:</p>
                        <p className="font-mono bg-muted p-1 rounded text-xs">doctor@healophile.com</p>
                      </div>
                      <div>
                        <p className="font-medium">Password:</p>
                        <p className="font-mono bg-muted p-1 rounded text-xs">doctor123</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        
        <AuthForm type="login" />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
