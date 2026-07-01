import { TrendingDown } from "lucide-react";

interface CompetitorRowProps {
  seller: string;
  price: number;
  shipping: number;
  deliveryTime: string;
  isLowest?: boolean;
}

export default function CompetitorRow({ seller, price, shipping, deliveryTime, isLowest }: CompetitorRowProps) {
  return (
    <div className={`p-4 rounded-xl border mb-3 flex items-center justify-between transition-colors ${
      isLowest 
        ? "border-brand-violet bg-violet-50/50 dark:bg-violet-900/20 dark:border-violet-700" 
        : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
    }`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{seller}</span>
          {isLowest && (
            <span className="bg-brand-violet text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Najtaniej
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1">Dostawa: {deliveryTime} (od {shipping.toFixed(2)} zł)</span>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-bold text-lg ${isLowest ? "text-brand-violet" : "text-gray-900 dark:text-gray-100"}`}>
          {price.toFixed(2)} zł
        </span>
      </div>
    </div>
  );
}
