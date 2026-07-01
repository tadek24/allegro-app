"use client";

import { useStore } from "@/store/useStore";
import { MessageSquare, AlertTriangle, Send } from "lucide-react";

export default function MessagesPage() {
  const threads = useStore(state => state.threads);
  const autoresponderEnabled = useStore(state => state.autoresponderEnabled);
  const autoresponderMessage = useStore(state => state.autoresponderMessage);
  const toggleAutoresponder = useStore(state => state.toggleAutoresponder);
  const setAutoresponderMessage = useStore(state => state.setAutoresponderMessage);

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wiadomości</h1>
        <p className="text-sm text-gray-500">Komunikacja z kupującymi</p>
      </header>

      {/* Autoresponder Settings */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 mb-6 shadow-sm border border-white/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-violet" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Autoresponder</h3>
          </div>
          {/* Toggle switch */}
          <button 
            onClick={toggleAutoresponder}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 ${
              autoresponderEnabled ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-gray-700'
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
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Treść automatycznej odpowiedzi:</label>
            <textarea 
              value={autoresponderMessage}
              onChange={(e) => setAutoresponderMessage(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-violet outline-none resize-none h-24 text-gray-800 dark:text-gray-200"
            />
            <p className="text-[10px] text-gray-500 mt-2">Wiadomość zostanie wysłana automatycznie do nowych klientów.</p>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-1">Ostatnie wątki</h3>
      
      <div className="space-y-3 pb-8">
        {threads.map((thread) => (
          <div 
            key={thread.id} 
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm border ${
              thread.isDifficult ? 'border-red-200 dark:border-red-900/50' : 'border-white/50 dark:border-gray-700/50'
            } flex flex-col gap-2 relative`}
          >
            {thread.unread && (
              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-violet rounded-full"></div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{thread.buyer}</span>
              {thread.isDifficult && (
                <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Trudny Klient
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 pr-4">{thread.lastMessage}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-[10px] text-gray-400">12:30, Dzisiaj</span>
              <button className="text-brand-violet hover:bg-brand-violet/10 p-1.5 rounded-full transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
