import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.ALLEGRO_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'Brak konfiguracji ALLEGRO_CLIENT_ID' }, { status: 500 });
  }

  const redirectUri = 'https://allegro-app.vercel.app/api/auth/allegro/callback';
  const allegroAuthUrl = `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(allegroAuthUrl);
}
