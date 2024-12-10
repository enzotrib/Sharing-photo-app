"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTrash, FaCog, FaImages, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "react-toastify";
import CarouselSettings from "@/app/components/CarouselSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { FaExpand } from 'react-icons/fa';


const AdminPanel = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetchPendingUploads();
      } else {
        router.push("/admin/login");
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          fetchPendingUploads();
        } else {
          setUploads([]);
          router.push("/admin/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const fetchPendingUploads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error al obtener las fotos pendientes");
    } else {
      setUploads(data);
    }
    setLoading(false);
  };

  const approveUpload = async (id) => {
    const { error } = await supabase
      .from("uploads")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      toast.error("Error al aprobar la foto");
    } else {
      toast.success("Foto aprobada exitosamente");
      fetchPendingUploads();
    }
  };

  const deleteUpload = async (id, image_url) => {
    const imagePath = image_url.split("/storage/v1/object/public/photos/")[1];

    const { error: deleteError } = await supabase
      .from("uploads")
      .delete()
      .eq("id", id);

    if (deleteError) {
      toast.error("Error al eliminar el registro");
      return;
    }

    const { error: storageError } = await supabase.storage
      .from("photos")
      .remove([imagePath]);

    if (storageError) {
      toast.error("Error al eliminar la imagen");
    } else {
      toast.success("Foto eliminada exitosamente");
      fetchPendingUploads();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col p-2 sm:p-4">
      <div className="w-full max-w-lg mx-auto md:max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm border border-gray-700/50 shadow-lg">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-gray-400 text-sm">
              Gestión de fotos y configuración
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600/90 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all 
            duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/25 active:scale-95
            border border-red-500/20 backdrop-blur-sm text-sm"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Tabs Container */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-0 h-12 bg-gray-900/50">
              <TabsTrigger 
                value="photos" 
                className="w-full h-full flex items-center justify-center gap-2
                  data-[state=active]:bg-purple-600 data-[state=active]:text-white 
                  data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-gray-800/50
                  transition-all duration-200 rounded-none border-0 text-sm"
              >
                <FaImages className="text-lg" />
                <span className="font-medium">Pendientes</span>
                {uploads.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {uploads.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="w-full h-full flex items-center justify-center gap-2
                  data-[state=active]:bg-purple-600 data-[state=active]:text-white 
                  data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-gray-800/50
                  transition-all duration-200 rounded-none border-0 text-sm"
              >
                <FaCog className="text-lg" />
                <span className="font-medium">Configuración</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-0 p-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3" />
                  <p className="text-gray-400 text-sm">Cargando fotos...</p>
                </div>
              ) : uploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FaImages className="text-3xl mb-3 opacity-50" />
                  <p className="text-sm">No hay fotos pendientes</p>
                </div>
              ) : (
                <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600/50 
                      shadow-lg transition-all duration-300 hover:md:shadow-xl hover:md:scale-[1.02]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={upload.image_url}
                          alt="Foto pendiente"
                          className="w-full h-full object-cover"
                          onClick={() => window.open(upload.image_url, '_blank')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40" />
                      </div>
                      <div className="p-3 space-y-3">
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {upload.comment || (
                            <span className="text-gray-500 italic">Sin comentario</span>
                          )}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => approveUpload(upload.id)}
                            className="bg-green-600/90 active:bg-green-700 text-white py-2 px-3 
                            rounded-lg transition-colors duration-200 flex items-center justify-center gap-2
                            shadow-lg active:scale-95 border border-green-500/20
                            text-sm hover:md:bg-green-700"
                          >
                            <FaCheck />
                            <span>Aprobar</span>
                          </button>
                          <button
                            onClick={() => deleteUpload(upload.id, upload.image_url)}
                            className="bg-red-600/90 active:bg-red-700 text-white py-2 px-3 
                            rounded-lg transition-colors duration-200 flex items-center justify-center gap-2
                            shadow-lg active:scale-95 border border-red-500/20
                            text-sm hover:md:bg-red-700"
                          >
                            <FaTrash />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-2">
              <CarouselSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default AdminPanel;