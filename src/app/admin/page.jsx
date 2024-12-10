// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";


const AdminPage = () => {
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.push('/admin/dashboard')
          } else {
            router.push('/admin/login');
          }
        };
      fetchSession();
    }, [router]);


  return null;
};

export default AdminPage;
