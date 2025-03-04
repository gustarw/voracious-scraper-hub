
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
      isScrolled 
        ? "bg-black/90 backdrop-blur-md border-b border-scrapvorn-gray/10 py-3" 
        : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between">
        <Logo className="z-50" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-scrapvorn-orange"
                  asChild
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-scrapvorn-orange"
                  onClick={() => signOut()}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-scrapvorn-orange"
                  asChild
                >
                  <Link to="/auth">Login</Link>
                </Button>
                <Button 
                  className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black font-medium"
                  asChild
                >
                  <Link to="/auth?tab=register">Registrar</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 text-white hover:text-scrapvorn-orange transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 md:hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none -z-10"
          )}
        >
          <NavLinks mobile onClickLink={() => setIsMenuOpen(false)} />
          <div className="flex flex-col items-center space-y-4 mt-8">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-scrapvorn-orange w-full"
                  asChild
                >
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                </Button>
                <Button 
                  className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black font-medium w-full"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-scrapvorn-orange w-full"
                  asChild
                >
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button 
                  className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black font-medium w-full"
                  asChild
                >
                  <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>Registrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface NavLinksProps {
  mobile?: boolean;
  onClickLink?: () => void;
}

function NavLinks({ mobile, onClickLink }: NavLinksProps) {
  const links = [
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Pricing", path: "#pricing" },
    { name: "About", path: "#about" },
  ];

  return (
    <ul className={cn(
      "flex items-center space-x-8",
      mobile && "flex-col space-x-0 space-y-6 text-xl"
    )}>
      {links.map((link) => (
        <li key={link.name}>
          <Link 
            to={link.path}
            className="text-white/80 hover:text-scrapvorn-orange transition-colors"
            onClick={onClickLink}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
