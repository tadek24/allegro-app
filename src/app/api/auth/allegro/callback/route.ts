import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Brak kodu autoryzacyjnego' }, { status: 400 });
  }

  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  const redirectUri = 'https://allegro-app.vercel.app/api/auth/allegro/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Błąd konfiguracji kluczy Allegro' }, { status: 500 });
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://allegro.pl/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Allegro token error:', errorText);
      return NextResponse.json({ error: 'Błąd wymiany tokenu w Allegro API' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('allegro_integrations')
        .upsert({ 
          user_id: user.id, 
          access_token: tokenData.access_token, 
          refresh_token: tokenData.refresh_token 
        });
    }

    return NextResponse.redirect(new URL('/dashboard?integration=success', request.url));
  } catch (err: any) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
