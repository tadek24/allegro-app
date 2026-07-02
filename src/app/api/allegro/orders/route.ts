import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { AllegroAdapter } from "@/services/integrations/AllegroAdapter";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const adapter = new AllegroAdapter(supabase, user.id);
    const checkoutForms = await adapter.getCheckoutForms();

    // Przekształcamy dane z Allegro na format GlobalOrder
    const newOrders = checkoutForms.checkoutForms.map((form: any) => ({
      user_id: user.id,
      platform_source: 'allegro',
      external_order_id: form.id,
      buyer_name: form.buyer.login || form.buyer.id,
      buyer_email: form.buyer.email,
      total_amount: parseFloat(form.summary.totalToPay.amount),
      currency: form.summary.totalToPay.currency,
      payment_status: form.status === 'READY_FOR_PROCESSING' ? 'paid' : 'pending',
      shipping_method: form.delivery?.method?.name || 'Brak danych',
      delivery_address: form.delivery?.address || {},
      line_items: form.lineItems || []
    }));

    // Zapisujemy lub aktualizujemy w bazie używając onConflict
    if (newOrders.length > 0) {
      const { error: dbError } = await supabase
        .from('global_orders')
        .upsert(newOrders, { onConflict: 'user_id, platform_source, external_order_id' });

      if (dbError) {
        console.error("Błąd zapisu zamówień do bazy:", dbError);
      }
    }

    // Zwracamy posortowane najświeższe dane prosto z bazy
    const { data: globalOrders } = await supabase
      .from('global_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ orders: globalOrders || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Allegro orders error:", error);
    return NextResponse.json({ error: error.message || "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
