import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // W normalnych warunkach generujemy URL korzystając z logiki środowiskowej
  const clientId = process.env.ALLEGRO_CLIENT_ID || 'mock_client_id';
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/allegro/callback`;
  
  // URL autoryzacyjny Allegro
  const allegroAuthUrl = `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(allegroAuthUrl);
}
