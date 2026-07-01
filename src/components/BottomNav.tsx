import Link from "next/link";
import { Home, TrendingUp, BarChart, MessageCircle } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_15px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16 px-2">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-violet active:text-brand-violet transition-colors">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Aukcje</span>
        </Link>
        <Link href="/analysis" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-violet active:text-brand-violet transition-colors">
          <TrendingUp className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Analiza</span>
        </Link>
        <Link href="/ads" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-violet active:text-brand-violet transition-colors">
          <BarChart className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Ads</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-violet active:text-brand-violet transition-colors">
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Wiadomości</span>
        </Link>
      </div>
    </nav>
  );
}
