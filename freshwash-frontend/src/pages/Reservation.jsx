import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import axios from "axios";

const Reservation = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plateNumber: "",
    date: "",
    time: "",
    serviceId: "",
    carSize: "",
    price: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        setFormData((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }));
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/reservations/services");
        setServices(res.data);
      } catch (err) {
        console.error("Gagal mengambil layanan:", err);
      }
    };

    fetchUser();
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
      setSelectedSize("");
      setSelectedPrice(0);
      return setFormData((prev) => ({
        ...prev,
        serviceId: value,
        carSize: "",
        price: 0,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const selectedDate = formData.date;
    const [selectedHour, selectedMinute] = formData.time.split(":").map(Number);

    if (selectedDate < currentDate) {
      await Swal.fire({
        icon: "error",
        title: "Tanggal Tidak Valid",
        text: "Tanggal yang dipilih sudah lewat.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (selectedDate === currentDate) {
      if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute < currentMinute)) {
        await Swal.fire({
          icon: "error",
          title: "Waktu Tidak Valid",
          text: "Anda tidak bisa memilih waktu yang sudah terlewat pada hari ini.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }
    }

    if (selectedHour < 8 || selectedHour > 21 || (selectedHour === 21 && selectedMinute > 0)) {
      await Swal.fire({
        icon: "error",
        title: "Waktu Tidak Valid",
        text: "Waktu reservasi hanya diperbolehkan antara 08:00 hingga 21:00!",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reservations",
        {
          name: formData.name,
          plateNumber: formData.plateNumber,
          orderDate: formData.date,
          timeOrder: formData.time,
          serviceId: formData.serviceId,
          carSize: formData.carSize,
          finalPrice: formData.price,
          userEmail: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const orderCode = response.data.order_code;

      const selectedService = services.find((s) => s.service_id === parseInt(formData.serviceId));

      const emailPayload = {
        order_id: orderCode,
        to_name: formData.name,
        user_email: formData.email,
        plate_number: formData.plateNumber,
        reservation_date: formData.date,
        reservation_time: formData.time,
        service_package: selectedService?.name || "",
        car_size: formData.carSize,
        final_price: formData.price,
      };

      await emailjs.send("service_9u7kwqj", "template_gy6uqus", emailPayload, "n8aK1J1r5ua2E9u5f");

      await Swal.fire({
        icon: "success",
        title: "Reservasi Berhasil!",
        text: `Reservasi dengan Order ID: ${orderCode} telah dikirim ke email ${formData.email}.`,
        confirmButtonColor: "#0ea5e9",
      });

      navigate("/");
    } catch (error) {
      console.error("Gagal melakukan reservasi:", error);
      await Swal.fire({
        icon: "warning",
        title: "Reservasi Gagal",
        text: "Terjadi kesalahan saat memproses reservasi.",
        confirmButtonColor: "#facc15",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 shadow-md rounded-2xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Formulir Reservasi</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full border bg-gray-100 rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Plat Nomor Kendaraan</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    plateNumber: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="Contoh: B 1234 ABC"
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tanggal Reservasi</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Waktu Reservasi</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Pilih Paket Layanan</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required>
                <option value="" disabled>
                  --- Pilih Layanan ---
                </option>

                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.serviceId && (
              <div>
                <label className="block text-gray-700 mb-2">Ukuran Mobil</label>
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    const size = e.target.value;

                    const selectedService = services.find((s) => s.service_id === parseInt(formData.serviceId));

                    const sizeData = selectedService.sizes.find((sz) => sz.size === size);

                    setSelectedSize(size);
                    setSelectedPrice(sizeData.price);

                    setFormData((prev) => ({
                      ...prev,
                      carSize: size,
                      price: sizeData.price,
                    }));
                  }}
                  className="w-full border rounded-lg p-3"
                  required>
                  <option value="" disabled>
                    --- Pilih Ukuran Mobil ---
                  </option>

                  {services
                    .find((s) => s.service_id === parseInt(formData.serviceId))
                    ?.sizes?.map((sz, i) => (
                      <option key={i} value={sz.size}>
                        {sz.size} — Rp {Number(sz.price).toLocaleString("id-ID")}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {selectedPrice > 0 && (
              <div>
                <label className="block text-gray-700 mb-2">Harga</label>
                <input
                  type="text"
                  value={"Rp " + Number(selectedPrice).toLocaleString("id-ID")}
                  disabled
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className={`bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-md ${
                  isLoading ? "cursor-not-allowed bg-sky-400" : ""
                }`}
                disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-4 border-white rounded-full"></div>
                ) : (
                  "Konfirmasi Reservasi"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Reservation;
