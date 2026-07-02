"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import ProductCard from "@/components/ProductCard";
import { Filter, ArrowUpDown, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
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

const SkeletonLoader = () => (
  <div className="bg-white rounded-none shadow-none border border-gray-100 p-5 flex flex-col h-full animate-pulse">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-none shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
      </div>
    </div>
    <div className="mt-auto pt-4 space-y-3">
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const auctions = useStore(state => state.auctions);
  const setAuctions = useStore(state => state.setAuctions);
  const isIntegrated = useStore(state => state.isIntegrated);
  const setIntegrated = useStore(state => state.setIntegrated);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isIntegrated) return;
    
    let isMounted = true;

    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await fetch('/api/allegro/offers');
        
        if (!res.ok) {
          if (res.status === 401) {
            if (isMounted) setIntegrated(false);
            return;
          }
          throw new Error('Błąd podczas pobierania ofert');
        }
        
        const data = await res.json();
        if (isMounted) setAuctions(data.auctions || []);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOffers();

    return () => {
      isMounted = false;
    };
  }, [isIntegrated, setAuctions, setIntegrated]);

  if (!isIntegrated) {
    return (
      <>
        <Suspense fallback={null}><IntegrationCheck /></Suspense>
        <div className="p-6 md:p-12 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-4xl bg-white rounded-none p-10 md:p-16 shadow-md border border-gray-100 text-center relative overflow-hidden">
            <div className="mx-auto bg-brand-orange/10 text-brand-orange w-24 h-24 flex items-center justify-center rounded-none mb-8">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#222222] mb-6 tracking-tight leading-tight">
              Twój biznes gotowy <br className="hidden md:block" /> na ekspansję
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
              Zintegruj swoje konto Allegro jednym kliknięciem i zyskaj dostęp do pełnego ekosystemu analitycznego oraz zarządzania.
            </p>
            <Link 
              href="/api/auth/allegro/login"
              className="inline-flex items-center gap-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg py-4 px-10 rounded-none transition-all shadow-none hover:shadow-none"
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
      <div className="p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <header className="mb-10 mt-4 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">Kalkulator Zysków</h1>
            <p className="text-base text-gray-500 font-medium mt-1">Zarządzaj swoimi ofertami i marżą wprost z Allegro</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white rounded-none shadow-none border border-gray-200 p-3 text-gray-500 hover:text-brand-orange hover:border-brand-orange transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <button className="bg-white rounded-none shadow-none border border-gray-200 p-3 text-gray-500 hover:text-brand-orange hover:border-brand-orange transition-all">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-none flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : auctions.length === 0 && !error ? (
          <div className="text-center py-20 bg-white rounded-none border border-gray-100 shadow-none">
            <p className="text-gray-500 font-medium text-lg">Brak ofert do wyświetlenia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <ProductCard
                key={auction.id}
                id={auction.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
