// src/app/utils/supabaseClient.jsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
});

// Helper para verificar el estado de la conexión
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('carousel_settings')
      .select('count', { count: 'exact' })
      .limit(1);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Helper para manejar errores comunes
export const handleSupabaseError = (error) => {
  if (!error) return null;

  console.error('Supabase error:', error);

  // Manejar error 406
  if (error.status === 406) {
    console.warn('Headers acceptance issue - retrying with different content type');
    return 'Error de compatibilidad - reintentando';
  }

  return error.message || 'Error en la operación';
};

export { supabase };