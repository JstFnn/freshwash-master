import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForm((prev) => ({
          ...prev,
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        }));
        setPhotoPreview(response.data.photoUrl || "");
      } catch (error) {
        Swal.fire("Error", "Failed to load profile data.", "error");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return Swal.fire("Error", "Format email tidak valid.", "error");
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(form.phone)) {
      return Swal.fire(
        "Error",
        "Nomor telepon tidak valid. Gunakan 10-15 digit angka saja.",
        "error"
      );
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (photo) formData.append("photo", photo);

    try {
      await axios.put("http://localhost:3000/api/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire("Sukses", "Profil berhasil diperbarui", "success");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal update profil",
        "error"
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword) {
      return Swal.fire("Error", "Silakan isi kedua kolom password", "error");
    }

    const result = await Swal.fire({
      title: "Anda yakin ingin mengganti password?",
      text: "Pastikan Anda mengingat password baru yang akan digunakan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, ganti password",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        "http://localhost:3000/api/user/profile",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Sukses", "Password berhasil diubah", "success");
      setForm((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal mengubah password",
        "error"
      );
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Tindakan ini akan menghapus akun anda secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus akun saya!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("http://localhost:3000/api/user/account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire("Deleted!", "Akun anda telah dihapus.", "success").then(
          () => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }
        );
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus akun", "error");
      }
    }
  };

  const handleRemovePhoto = async () => {
    const confirm = await Swal.fire({
      title: "Hapus Foto Profil?",
      text: "Foto profil akan dihapus dan kembali ke default.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:3000/api/user/profile/photo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPhoto(null);
        setPhotoPreview("");
        Swal.fire("Sukses", "Foto profil telah dihapus.", "success");
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus foto profil.", "error");
      }
    }
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-xl mx-auto pt-6 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-xl mx-auto pt-4 px-6">
          <h2 className="text-2xl font-semibold mb-6">Edit Profil</h2>

          {/* FORM EDIT PROFIL */}
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div>
              <label className="block mb-1 font-medium">Foto Profil</label>
              {photoPreview && (
                <>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="ml-1 text-red-600 text-sm hover:underline cursor-pointer"
                  >
                    Hapus Foto Profil
                  </button>
                </>
              )}
              <div className="mt-2">
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                >
                  Pilih Foto
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                name="name"
                className="w-full border px-4 py-2 rounded"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border px-4 py-2 rounded"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Nomor Telepon</label>
              <input
                type="tel"
                name="phone"
                className="w-full border px-4 py-2 rounded"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Simpan Profil
            </button>
          </form>

          <hr className="my-8" />

          {/* Form Ubah Password */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h3 className="text-lg font-semibold">Ubah Password</h3>

            <div>
              <label className="block mb-1 font-medium">
                Password Saat Ini
              </label>
              <input
                type="password"
                name="oldPassword"
                className="w-full border px-4 py-2 rounded"
                value={form.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password Baru</label>
              <input
                type="password"
                name="newPassword"
                className="w-full border px-4 py-2 rounded"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 cursor-pointer"
            >
              Ubah Password
            </button>
          </form>

          <hr className="my-8" />

          <div className="text-right">
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Hapus Akun
            </button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default EditProfile;
