import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ReviewsData = () => {
  const [reviewList, setReviewList] = useState([]);
  const [sortOption, setSortOption] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/admin/reviews");
        setReviewList(response.data);
      } catch (error) {
        console.error("Gagal mengambil data review:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data review.",
        });
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus review ini?",
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
        await axios.delete(`http://localhost:3000/api/admin/reviews/${reviewId}`);
        setReviewList((prev) => prev.filter((review) => review.review_id !== reviewId));
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Review berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Gagal menghapus review:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus review.",
        });
      }
    }
  };

  const filteredReviews = reviewList.filter((review) => {
    const keyword = searchQuery.toLowerCase();
    return (
      review.user.toLowerCase().includes(keyword) ||
      review.comment.toLowerCase().includes(keyword) ||
      review.order_id.toString().includes(keyword)
    );
  });

  const sortedReviews = filteredReviews.sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return new Date(a.created_at) - new Date(b.created_at);
      case "date-desc":
        return new Date(b.created_at) - new Date(a.created_at);
      case "rating-asc":
        return a.rating - b.rating;
      case "rating-desc":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Data Review</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <label className="mr-2 font-semibold">Urutkan berdasarkan:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="date-desc">Tanggal Terbaru</option>
            <option value="date-asc">Tanggal Terlama</option>
            <option value="rating-desc">Rating Tertinggi</option>
            <option value="rating-asc">Rating Terendah</option>
          </select>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto">
          <input
            type="text"
            placeholder="Cari nama, komentar, atau order ID..."
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
              <th className="px-6 py-3 text-center">Nama</th>
              <th className="px-6 py-3 text-center">Order ID</th>
              <th className="px-6 py-3 text-center">Rating</th>
              <th className="px-6 py-3 text-center">Komentar</th>
              <th className="px-6 py-3 text-center">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReviews.map((review) => (
              <tr key={review.review_id} className="border-t">
                <td className="px-6 py-4">{review.user}</td>
                <td className="px-6 py-4">{review.order_id}</td>
                <td className="px-6 py-4">{review.rating}</td>
                <td className="px-6 py-4">{review.comment}</td>
                <td className="px-6 py-4">
                  {new Date(review.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(review.review_id)}
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

export default ReviewsData;
