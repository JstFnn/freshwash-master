import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UsersData = () => {
  const [userList, setUserList] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/admin/users");
        setUserList(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data pengguna.",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus pengguna ini?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
        setUserList(userList.filter((user) => user.user_id !== id));
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengguna telah dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus pengguna.",
        });
      }
    }
  };

  const handleResetPassword = async (id) => {
    const result = await Swal.fire({
      title: "Reset password pengguna ini?",
      text: "Password akan diatur ulang ke default.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, reset!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.patch(`http://localhost:3000/api/admin/users/${id}/reset-password`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Password berhasil direset ke: ${res.data.defaultPassword}`,
        });
      } catch (error) {
        console.error("Gagal mereset password:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mereset password.",
        });
      }
    }
  };

  const filteredUsers = userList.filter((user) => {
    const keyword = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.phone_number.toLowerCase().includes(keyword)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Data Pengguna</h2>

      {/* Sort + Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <label className="mr-2 font-semibold">Urutkan berdasarkan:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="name-asc">Nama (A-Z)</option>
            <option value="name-desc">Nama (Z-A)</option>
          </select>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto">
          <input
            type="text"
            placeholder="Cari nama, email, atau telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Tabel Data Pengguna */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-center">Nama</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Nomor Telepon</th>
              <th className="px-6 py-3 text-center">Password</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.user_id} className="border-t">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone_number}</td>
                <td className="px-6 py-4">******</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.user_id)}
                    className="text-yellow-500 hover:underline"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersData;
