
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell, FileText, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-healophile-blue to-healophile-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="ml-2 text-xl font-display font-bold text-healophile-purple">Healophile</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
              <Link to="/files">
                <FileText className="mr-1 h-4 w-4" />
                Files
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
              <Link to="/chat">
                <MessageCircle className="mr-1 h-4 w-4" />
                Assistant
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
              <Link to="/emergency">
                <Phone className="mr-1 h-4 w-4" />
                Emergency
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-healophile-purple text-healophile-purple hover:bg-healophile-purple-light">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full bg-healophile-purple hover:bg-healophile-purple-dark text-white">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-in">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/files" onClick={() => setIsMenuOpen(false)}>
                <FileText className="mr-2 h-4 w-4" />
                Files
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Assistant
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/emergency" onClick={() => setIsMenuOpen(false)}>
                <Phone className="mr-2 h-4 w-4" />
                Emergency
              </Link>
            </Button>
            <div className="pt-2 flex flex-col space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild className="w-full bg-healophile-purple">
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
