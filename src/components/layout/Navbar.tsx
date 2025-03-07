
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function Navbar() {
  const { user } = useAuth();
  
  return (
    <header className="border-b border-scrapvorn-gray/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav className="flex space-x-6">
              <Link to="/" className="text-scrapvorn-gray hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/funcionalidades" className="text-scrapvorn-gray hover:text-white transition-colors">
                Funcionalidades
              </Link>
              <Link to="/como-funciona" className="text-scrapvorn-gray hover:text-white transition-colors">
                Como Funciona
              </Link>
              <Link to="/precos" className="text-scrapvorn-gray hover:text-white transition-colors">
                Preços
              </Link>
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" className="text-scrapvorn-gray hover:text-white">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <UserAvatar />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" className="text-scrapvorn-gray hover:text-white">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black">
                  <Link to="/auth?tab=register">Começar Agora</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-scrapvorn-gray">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-scrapvorn-gray/20">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link to="/" className="text-lg font-medium">
                    Início
                  </Link>
                  <Link to="/funcionalidades" className="text-lg font-medium">
                    Funcionalidades
                  </Link>
                  <Link to="/como-funciona" className="text-lg font-medium">
                    Como Funciona
                  </Link>
                  <Link to="/precos" className="text-lg font-medium">
                    Preços
                  </Link>
                  
                  <div className="pt-6 border-t border-scrapvorn-gray/10 mt-6">
                    {user ? (
                      <>
                        <Button asChild className="w-full mb-4">
                          <Link to="/dashboard">Dashboard</Link>
                        </Button>
                        <div className="flex items-center space-x-4 mb-4">
                          <UserAvatar />
                          <div className="text-sm">
                            {user.email}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full mb-4 bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black">
                          <Link to="/auth?tab=register">Começar Agora</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/auth">Login</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
