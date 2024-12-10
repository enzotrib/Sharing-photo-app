"use client";
import React, { useState } from 'react';
import { useCarouselSettings } from '@/app/hooks/useCarouselSettings ';
import { Slider } from "@/app/components/ui/slider";
import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { FaBolt, FaSmile, FaHandSparkles, FaClock, FaImages, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CarouselSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { settings, loading, saveSettings } = useCarouselSettings();

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    saveSettings(newSettings);
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await saveSettings(settings);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 py-4 sm:py-6">
      {/* Duración de cada foto */}
      <div className="space-y-4 sm:space-y-6 bg-gray-800/20 p-4 sm:p-6 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaClock className="text-purple-400 text-base sm:text-lg" />
            <span className="text-gray-200 font-medium text-sm sm:text-base">Duración de cada foto</span>
          </div>
          <span className="text-purple-400 font-medium bg-purple-400/10 px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
            {settings.slide_interval / 1000}s
          </span>
        </div>
        <div className="pl-6 sm:pl-9">
          <Slider
            value={[settings.slide_interval]}
            onValueChange={([value]) => handleSettingChange('slide_interval', value)}
            min={2000}
            max={10000}
            step={1000}
            className="w-full"
          />
        </div>
      </div>

      {/* Cantidad de fotos */}
      <div className="space-y-4 sm:space-y-6 bg-gray-800/20 p-4 sm:p-6 rounded-lg border border-gray-700/30">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <FaImages className="text-purple-400 text-base sm:text-lg" />
          <span className="text-gray-200 font-medium text-sm sm:text-base">Cantidad de fotos a mostrar</span>
        </div>
        <div className="pl-6 sm:pl-9">
          <Select 
            value={settings.photos_limit} 
            onValueChange={(value) => handleSettingChange('photos_limit', value)}
          >
            <SelectTrigger className="w-full bg-gray-800/40 border-gray-700/50 text-gray-200 text-sm sm:text-base">
              <SelectValue placeholder="Selecciona un límite" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-200 hover:bg-gray-700 text-sm sm:text-base">
                Todas las fotos
              </SelectItem>
              <SelectItem value="10" className="text-gray-200 hover:bg-gray-700 text-sm sm:text-base">
                Últimas 10 fotos
              </SelectItem>
              <SelectItem value="20" className="text-gray-200 hover:bg-gray-700 text-sm sm:text-base">
                Últimas 20 fotos
              </SelectItem>
              <SelectItem value="30" className="text-gray-200 hover:bg-gray-700 text-sm sm:text-base">
                Últimas 30 fotos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Efecto Flash */}
      <div className="space-y-6 bg-gray-800/20 p-6 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBolt className="text-purple-400 text-lg" />
            <span className="text-gray-200 font-medium">Efecto Flash</span>
          </div>
          <Switch
            checked={settings.flash_enabled}
            onCheckedChange={(checked) => handleSettingChange('flash_enabled', checked)}
          />
        </div>
        {settings.flash_enabled && (
          <div className="space-y-4 mt-4 pl-9">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Intervalo</span>
              <span className="text-purple-400 font-medium bg-purple-400/10 px-3 py-1 rounded-md">
                {settings.flash_interval / 1000}s
              </span>
            </div>
            <Slider
              value={[settings.flash_interval]}
              onValueChange={([value]) => handleSettingChange('flash_interval', value)}
              min={5000}
              max={30000}
              step={1000}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Emojis Flotantes */}
      <div className="space-y-6 bg-gray-800/20 p-6 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaSmile className="text-purple-400 text-lg" />
            <span className="text-gray-200 font-medium">Emojis Flotantes</span>
          </div>
          <Switch
            checked={settings.emojis_enabled}
            onCheckedChange={(checked) => handleSettingChange('emojis_enabled', checked)}
          />
        </div>
        {settings.emojis_enabled && (
          <div className="space-y-6 mt-4 pl-9">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Intervalo</span>
                <span className="text-purple-400 font-medium bg-purple-400/10 px-3 py-1 rounded-md">
                  {settings.emoji_interval / 1000}s
                </span>
              </div>
              <Slider
                value={[settings.emoji_interval]}
                onValueChange={([value]) => handleSettingChange('emoji_interval', value)}
                min={500}
                max={5000}
                step={500}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-gray-400">Emojis a utilizar</label>
              <input
                type="text"
                value={settings.selected_emojis}
                onChange={(e) => handleSettingChange('selected_emojis', e.target.value)}
                className="w-full p-3 bg-gray-800/40 rounded-lg border border-gray-700/50 
                  text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                  focus:border-transparent"
                placeholder="Separar emojis con comas"
              />
              <p className="text-xs text-gray-500">Separa los emojis con comas</p>
            </div>
          </div>
        )}
      </div>

      {/* Efecto Confetti */}
      <div className="space-y-6 bg-gray-800/20 p-6 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaHandSparkles className="text-purple-400 text-lg" />
            <span className="text-gray-200 font-medium">Efecto Confetti</span>
          </div>
          <Switch
            checked={settings.confetti_enabled}
            onCheckedChange={(checked) => handleSettingChange('confetti_enabled', checked)}
          />
        </div>
        {settings.confetti_enabled && (
          <div className="space-y-4 mt-4 pl-9">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Intervalo</span>
              <span className="text-purple-400 font-medium bg-purple-400/10 px-3 py-1 rounded-md">
                {settings.confetti_interval / 1000}s
              </span>
            </div>
            <Slider
              value={[settings.confetti_interval]}
              onValueChange={([value]) => handleSettingChange('confetti_interval', value)}
              min={10000}
              max={60000}
              step={5000}
              className="w-full"
            />
          </div>
        )}
      </div>
      <button
        onClick={handleSaveAll}
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg 
          transition-all duration-200 flex items-center justify-center gap-2 shadow-lg 
          hover:shadow-purple-600/25 active:scale-95 border border-purple-500/20
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <FaSave />
            <span>Guardar configuración</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CarouselSettings;