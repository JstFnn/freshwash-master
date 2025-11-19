import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ReservationsData = () => {
  const [reservationList, setReservationList] = useState([]);
  const [sortOption, setSortOption] = useState("id-desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/reservations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservationList(response.data);
      } catch (error) {
        console.error("Gagal mengambil data reservasi:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data reservasi.",
        });
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin menghapus reservasi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/api/admin/reservations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservationList((prev) => prev.filter((res) => res.id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Reservasi berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Gagal menghapus reservasi:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus reservasi.",
        });
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/reservations/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReservationList((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status } : res))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Status reservasi berhasil diubah menjadi "${status}".`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memperbarui status reservasi.",
      });
    }
  };

  const filteredReservations = [...reservationList].filter((res) => {
    const keyword = searchQuery.toLowerCase();
    return (
      res.name.toLowerCase().includes(keyword) ||
      res.phone_number.toLowerCase().includes(keyword) ||
      res.plate.toLowerCase().includes(keyword)
    );
  });

  const sortedReservations = filteredReservations.sort((a, b) => {
    switch (sortOption) {
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      case "date-asc":
        return new Date(a.order_date) - new Date(b.order_date);
      case "date-desc":
        return new Date(b.order_date) - new Date(a.order_date);
      default:
        return 0;
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Data Reservasi</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <label className="mr-2 font-semibold">Urutkan berdasarkan:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="id-desc">ID - Terbaru</option>
            <option value="id-asc">ID - Terlama</option>
            <option value="date-desc">Tanggal - Terbaru</option>
            <option value="date-asc">Tanggal - Terlama</option>
          </select>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto">
          <input
            type="text"
            placeholder="Cari nama, nomor telepon, atau plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-80"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-center">Reservation ID</th>
              <th className="px-6 py-3 text-center">Nama</th>
              <th className="px-6 py-3 text-center">No Telp</th>
              <th className="px-6 py-3 text-center">Plat Nomor</th>
              <th className="px-6 py-3 text-center">Layanan</th>
              <th className="px-6 py-3 text-center">Tanggal Reservasi</th>
              <th className="px-6 py-3 text-center">Harga</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservations.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="px-6 py-4">{res.id}</td>
                <td className="px-6 py-4">{res.name}</td>
                <td className="px-6 py-4">{res.phone_number}</td>
                <td className="px-6 py-4">{res.plate}</td>
                <td className="px-6 py-4">{res.service}</td>
                <td className="px-6 py-4">
                  {new Date(res.order_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">{res.price}</td>
                <td className="px-6 py-4">
                  <select
                    value={res.status}
                    onChange={(e) => handleStatusChange(res.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="dibatalkan">Dibatalkan</option>
                    <option value="dalam_antrian">Dalam Antrean</option>
                    <option value="sedang_dicuci">Sedang Dicuci</option>
                    <option value="pencucian_selesai">Pencucian Selesai</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
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

export default ReservationsData;
