import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";

const YourReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/user/reservations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else {
          setReservations([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Gagal memuat data reservasi");
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Tindakan ini akan membatalkan reservasi Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, batalkan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/user/reservations/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire("Berhasil!", "Reservasi Anda telah dibatalkan.", "success");
        setReservations((prev) => prev.filter((reservation) => reservation.id !== reservationId));
      } catch (error) {
        Swal.fire("Gagal", "Gagal membatalkan reservasi.", "error");
      }
    }
  };

  // Handle loading
  if (loading) {
    return (
      <MainLayout>
        <motion.div
          className="max-w-xl mx-auto pt-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          <div className="max-w-xl mx-auto pt-4 px-6">
            <h2 className="text-2xl font-semibold mb-6">Reservasi Anda</h2>
            <p>Memuat data reservasi...</p>
          </div>
        </motion.div>
      </MainLayout>
    );
  }

  // Handle error
  if (error) {
    return (
      <MainLayout>
        <motion.div
          className="max-w-xl mx-auto pt-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          <div className="max-w-xl mx-auto pt-4 px-6">
            <h2 className="text-2xl font-semibold mb-6">Reservasi Anda</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        className="max-w-xl mx-auto pt-6 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}>
        <div className="max-w-xl mx-auto pt-4 px-6">
          <h2 className="text-2xl font-semibold mb-6">Reservasi Anda</h2>
          {reservations.length === 0 ? (
            <p>Belum ada reservasi mendatang. Yuk reservasi sekarang untuk cuci mobilmu!</p>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white p-6 shadow-md rounded-lg flex justify-between items-center">
                  <div className="space-y-2">
                    <p>
                      <strong>ID Reservasi:</strong> {reservation.orderId}
                    </p>
                    <p>
                      <strong>Plat Kendaraan:</strong> {reservation.plateNumber}
                    </p>
                    <p>
                      <strong>Jenis Layanan:</strong> {reservation.servicePackage}
                    </p>
                    <p>
                      <strong>Harga Total:</strong> {reservation.final_price}
                    </p>
                    <p>
                      <strong>Waktu:</strong> {new Date(reservation.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="text-red-600 hover:underline cursor-pointer">
                    Batalkan Reservasi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default YourReservation;
