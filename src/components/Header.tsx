import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-primary text-primary-foreground shadow-marine">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🐠</span>
            </div>
            <span className="text-xl font-bold">Spear ID</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-primary-light transition-colors ${
                location.pathname === "/" ? "text-primary-light" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/quiz" 
              className={`hover:text-primary-light transition-colors ${
                location.pathname === "/quiz" ? "text-primary-light" : ""
              }`}
            >
              Quiz
            </Link>
            <span className="text-primary-light/70">Species</span>
            <span className="text-primary-light/70">Profile</span>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Log In
            </Button>
            <Button variant="secondary" size="sm" className="hidden md:inline-flex">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;