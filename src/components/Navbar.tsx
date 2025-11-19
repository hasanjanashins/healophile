
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, FileText, MessageCircle, Phone, Calendar, LogOut, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  const userName = user?.user_metadata?.full_name || user?.email || "User";
  const isDoctorUser = userRole === "doctor";

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
            {user && (
              <>
                {!isDoctorUser && (
                  <>
                    <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
                      <Link to="/files">
                        <FileText className="mr-1 h-4 w-4" />
                        Files
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
                      <Link to="/appointments">
                        <Calendar className="mr-1 h-4 w-4" />
                        Appointments
                      </Link>
                    </Button>
                  </>
                )}
                {isDoctorUser && (
                  <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
                    <Link to="/doctor-dashboard">
                      <UserCircle className="mr-1 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full border border-muted hover:bg-transparent">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-healophile-purple text-white">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{userName}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      {isDoctorUser ? (
                        <DropdownMenuItem onClick={() => navigate('/doctor-dashboard')}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => navigate('/appointments')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Appointments</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {!user && (
              <>
                <Button asChild variant="ghost" className="text-gray-600 hover:text-healophile-purple">
                  <Link to="/chat">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Assistant
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-healophile-purple text-healophile-purple hover:bg-healophile-purple-light">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full bg-healophile-purple hover:bg-healophile-purple-dark text-white">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
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
            {user && (
              <>
                <div className="py-3 border-b mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-healophile-purple text-white">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                {!isDoctorUser && (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/files" onClick={() => setIsMenuOpen(false)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Files
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/appointments" onClick={() => setIsMenuOpen(false)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Appointments
                      </Link>
                    </Button>
                  </>
                )}
                {isDoctorUser && (
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/doctor-dashboard" onClick={() => setIsMenuOpen(false)}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
              </>
            )}
            
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Assistant
              </Link>
            </Button>
            
            {user && (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/emergency" onClick={() => setIsMenuOpen(false)}>
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency
                </Link>
              </Button>
            )}
            
            {!user ? (
              <div className="pt-2 flex flex-col space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full bg-healophile-purple">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline" 
                  className="w-full text-red-500 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
