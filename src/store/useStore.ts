import { create } from 'zustand';

export interface PromoOption {
  id: string;
  name: string;
  cost: number;
}

export interface Auction {
  id: string;
  title: string;
  price: number;
  stock: number;
  thumbnailUrl: string;
  // Pola rozszerzone (tylko w UI)
  netPurchasePrice: number;
  activePromos: string[];
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
  budget: number;
  spent: number;
  roi: number;
  active: boolean;
}

interface AppState {
  // Aukcje
  auctions: Auction[];
  setAuctions: (auctions: Auction[]) => void;
  updateAuctionPrice: (id: string, newPrice: number) => void;
  updatePurchasePrice: (id: string, newPrice: number) => void;
  togglePromo: (auctionId: string, promoId: string) => void;
  availablePromos: PromoOption[];
  
  // Integracja
  isIntegrated: boolean;
  setIntegrated: (val: boolean) => void;
  
  // Wiadomości
  threads: MessageThread[];
  setThreads: (threads: MessageThread[]) => void;
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

export const useStore = create<AppState>((set) => ({
  // Integracja
  isIntegrated: false,
  setIntegrated: (val) => set({ isIntegrated: val }),

  // Aukcje - inicjalizacja jako pusta tablica
  auctions: [],
  setAuctions: (apiAuctions) => set({ 
    auctions: apiAuctions.map(a => ({
      ...a,
      netPurchasePrice: a.netPurchasePrice || 0,
      activePromos: a.activePromos || []
    }))
  }),
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
  threads: [],
  setThreads: (apiThreads) => set({ threads: apiThreads }),
  autoresponderEnabled: false,
  autoresponderMessage: 'Dziękujemy za wiadomość. Odpowiemy w godzinach 8-16.',
  toggleAutoresponder: () => set((state) => ({ autoresponderEnabled: !state.autoresponderEnabled })),
  setAutoresponderMessage: (msg) => set({ autoresponderMessage: msg }),

  // Kampanie
  campaigns: [],
  toggleCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(c => c.id === id ? { ...c, active: !c.active } : c)
  }))
}));
