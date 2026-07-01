"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import ProductCard from "@/components/ProductCard";
import { Filter, ArrowUpDown, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

function IntegrationCheck() {
  const searchParams = useSearchParams();
  const setIntegrated = useStore(state => state.setIntegrated);

  useEffect(() => {
    if (searchParams.get("integration") === "success") {
      setIntegrated(true);
    }
  }, [searchParams, setIntegrated]);

  return null;
}

export default function DashboardPage() {
  const auctions = useStore(state => state.auctions);
  const isIntegrated = useStore(state => state.isIntegrated);

  if (!isIntegrated) {
    return (
      <>
        <Suspense fallback={null}><IntegrationCheck /></Suspense>
        <div className="p-6 md:p-12 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-brand-violet/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="mx-auto bg-brand-violet/10 text-brand-violet w-24 h-24 flex items-center justify-center rounded-[2rem] mb-8 rotate-3 shadow-lg shadow-brand-violet/20 border border-brand-violet/20">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Twój biznes gotowy <br className="hidden md:block" /> na ekspansję
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Zintegruj swoje konto Allegro jednym kliknięciem i zyskaj dostęp do pełnego ekosystemu analitycznego oraz zaawansowanych kalkulatorów zysku.
          </p>
          <Link 
            href="/api/auth/allegro/login"
            className="inline-flex items-center gap-3 bg-brand-violet hover:bg-violet-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:-translate-y-1"
          >
            Zintegruj Konto Allegro <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Suspense fallback={null}><IntegrationCheck /></Suspense>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <header className="mb-10 mt-4 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Kalkulator Zysków</h1>
          <p className="text-base text-gray-500 font-medium mt-1">Zarządzaj swoimi ofertami i marżą edge-to-edge</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50 p-3 text-gray-500 hover:text-brand-violet hover:shadow-md transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50 p-3 text-gray-500 hover:text-brand-violet hover:shadow-md transition-all">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <ProductCard
            key={auction.id}
            id={auction.id}
          />
        ))}
      </div>
    </div>
    </>
  );
}
