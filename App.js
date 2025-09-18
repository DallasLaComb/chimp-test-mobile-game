import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import Auth from './src/components/Auth';
import GameMenu from './src/components/GameMenu';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session ? <GameMenu session={session} /> : <Auth />;
}