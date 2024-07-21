import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  console.log({code});
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
   
    if (error) {
   
      console.error('Error exchanging code for session:', error);
    } else {
      console.log('Successfully exchanged code for session.');
      return NextResponse.redirect(`${origin}/`);
    }
  } else {
    console.error('Code is null. Redirecting to error page.');
  }

  return NextResponse.redirect(`$${origin}/auth/auth-code-error`);
}


