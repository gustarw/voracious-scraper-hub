
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WebScraper } from "@/components/WebScraper";

const Scraping = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Extração de Dados</h1>
        <p className="text-scrapvorn-gray">
          Extraia dados de qualquer site com facilidade usando nossa ferramenta de web scraping.
        </p>
      </div>
      
      <WebScraper />
    </DashboardLayout>
  );
};

export default Scraping;
