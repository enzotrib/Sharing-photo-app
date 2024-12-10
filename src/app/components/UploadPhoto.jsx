"use client";

import React, { useState, useCallback, useRef } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "../utils/supabaseClient";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import CameraIcon from "./CameraIcon";
import { motion, AnimatePresence } from "framer-motion";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

// Configuración de compresión de imagen optimizada para móviles
const compressionOptions = {
  maxSizeMB: 1, // Reducido para móviles
  maxWidthOrHeight: 1080,
  useWebWorker: true,
  initialQuality: 0.8, // Balance entre calidad y tamaño
  alwaysKeepResolution: false
};

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs para mejor manejo de memoria
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  // Optimización de la compresión y preview
  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile?.type.startsWith("image/")) {
      toast.error("Por favor, selecciona una imagen válida");
      return;
    }

    try {
      // Crear preview inmediato para mejor UX
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = URL.createObjectURL(selectedFile);
      setPreview(previewUrlRef.current);

      // Comprimir en segundo plano
      const compressedFile = await imageCompression(selectedFile, compressionOptions);
      setFile(compressedFile);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Error al procesar la imagen");
      handleRemovePhoto();
    }
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Optimización de la subida
  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error("Selecciona una foto antes de compartir");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;

    try {
      // Subida paralela a storage y base de datos
      const [uploadResult, publicUrlResult] = await Promise.all([
        supabase.storage.from("photos").upload(fileName, file),
        supabase.storage.from("photos").getPublicUrl(fileName)
      ]);

      if (uploadResult.error) throw uploadResult.error;

      const imageUrl = publicUrlResult.data.publicUrl;
      const { error: insertError } = await supabase
        .from("uploads")
        .insert([{ image_url: imageUrl, comment }]);

      if (insertError) throw insertError;

      toast.success("¡Foto compartida exitosamente!");
      handleRemovePhoto();
      setComment("");
    } catch (error) {
      console.error("Error en la subida:", error);
      toast.error("Error al compartir la foto");
    } finally {
      setUploading(false);
    }
  }, [file, comment]);

  const onEmojiClick = useCallback((emojiObject) => {
    setComment(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col px-4 max-w-md mx-auto">
      <div className="flex-none flex justify-center">
        <div className="p-2 rounded-full">
          <Image
            src="/images/logo.png"
            width={100}
            height={100}
            alt="Logo"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col gap-3 h-full">
        <input
          type="file"
          id="photo-input"
          accept="image/*"
          capture
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="relative flex-1 max-h-[72%]">
          <button
            onClick={() => document.getElementById("photo-input").click()}
            className="w-full h-full bg-purple-800/20 rounded-3xl  backdrop-blur-md border border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-purple-800/30 hover:border-white/20 shadow-lg active:scale-95" // Escala al presionar
          >
            {preview ? (
              <>
                <div className="w-full h-full aspect-[4/3]">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="object-cover w-full h-full rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105" // Transición de escala al hacer hover
                  />
                </div>
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-3 right-3 w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/10"
                  aria-label="Eliminar foto"
                >
                  <FaTimes className="text-lg" />
                </button>
              </>
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="inline-block border border-white/20 p-4 rounded-full bg-purple-800/20 animate-pulse">
                  {" "}
                  {/* Animación de pulso */}
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/90 text-sm px-3 font-medium">
                  Saca una selfie y compartila con nosotros!
                </p>
              </div>
            )}
          </button>
        </div>
        <div className="flex-none h-[12%] relative">
        <div className="relative w-full h-full flex items-center">
          <textarea
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= 180) {
                setComment(e.target.value);
              }
            }}
            maxLength={180}
            placeholder="Agrega un comentario..."
            className="w-full h-full p-3 pr-12 bg-purple-800/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/25 transition-all hover:bg-purple-800/30 focus:bg-purple-800/30"
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 bottom-3 p-2 text-white/80 hover:text-white transition-colors"
            type="button"
          >
            <BsEmojiSmile className="w-5 h-5" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="fixed inset-x-0 bottom-0 z-50 pb-safe">
            <div className="relative">
              <div className="flex items-center justify-between px-4 py-2 bg-purple-900/95 border-b border-white/10 backdrop-blur-md">
                <span className="text-white/90 text-sm font-medium">Emojis</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-2 text-white/80 hover:text-white"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width="100%"
                height={300}
                theme="dark"
                skinTonesDisabled
                searchDisabled
                lazyLoadEmojis
                previewConfig={{
                  showPreview: false
                }}
                categories={['smileys_people', 'animals_nature', 'food_drink', 'objects', 'symbols', 'flags']}
              />
            </div>
            
     
            <div 
              className="fixed inset-0 bg-black/40 -z-10"
              onClick={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>

        <div className="flex-none mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }} // Escala al hacer tap
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-3 rounded-xl text-white font-medium transition-all shadow-lg border border-white/10 ${
              uploading
                ? "bg-gray-500/50 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700 active:bg-pink-700"
            }`}
          >
            {uploading ? "Compartiendo..." : "Compartir selfie"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;