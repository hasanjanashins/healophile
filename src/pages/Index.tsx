
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, MessageCircle, Phone, Lock, DownloadCloud, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-healophile-blue-light via-white to-healophile-purple-light py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                Your Smart <span className="text-healophile-blue">Healthcare</span> Companion
              </h1>
              <p className="text-xl mb-8 text-gray-600 max-w-lg">
                Simplify your healthcare journey with secure file management, instant assistance, 
                and emergency services – all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-healophile-purple hover:bg-healophile-purple-dark text-white rounded-full">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-healophile-blue text-healophile-blue hover:bg-healophile-blue-light">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://placehold.co/600x500/d3e4fd/0EA5E9?text=Healophile" 
                alt="Healophile App" 
                className="max-w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Healophile combines essential healthcare tools in a user-friendly interface, 
              making healthcare management simple and accessible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="h-10 w-10 text-healophile-blue" />}
              title="Medical File Management"
              description="Securely upload, organize, and access your medical records anytime, anywhere."
              linkTo="/files"
            />
            <FeatureCard 
              icon={<MessageCircle className="h-10 w-10 text-healophile-purple" />}
              title="Healthcare Assistant"
              description="Get instant answers to your health questions from our friendly AI assistant."
              linkTo="/chat"
            />
            <FeatureCard 
              icon={<Phone className="h-10 w-10 text-healophile-emergency" />}
              title="Emergency Services"
              description="One-tap access to emergency contacts and services when you need them most."
              linkTo="/emergency"
            />
          </div>
        </div>
      </section>
      
      {/* Security Section */}
      <section className="py-16 bg-gradient-to-r from-healophile-blue-light to-healophile-purple-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/50 rounded-lg blur-lg"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-lg">
                  <Lock className="h-16 w-16 text-healophile-blue mb-4 mx-auto" />
                  <h3 className="text-xl font-display font-bold text-center mb-2">Your Data, Protected</h3>
                  <ul className="space-y-3">
                    {[
                      "End-to-end encryption",
                      "HIPAA-compliant storage",
                      "Two-factor authentication",
                      "Secure file sharing",
                      "Privacy controls"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-display font-bold mb-4">Your Health Data Deserves the Best Security</h2>
              <p className="text-lg mb-6">
                We take your privacy seriously. Healophile employs industry-leading security measures 
                to ensure your medical information remains confidential and protected.
              </p>
              <Button asChild size="lg" className="bg-white text-healophile-blue hover:bg-gray-100 rounded-full">
                <Link to="/signup">Secure Your Health Data</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Trusted by Patients Everywhere</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our users are saying about how Healophile has transformed their healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Healophile has been a game-changer for managing my family's medical records. Everything is now organized in one secure place!"
              author="Sarah M."
              role="Parent of 3"
            />
            <TestimonialCard 
              quote="As someone with a chronic condition, having all my medical files accessible from my phone has made doctor visits so much easier."
              author="David L."
              role="Patient"
            />
            <TestimonialCard 
              quote="The emergency feature gave me peace of mind when my father had a health scare while visiting. Quick access to local services was invaluable."
              author="Emma R."
              role="Caregiver"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-healophile-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their healthcare journey with Healophile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-healophile-purple hover:bg-gray-100 rounded-full">
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-healophile-purple-dark">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const FeatureCard = ({ icon, title, description, linkTo }: FeatureCardProps) => {
  return (
    <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all card-hover">
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <CardTitle className="mb-2 font-display">{title}</CardTitle>
        <CardDescription className="mb-6">{description}</CardDescription>
        <Button asChild variant="outline" className="rounded-full">
          <Link to={linkTo}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => {
  return (
    <Card className="border-0 shadow hover:shadow-lg transition-all card-hover">
      <CardContent className="p-6">
        <div className="mb-4 text-4xl text-healophile-purple">"</div>
        <p className="italic mb-6">{quote}</p>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
