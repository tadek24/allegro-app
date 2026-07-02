import { SupabaseClient } from "@supabase/supabase-js";
import { getValidAllegroToken } from "@/utils/allegroAuth";

export class AllegroAdapter {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await getValidAllegroToken(this.supabase, this.userId);
    if (!token) throw new Error("Brak aktywnego połączenia z Allegro. Token wygasł lub nie istnieje.");

    const url = `https://api.allegro.pl${endpoint}`;
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.allegro.public.v1+json',
      'Content-Type': 'application/vnd.allegro.public.v1+json'
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AllegroAdapter API Error (${endpoint}):`, errorText);
      throw new Error(`Błąd API Allegro: ${response.status}`);
    }

    return response.json();
  }

  // OMS: Pobieranie zamówień (checkout-forms)
  async getCheckoutForms() {
    return this.fetchWithAuth('/order/checkout-forms');
  }

  // Wiadomości: Pobieranie wątków konwersacji
  async getMessagingThreads() {
    return this.fetchWithAuth('/messaging/threads');
  }

  // PIM: Tworzenie oferty (Szkic - Draft)
  async createOfferDraft(offerData: any) {
    return this.fetchWithAuth('/sale/offers', {
      method: 'POST',
      body: JSON.stringify(offerData)
    });
  }

  // Kalkulator: Dynamiczne pobieranie kosztów promocji i opłat
  // Endpoint testowy/kalkulatora opłat pod dany produkt
  async calculateFeePreview(previewData: any) {
    return this.fetchWithAuth('/pricing/fee-preview', {
      method: 'POST',
      body: JSON.stringify(previewData)
    });
  }
}
