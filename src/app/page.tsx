import data from "../../data/mockData.json";
import ProductCard from "@/components/ProductCard";
import { Filter, ArrowUpDown } from "lucide-react";

export default function Dashboard() {
  const { auctions } = data;

  return (
    <div className="p-4">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Moje Aukcje</h1>
        <p className="text-sm text-gray-500">Zarządzaj swoimi ofertami</p>
      </header>

      {/* Toolbar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Szukaj aukcji..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 dark:text-gray-100"
          />
        </div>
        <button className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-2 text-gray-500 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
        <button className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-2 text-gray-500 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
          <ArrowUpDown className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {auctions.map((auction) => (
          <ProductCard
            key={auction.id}
            id={auction.id}
            title={auction.title}
            price={auction.price}
            stock={auction.stock}
            sold={auction.sold}
            thumbnailUrl={auction.thumbnailUrl}
          />
        ))}
      </div>
    </div>
  );
}
