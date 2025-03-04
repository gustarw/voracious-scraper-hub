
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Define Your Target",
      description: "Specify the websites, pages, or data sources you want to extract data from.",
      features: [
        "Single URL or batch processing",
        "Deep crawling capabilities",
        "Domain or subdomain targeting",
        "Authentication support for protected content"
      ]
    },
    {
      number: "02",
      title: "Configure Extraction",
      description: "Use our intuitive editor to define what data to extract and how to process it.",
      features: [
        "Visual selector builder",
        "CSS and XPath support",
        "Data type detection",
        "Custom extraction rules"
      ]
    },
    {
      number: "03",
      title: "Apply Filters",
      description: "Refine your data with powerful filtering and transformation options.",
      features: [
        "Advanced pattern matching",
        "Conditional logic",
        "Regex support",
        "Data cleaning tools"
      ]
    },
    {
      number: "04",
      title: "Schedule & Execute",
      description: "Run your extraction tasks once or schedule them for regular updates.",
      features: [
        "One-time or recurring schedules",
        "Priority queue management",
        "Real-time monitoring",
        "Error handling and retries"
      ]
    },
    {
      number: "05",
      title: "Analyze & Export",
      description: "View your extracted data and export it in your preferred format.",
      features: [
        "Multiple export formats",
        "Direct API integrations",
        "Webhook notifications",
        "Data visualization tools"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-white font-bold mb-6 leading-tight">
            <span className="text-gradient">Simple & Powerful</span> Workflow
          </h2>
          <p className="text-scrapvorn-gray text-xl">
            Our streamlined process makes web scraping accessible without sacrificing power or flexibility.
          </p>
        </div>

        <div className="space-y-12 mt-20">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              features={step.features}
              isEven={index % 2 === 1}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  features: string[];
  isEven: boolean;
  index: number;
}

function StepCard({ number, title, description, features, isEven, index }: StepCardProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
        isEven && "md:flex-row-reverse",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className={cn(
        "bg-gradient-to-br from-white/10 to-transparent p-8 rounded-2xl border border-scrapvorn-gray/10",
        "hover:border-scrapvorn-orange/30 transition-all duration-300",
        "h-full flex flex-col justify-center"
      )}>
        <div className="text-scrapvorn-orange font-bold text-5xl mb-4 opacity-90">{number}</div>
        <h3 className="text-white text-2xl font-medium mb-3">{title}</h3>
        <p className="text-scrapvorn-gray mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-scrapvorn-orange/20 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-scrapvorn-orange" />
              </div>
              <span className="ml-3 text-scrapvorn-gray">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={cn(
        "bg-scrapvorn-deepGray/20 rounded-2xl h-64 md:h-full min-h-[320px]",
        "border border-scrapvorn-gray/10 overflow-hidden",
        isEven ? "md:order-first" : "md:order-last"
      )}>
        <div className="w-full h-full flex items-center justify-center text-scrapvorn-gray">
          {/* Placeholder for step illustration/screenshot */}
          <div className="text-center px-4">
            <div className="text-scrapvorn-orange text-sm font-medium mb-2">ILLUSTRATION</div>
            <div className="text-white font-medium">{title} Interface</div>
          </div>
        </div>
      </div>
    </div>
  );
}
