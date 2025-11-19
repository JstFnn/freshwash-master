import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const OnProgress = () => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusMapping = {
    pending: "Pending",
    scheduled: "Terjadwal",
    dibatalkan: "Reservasi Dibatalkan",
    dalam_antrian: "Dalam Antrean",
    sedang_dicuci: "Sedang Proses Pencucian",
    pencucian_selesai: "Pencucian Selesai, Kendaraan dapat diambil",
    selesai: "Reservasi Selesai",
  };

  useEffect(() => {
    const fetchInProgressReservation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/user/reservations/on-progress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const updatedReservation = {
            ...response.data[0],
            status: statusMapping[response.data[0].status] || response.data[0].status,
          };
          setReservation(updatedReservation);
        } else {
          setReservation(null);
        }
        setLoading(false);
      } catch (error) {
        setError("Gagal memuat data pencucian.");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi masalah dalam memuat data pencucian!",
        });
      }
    };

    fetchInProgressReservation();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <motion.div
          className="max-w-xl mx-auto pt-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          <div className="max-w-xl mx-auto pt-4 px-6">
            <h2 className="text-2xl font-semibold mb-6">Pengerjaan Pencucian</h2>
            <p>Memuat data pencucian...</p>
          </div>
        </motion.div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <motion.div
          className="max-w-xl mx-auto pt-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          <div className="max-w-xl mx-auto pt-4 px-6">
            <h2 className="text-2xl font-semibold mb-6">Pengerjaan Pencucian</h2>
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
          <h2 className="text-2xl font-semibold mb-6">Pengerjaan Pencucian</h2>
          {!reservation ? (
            <p>Belum ada pencucian berlangsung. Yuk reservasi sekarang untuk cuci mobilmu!</p>
          ) : (
            <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">Informasi Reservasi</h3>
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
                  <strong>Waktu Reservasi:</strong> {new Date(reservation.date).toLocaleString()}
                </p>
                <p>
                  <strong>Status Pencucian:</strong> {reservation.status}
                </p>
                <p>
                  <strong>Harga Total:</strong> Rp. {reservation.final_price}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default OnProgress;
