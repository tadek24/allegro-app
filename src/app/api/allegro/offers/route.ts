import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import mockData from '../../../../../data/mockData.json';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Sprawdzamy integrację klienta
  const { data: integration } = await supabase
    .from('allegro_integrations')
    .select('access_token')
    .eq('user_id', user.id)
    .single();

  // W prawdziwym środowisku bez integracji zwracamy 403 lub odpowiedni komunikat
  // W naszym demo, by zawsze coś pokazać, symulujemy działanie pobrania ofert.
  
  /*
  const response = await fetch('https://api.allegro.pl/sale/offers', {
    headers: {
      'Authorization': `Bearer ${integration?.access_token}`,
      'Accept': 'application/vnd.allegro.public.v1+json'
    }
  });
  const offers = await response.json();
  */

  return NextResponse.json({ offers: mockData.auctions, integrated: !!integration });
}
