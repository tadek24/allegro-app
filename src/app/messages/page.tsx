"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { MessageSquare, AlertTriangle, Send, AlertCircle } from "lucide-react";

const SkeletonLoader = () => (
  <div className="bg-white rounded-none p-4 shadow-none border border-gray-100 flex flex-col gap-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
    <div className="mt-2 flex justify-between items-center">
      <div className="h-2 bg-gray-200 rounded w-16"></div>
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default function MessagesPage() {
  const threads = useStore(state => state.threads);
  const setThreads = useStore(state => state.setThreads);
  const autoresponderEnabled = useStore(state => state.autoresponderEnabled);
  const autoresponderMessage = useStore(state => state.autoresponderMessage);
  const toggleAutoresponder = useStore(state => state.toggleAutoresponder);
  const setAutoresponderMessage = useStore(state => state.setAutoresponderMessage);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMessages() {
      try {
        setLoading(true);
        const res = await fetch('/api/allegro/messages');
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Brak integracji z Allegro. Przejdź do Dashboardu, aby się zalogować.');
          }
          throw new Error('Błąd pobierania wiadomości');
        }
        const data = await res.json();
        if (isMounted) {
          setThreads(data.threads || []);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMessages();
    return () => { isMounted = false; };
  }, [setThreads]);

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#222222]">Wiadomości</h1>
        <p className="text-sm text-gray-500 font-medium">Komunikacja z kupującymi na Allegro</p>
      </header>

      {/* Autoresponder Settings */}
      <div className="bg-white rounded-none p-5 mb-6 shadow-none border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-orange" />
            <h3 className="font-semibold text-[#222222]">Autoresponder</h3>
          </div>
          {/* Toggle switch */}
          <button 
            onClick={toggleAutoresponder}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 ${
              autoresponderEnabled ? 'bg-brand-orange' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={autoresponderEnabled}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoresponderEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
        
        {autoresponderEnabled && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-700 block mb-2">Treść automatycznej odpowiedzi:</label>
            <textarea 
              value={autoresponderMessage}
              onChange={(e) => setAutoresponderMessage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none resize-none h-24 text-[#222222]"
            />
            <p className="text-[10px] text-gray-500 mt-2 font-medium">Wiadomość zostanie wysłana automatycznie do nowych klientów.</p>
          </div>
        )}
      </div>

      <h3 className="font-bold text-[#222222] mb-4 px-1">Ostatnie wątki</h3>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-none flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-3 pb-8">
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : threads.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-none border border-gray-100 shadow-none">
            <p className="text-gray-500 font-medium text-sm">Brak wiadomości do wyświetlenia.</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div 
              key={thread.id} 
              className={`bg-white rounded-none p-4 shadow-none border ${
                thread.isDifficult ? 'border-red-200' : 'border-gray-100'
              } flex flex-col gap-2 relative transition-all hover:shadow-none`}
            >
              {thread.unread && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-orange rounded-full"></div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#222222]">{thread.buyer}</span>
                {thread.isDifficult && (
                  <div className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-100">
                    <AlertTriangle className="w-3 h-3" />
                    Trudny Klient
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 pr-4">{thread.lastMessage}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-medium">Teraz, Dzisiaj</span>
                <button className="text-brand-orange hover:bg-orange-50 p-1.5 rounded-full transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
