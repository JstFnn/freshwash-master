import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

const History = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/user/reservations/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservations(response.data);
      } catch (err) {
        console.error("Gagal memuat riwayat reservasi:", err);
      }
    };

    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Selesai") return "text-green-500";
    if (status === "Dibatalkan") return "text-red-500";
    return "text-gray-500";
  };

  const handleReview = (reservationId) => {
    Swal.fire({
      title: "Berikan Review Anda",
      html: `
        <style>
          .star {
            font-size: 30px;
            cursor: pointer;
            color: gray;
          }
          .star.selected,
          .star:hover,
          .star.hovered {
            color: gold;
          }
        </style>
        <div id="star-rating">
          ${[1, 2, 3, 4, 5]
            .map((i) => `<span class="star" data-value="${i}">☆</span>`)
            .join("")}
        </div>
        <textarea id="comment" class="swal2-textarea" placeholder="Komentar Anda..."></textarea>
      `,
      didOpen: () => {
        const stars = Swal.getPopup().querySelectorAll(".star");

        let selectedRating = 0;

        stars.forEach((star, index) => {
          star.addEventListener("mouseover", () => {
            stars.forEach((s, i) => {
              s.classList.toggle("hovered", i <= index);
            });
          });

          star.addEventListener("mouseout", () => {
            stars.forEach((s) => s.classList.remove("hovered"));
          });

          star.addEventListener("click", () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
              s.classList.toggle("selected", i < selectedRating);
              s.textContent = i < selectedRating ? "★" : "☆";
            });
            Swal.getPopup().dataset.rating = selectedRating;
          });
        });
      },
      preConfirm: () => {
        const rating = Swal.getPopup().dataset.rating;
        const comment = document.getElementById("comment").value;
        if (!rating) {
          Swal.showValidationMessage("Silakan beri rating terlebih dahulu.");
          return false;
        }
        return { rating, comment };
      },
      showCancelButton: true,
      confirmButtonText: "Kirim",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { rating, comment } = result.value;

        try {
          await axios.post(
            `http://localhost:3000/api/user/reservations/${reservationId}/review`,
            { rating, comment },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Update state reservations
          setReservations((prevReservations) =>
            prevReservations.map((r) =>
              r.id === reservationId ? { ...r, hasReviewed: true } : r
            )
          );

          Swal.fire("Terima Kasih!", "Review Anda telah dikirim.", "success");
        } catch (error) {
          console.error("Gagal mengirim review:", error);
          Swal.fire(
            "Gagal",
            "Review gagal dikirim. Silakan coba lagi.",
            "error"
          );
        }
      }
    });
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-xl mx-auto py-10 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-6">Riwayat Reservasi</h2>

        {reservations.length === 0 ? (
          <p>Belum ada riwayat reservasi</p>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white p-4 mb-4 shadow-md rounded-md"
            >
              <h3 className="font-semibold">ID Reservasi: {reservation.id}</h3>
              <p>Plat Kendaraan: {reservation.plateNumber}</p>
              <p>Jenis Layanan: {reservation.servicePackage}</p>
              <p>
                Waktu: {reservation.reservationDate}{" "}
                {reservation.reservationTime}
              </p>
              <p className={getStatusColor(reservation.status)}>
                Status: {reservation.status}
              </p>
              {reservation.status === "Selesai" && (
                <button
                  onClick={() => handleReview(reservation.id)}
                  className={`mt-3 px-4 py-2 ${
                    reservation.hasReviewed
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 cursor-pointer hover:bg-blue-700"
                  } text-white rounded`}
                  disabled={reservation.hasReviewed}
                >
                  {reservation.hasReviewed
                    ? "Anda telah memberikan review"
                    : "Beri Review"}
                </button>
              )}
            </div>
          ))
        )}
      </motion.div>
    </MainLayout>
  );
};

export default History;
