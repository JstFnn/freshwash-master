import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logoFreshwash from "../assets/freshwash-logo.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid. Gunakan email yang benar.");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Nomor telepon tidak valid. Gunakan 10-15 digit angka saja.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(
        "Password yang anda buat tidak sama dengan konfirmasi password."
      );
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          nama: formData.nama,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      console.log("Signup success:", response.data);

      Swal.fire({
        icon: "success",
        title: "Akun Berhasil Dibuat!",
        text: "Silakan SignIn dengan Akun Anda",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/signin");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Pembuatan akun gagal. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Logo */}
        <img
          alt="FreshWash Logo"
          src={logoFreshwash}
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-8 text-center text-base font-bold tracking-tight text-gray-900">
          Selamat Datang di FreshWash - Buat akun anda sekarang!
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Lengkap
            </label>
            <div className="mt-2">
              <input
                id="nama"
                name="nama"
                type="text"
                required
                placeholder="Masukkan nama lengkap anda"
                value={formData.nama}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm 
                           ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 focus:ring-sky-400 sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Masukkan email anda"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm 
                           ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 focus:ring-sky-400 sm:text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Masukkan nomor HP anda"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm 
                           ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 focus:ring-sky-400 sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Buat password anda"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm 
                           ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 focus:ring-sky-400 sm:text-sm"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Konfirmasi password anda"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm 
                           ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 focus:ring-sky-400 sm:text-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 
                         text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                         focus-visible:outline focus-visible:outline-2 
                         focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                         ${
                           isLoading ? "cursor-not-allowed bg-indigo-400" : ""
                         }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-4 border-white rounded-full"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
