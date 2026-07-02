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

    const offerData = await request.json();

    if (!offerData || !offerData.name) {
      return NextResponse.json({ error: "Nieprawidłowe dane oferty" }, { status: 400 });
    }

    const adapter = new AllegroAdapter(supabase, user.id);
    
    // Wysłanie draftu do API Allegro
    const response = await adapter.createOfferDraft(offerData);

    // Zapis szkicu we własnej globalnej bazie PIM (opcjonalnie)
    const { error: dbError } = await supabase
      .from('global_products')
      .insert({
        user_id: user.id,
        sku: response.id || `DRAFT-${Date.now()}`,
        title: offerData.name,
        price: parseFloat(offerData.sellingMode.price.amount),
        currency: offerData.sellingMode.price.currency,
        stock: offerData.stock.available,
        platform_source: 'allegro',
        external_product_id: response.id
      });

    if (dbError) {
      console.error("PIM DB Save error:", dbError);
      // Nie przerywamy, bo do Allegro poszło
    }

    return NextResponse.json({ success: true, allegroId: response.id }, { status: 200 });
  } catch (error: any) {
    console.error("Allegro offer create error:", error);
    return NextResponse.json({ error: error.message || "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
