import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Send OTP code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // No redirectTo — we use OTP verification instead
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Code sent", description: "Check your email for a 6-digit verification code." });
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
    } else {
      setVerified(true);
      toast({ title: "Code verified", description: "Now set your new password." });
    }
  };

  // Step 3: Set new password
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      toast({ title: "Password too weak", description: "Must be 8+ chars with uppercase, lowercase, and number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "You can now log in with your new password." });
      navigate("/login");
    }
  };

  // Determine current step
  const step = verified ? 3 : sent ? 2 : 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-lg border-healophile-blue-light">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Set your new password"}
            </CardDescription>
          </CardHeader>

          {step === 1 && (
            <CardContent>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="antra.ranjan@gmail.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-healophile-blue to-healophile-purple hover:opacity-90" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            </CardContent>
          )}

          {step === 2 && (
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Code sent to {email}
                  </p>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-healophile-blue to-healophile-purple hover:opacity-90" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => { setSent(false); setOtp(""); }}>
                  Resend code
                </Button>
              </form>
            </CardContent>
          )}

          {step === 3 && (
            <CardContent>
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Must be 8+ characters with uppercase, lowercase, and a number.</p>
                <Button type="submit" className="w-full bg-gradient-to-r from-healophile-blue to-healophile-purple hover:opacity-90" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          )}

          <CardFooter className="flex justify-center">
            <a href="/login" className="text-sm text-healophile-blue hover:underline">Back to login</a>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;