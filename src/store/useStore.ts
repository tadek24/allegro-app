import { create } from 'zustand';
import initialData from '../../data/mockData.json';

export interface Auction {
  id: string;
  title: string;
  price: number; // Cena sprzedaży
  stock: number;
  sold: number;
  thumbnailUrl: string;
  netPurchasePrice: number; // Cena zakupu netto
  activePromos: string[]; // Identyfikatory włączonych promowań
}

export interface PromoOption {
  id: string;
  name: string;
  cost: number;
}

export interface MessageThread {
  id: string;
  buyer: string;
  lastMessage: string;
  unread: boolean;
  isDifficult: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  active: boolean;
  dailyBudget: number;
  spend: number;
}

interface AppState {
  // Aukcje
  auctions: Auction[];
  updateAuctionPrice: (id: string, newPrice: number) => void;
  updatePurchasePrice: (id: string, newPrice: number) => void;
  togglePromo: (auctionId: string, promoId: string) => void;
  availablePromos: PromoOption[];
  
  // Integracja
  isIntegrated: boolean;
  setIntegrated: (val: boolean) => void;
  
  // Wiadomości
  threads: MessageThread[];
  autoresponderEnabled: boolean;
  autoresponderMessage: string;
  toggleAutoresponder: () => void;
  setAutoresponderMessage: (msg: string) => void;

  // Kampanie
  campaigns: Campaign[];
  toggleCampaign: (id: string) => void;
}

const defaultPromos: PromoOption[] = [
  { id: 'promo1', name: 'Wyróżnienie', cost: 19.90 },
  { id: 'promo2', name: 'Podświetlenie', cost: 9.90 },
  { id: 'promo3', name: 'Pogrubienie', cost: 4.90 }
];

const mockThreads: MessageThread[] = [
  { id: 't1', buyer: 'JanKowalski', lastMessage: 'Kiedy wyślecie paczkę?', unread: true, isDifficult: false },
  { id: 't2', buyer: 'MarekNowak_88', lastMessage: 'Zwracam to badziewie, oszuści!!1', unread: true, isDifficult: true },
  { id: 't3', buyer: 'Anna_Sklep', lastMessage: 'Czy wystawiacie FVAT?', unread: false, isDifficult: false }
];

export const useStore = create<AppState>((set) => ({
  // Integracja
  isIntegrated: false,
  setIntegrated: (val) => set({ isIntegrated: val }),

  // Aukcje - inicjalizacja z mockData.json + domyślne rozszerzone pola
  auctions: initialData.auctions.map(a => ({
    ...a,
    netPurchasePrice: a.price * 0.6, // Zakładamy domyślny zakup za 60% ceny
    activePromos: []
  })),
  availablePromos: defaultPromos,
  updateAuctionPrice: (id, newPrice) => set((state) => ({
    auctions: state.auctions.map(a => a.id === id ? { ...a, price: newPrice } : a)
  })),
  updatePurchasePrice: (id, newPrice) => set((state) => ({
    auctions: state.auctions.map(a => a.id === id ? { ...a, netPurchasePrice: newPrice } : a)
  })),
  togglePromo: (auctionId, promoId) => set((state) => ({
    auctions: state.auctions.map(a => {
      if (a.id !== auctionId) return a;
      const isActive = a.activePromos.includes(promoId);
      return {
        ...a,
        activePromos: isActive 
          ? a.activePromos.filter(p => p !== promoId) 
          : [...a.activePromos, promoId]
      };
    })
  })),

  // Wiadomości
  threads: mockThreads,
  autoresponderEnabled: false,
  autoresponderMessage: 'Dziękujemy za wiadomość. Odpowiemy w godzinach 8-16.',
  toggleAutoresponder: () => set((state) => ({ autoresponderEnabled: !state.autoresponderEnabled })),
  setAutoresponderMessage: (msg) => set({ autoresponderMessage: msg }),

  // Kampanie
  campaigns: initialData.campaigns,
  toggleCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(c => c.id === id ? { ...c, active: !c.active } : c)
  }))
}));
