
import { 
  Filter, Clock, FileSpreadsheet, Globe, Webhook, Database, 
  PanelLeft, Key, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Features() {
  const features = [
    {
      icon: Database,
      title: "Advanced Scraping",
      description: "Configure targets, selectors, and data types with our intuitive editor."
    },
    {
      icon: Filter,
      title: "Intelligent Filters",
      description: "Apply complex filters and transformations to extract only the data you need."
    },
    {
      icon: Clock,
      title: "Scheduled Extraction",
      description: "Automate your data collection with precise scheduling options."
    },
    {
      icon: FileSpreadsheet,
      title: "Flexible Exports",
      description: "Export your data in CSV, JSON, Excel, or directly to your tools."
    },
    {
      icon: PanelLeft,
      title: "Project Management",
      description: "Organize your scraping tasks into projects with unique IDs and metadata."
    },
    {
      icon: Webhook,
      title: "Webhook Notifications",
      description: "Receive instant notifications when your data is ready or errors occur."
    },
    {
      icon: Key,
      title: "API Integration",
      description: "Connect with third-party tools using our comprehensive API."
    },
    {
      icon: Shield,
      title: "Proxy Support",
      description: "Use rotating proxies to prevent blocking and ensure reliable extraction."
    },
    {
      icon: Globe,
      title: "Multi-Source Support",
      description: "Extract data from websites, social media, forums, and more."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-black/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-white font-bold mb-6 leading-tight">
            Everything You Need For <span className="text-gradient">Professional Data Extraction</span>
          </h2>
          <p className="text-scrapvorn-gray text-xl">
            Scrapvorn combines powerful features with an intuitive interface, making web scraping accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-scrapvorn-gray/10 bg-white/5 backdrop-blur-sm hover:border-scrapvorn-orange/30 transition-all duration-300 group",
        "hover:translate-y-[-5px] hover:shadow-lg hover:shadow-scrapvorn-orange/5",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <div className="w-12 h-12 rounded-lg bg-scrapvorn-orange/10 flex items-center justify-center mb-4 group-hover:bg-scrapvorn-orange/20 transition-colors">
        <Icon className="h-6 w-6 text-scrapvorn-orange" />
      </div>
      <h3 className="font-medium text-xl text-white mb-2">{title}</h3>
      <p className="text-scrapvorn-gray">{description}</p>
    </div>
  );
}
