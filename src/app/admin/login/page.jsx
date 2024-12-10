"use client"
import LoginForm from '@/app/components/LoginForm'; 
const AdminLogin = () => {
  return (
    <main className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin</h1>
      <LoginForm />
    </main>
  );
}

export default AdminLogin