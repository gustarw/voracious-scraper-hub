
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 border-t border-scrapvorn-gray/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-scrapvorn-gray max-w-xs">
              Powerful web scraping platform for professionals and businesses seeking precise data extraction.
            </p>
          </div>
          
          <FooterColumn
            title="Product"
            links={[
              { name: "Features", path: "#features" },
              { name: "How It Works", path: "#how-it-works" },
              { name: "Pricing", path: "#pricing" },
              { name: "FAQ", path: "#faq" },
            ]}
          />
          
          <FooterColumn
            title="Resources"
            links={[
              { name: "Documentation", path: "#" },
              { name: "API Reference", path: "#" },
              { name: "Blog", path: "#" },
              { name: "Community", path: "#" },
            ]}
          />
          
          <FooterColumn
            title="Company"
            links={[
              { name: "About", path: "#about" },
              { name: "Terms of Service", path: "#" },
              { name: "Privacy Policy", path: "#" },
              { name: "Contact", path: "#" },
            ]}
          />
        </div>
        
        <div className="mt-16 pt-8 border-t border-scrapvorn-gray/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-scrapvorn-gray text-sm">
            &copy; {currentYear} Scrapvorn. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-scrapvorn-gray hover:text-scrapvorn-orange transition-colors">
              Twitter
            </a>
            <a href="#" className="text-scrapvorn-gray hover:text-scrapvorn-orange transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-scrapvorn-gray hover:text-scrapvorn-orange transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: Array<{ name: string; path: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.path}
              className="text-scrapvorn-gray hover:text-scrapvorn-orange transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
