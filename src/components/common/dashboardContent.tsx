// app/dashboard/[adminId]/DashboardContent.tsx
'use client'; // <-- WAJIB: Menandai ini sebagai Client Component

import { useAuth } from '@/hooks/useAuth'; // useAuth bisa dipanggil di sini
import { useEffect } from 'react'; // Untuk contoh redireksi

// Definisikan props yang diterima DashboardContent
interface DashboardContentProps {
  adminId: string; // adminId akan diteruskan dari Server Component
}

export default function DashboardContent({ adminId }: DashboardContentProps) {
  const { user, logout, loading } = useAuth(); 
  useEffect(() => {
    if (!loading && user && user.id !== adminId) {
      // router.replace(`/dashboard/${user.id}`); // Ganti dengan logika redirect yang sesuai
      console.warn(`User ID mismatch: URL ID (${adminId}) vs Auth ID (${user.id}). Redirecting...`);
    }
  }, [loading, user, adminId]); // Tambahkan router ke dependency array jika digunakan

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading auth data...</div> {/* Pesan loading khusus untuk data auth */}
      </div>
    );
  }

  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={logout} // onClick handler hanya bisa di Client Component
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Selamat datang **{adminId}**!</h2>
        <p className="text-gray-600">Nama: {user?.name}</p>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">ID (dari useAuth): {user?.id}</p>
      </div>
    </div>
  );
}