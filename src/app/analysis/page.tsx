import data from "../../../data/mockData.json";
import CompetitorRow from "@/components/CompetitorRow";
import { Search, Lightbulb } from "lucide-react";

export default function AnalysisPage() {
  const { competitors } = data;
  
  // Find the lowest price
  const lowestPrice = Math.min(...competitors.map(c => c.price));
  const suggestedPrice = lowestPrice * 0.99; // 1% lower

  return (
    <div className="p-4">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analiza Konkurencji</h1>
        <p className="text-sm text-gray-500">Sprawdź ceny na rynku</p>
      </header>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Wpisz EAN lub nazwę produktu" 
          className="bg-transparent border-none outline-none w-full text-sm py-2 text-gray-900 dark:text-gray-100"
          defaultValue="Smartfon Samsung Galaxy S23"
        />
        <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium active:bg-blue-600 transition-colors">
          Szukaj
        </button>
      </div>

      {/* Suggestion Card */}
      <div className="bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 border border-brand-blue/20 rounded-xl p-4 mb-6 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="bg-brand-blue/20 p-2 rounded-full text-brand-blue">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Sugerowana cena</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ustaw cenę na <span className="font-bold text-brand-blue">{suggestedPrice.toFixed(2)} zł</span>, aby być tańszym o 1% od najtańszego konkurenta.</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-1">Oferty konkurencji</h3>
      
      <div className="space-y-3">
        {competitors.sort((a, b) => a.price - b.price).map((competitor) => (
          <CompetitorRow
            key={competitor.id}
            seller={competitor.seller}
            price={competitor.price}
            shipping={competitor.shipping}
            deliveryTime={competitor.deliveryTime}
            isLowest={competitor.price === lowestPrice}
          />
        ))}
      </div>
    </div>
  );
}
