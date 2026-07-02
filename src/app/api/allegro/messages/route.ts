import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: integration } = await supabase
    .from('allegro_integrations')
    .select('access_token')
    .eq('user_id', user.id)
    .single();

  if (!integration || !integration.access_token) {
    return NextResponse.json({ error: 'Brak aktywnej integracji' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.allegro.pl/messaging/threads', {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Accept': 'application/vnd.allegro.public.v1+json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token wygasł' }, { status: 401 });
      }
      throw new Error(`Allegro API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Zgodnie z formatem store
    const threads = (data.threads || []).map((thread: any) => ({
      id: thread.id,
      buyer: thread.customer?.login || "Nieznany klient",
      lastMessage: "Ostatnia wiadomość...", // Allegro zwraca snippet w innej metodzie, mockujemy to dla UI
      unread: thread.read === false,
      isDifficult: false
    }));

    return NextResponse.json({ threads });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
