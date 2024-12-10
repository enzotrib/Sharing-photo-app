// Este archivo debe estar en: src/app/hooks/useCarouselSettings.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'carousel_settings';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

export const useCarouselSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener configuración del localStorage
  const getLocalSettings = () => {
    if (typeof window === 'undefined') return null;
    
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Verificar si el cache es válido (menos de 5 minutos)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return null;
  };

  // Función para guardar en localStorage
  const saveLocalSettings = (data) => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  };

  // Función para obtener configuración de Supabase
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Intentar obtener del cache primero
      const cachedSettings = getLocalSettings();
      if (cachedSettings) {
        setSettings(cachedSettings);
        setLoading(false);
        // Actualizar en segundo plano
        fetchFromSupabase();
        return;
      }

      await fetchFromSupabase();

    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  // Función específica para obtener datos de Supabase
  const fetchFromSupabase = async () => {
    const { data, error } = await supabase
      .from('carousel_settings')
      .select('*')
      .single();

    if (error) throw error;
    
    setSettings(data);
    saveLocalSettings(data);
  };

 
  const saveSettings = async (newSettings) => {
    try {
      const { error } = await supabase
        .from('carousel_settings')
        .upsert(newSettings);

      if (error) throw error;

      setSettings(newSettings);
      saveLocalSettings(newSettings);
      
      return true; // Indicar éxito
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  };

  // Inicializar configuración y suscripción a cambios
  useEffect(() => {
    fetchSettings();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('carousel-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'carousel_settings'
        },
        (payload) => {
          console.log('Settings changed:', payload);
          // Actualizar solo si los datos son diferentes
          if (JSON.stringify(payload.new) !== JSON.stringify(settings)) {
            setSettings(payload.new);
            saveLocalSettings(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    error,
    saveSettings,
    refreshSettings: fetchSettings
  };
};