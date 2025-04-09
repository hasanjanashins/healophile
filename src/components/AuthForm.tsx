
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User, UserMd } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient" as "patient" | "doctor"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as "patient" | "doctor"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (type === "login") {
        login(formData.email, formData.password, formData.role);
        toast({
          title: "Login successful",
          description: `Welcome back${formData.role === "doctor" ? ", Doctor" : ""}!`,
        });
        
        // Redirect to appropriate dashboard
        if (formData.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/");
        }
      } else {
        signup(formData.name, formData.email, formData.password, formData.role);
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "There was a problem authenticating you.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-healophile-blue-light">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-display text-center">
          {type === "login" ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Enter your information to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required={type === "signup"}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === "login" && (
                <a
                  href="#"
                  className="text-sm font-medium text-healophile-blue hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>I am a</Label>
            <RadioGroup 
              value={formData.role} 
              onValueChange={handleRoleChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctor" id="doctor" />
                <Label htmlFor="doctor" className="cursor-pointer">Doctor</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-healophile-blue to-healophile-purple hover:opacity-90"
          >
            {type === "login" ? "Log in" : "Sign up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {type === "login" ? "Don't have an account? " : "Already have an account? "}
          <a
            href={type === "login" ? "/signup" : "/login"}
            className="text-healophile-blue font-medium hover:underline"
          >
            {type === "login" ? "Sign up" : "Log in"}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
