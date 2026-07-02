import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
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
    
    // Wymiana code na tokeny w Allegro
    const tokenResponse = await fetch(`https://allegro.pl/auth/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Allegro token error:', errorText);
      return NextResponse.json({ error: 'Błąd wymiany tokenu w Allegro API' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Zapis tokenów w bazie dla obecnie zalogowanego użytkownika
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error: dbError } = await supabase
        .from('allegro_integrations')
        .upsert({ 
          user_id: user.id, 
          access_token: accessToken, 
          refresh_token: refreshToken 
        });

      if (dbError) {
        console.error('Database error saving tokens:', dbError);
      }
    }

    // Niezależnie od wyniku bazy, wracamy do dashboard
    const url = request.url;
    const redirectUrl = new URL('/dashboard', url);
    redirectUrl.searchParams.set('integration', 'success');

    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
