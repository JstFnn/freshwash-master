import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link
          to="/admin/users"
          className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-gray-200 hover:border-blue-500"
        >
          <h2 className="text-xl font-semibold text-blue-600">Data Pengguna</h2>
          <p className="text-gray-600 mt-2">Kelola akun pengguna, reset password, dan hapus akun.</p>
        </Link>

        <Link
          to="/admin/reservations"
          className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-gray-200 hover:border-blue-500"
        >
          <h2 className="text-xl font-semibold text-blue-600">Data Reservasi</h2>
          <p className="text-gray-600 mt-2">Pantau dan ubah status reservasi pelanggan.</p>
        </Link>

        <Link
          to="/admin/reviews"
          className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-gray-200 hover:border-blue-500"
        >
          <h2 className="text-xl font-semibold text-blue-600">Data Review</h2>
          <p className="text-gray-600 mt-2">Lihat dan kelola ulasan dari pelanggan.</p>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition cursor-pointer"
        >
          Logout Admin
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
