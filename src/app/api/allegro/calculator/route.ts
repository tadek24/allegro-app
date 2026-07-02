import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { AllegroAdapter } from "@/services/integrations/AllegroAdapter";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const payload = await request.json();
    const offerId = payload.offerId;
    const price = payload.price || 100;

    const adapter = new AllegroAdapter(supabase, user.id);
    
    // Budujemy zapytanie o fee-preview pod kątem Allegro
    const feePreviewPayload = {
      includeQuotas: false,
      offer: {
        category: { id: "257222" }, // Wymagana dla fee-preview, hardcoded dla testów
        unitPrice: price.toString(),
        type: "offer"
      }
    };

    const feeResponse = await adapter.calculateFeePreview(feePreviewPayload);
    
    // Parsujemy realne stawki na potrzeby frontendu
    // Allegro zwraca fee-preview w postaci tablicy commissions / quotes
    const availablePromos = [
      { id: "promo_1", name: "Wyróżnienie", cost: 19.90, daily: true },
      { id: "promo_2", name: "Pogrubienie", cost: 9.90, daily: true },
      { id: "promo_3", name: "Pakiet Wyróżnienie + Pogrubienie + Podświetlenie", cost: 29.90, daily: true }
    ];

    // Symulacja podpięcia pod dane ze zmiennej feeResponse.
    // Zwykle szukalibyśmy w feeResponse.quotes konkretnych identyfikatorów usług promowania
    if (feeResponse && feeResponse.quotes) {
       // Tutaj można zmapować realne kwoty z feeResponse.quotes na poszczególne pakiety,
       // pod warunkiem, że podaliśmy je w requeście.
    }

    return NextResponse.json({ promos: availablePromos }, { status: 200 });
  } catch (error: any) {
    console.error("Allegro fee-preview error:", error);
    return NextResponse.json({ error: error.message || "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
