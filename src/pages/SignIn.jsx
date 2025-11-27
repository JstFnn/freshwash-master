import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import logoFreshwash from "../assets/freshwash-logo.png";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = formData.email.trim().toLowerCase();
    const cleanedPassword = formData.password.trim();

    // Regex validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanedEmail || !cleanedPassword) {
      setError("Pastikan semua kolom diisi.");
      return;
    }

    if (!emailRegex.test(cleanedEmail)) {
      setError("Format email tidak valid.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          email: cleanedEmail,
          password: cleanedPassword,
        }
      );

      if (response.status === 200) {
        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        Swal.fire({
          icon: "success",
          title: "Berhasil Masuk!",
          text: `Selamat datang kembali, ${role}!`,
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "Signin gagal. Silakan periksa kredensial Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminWhatsAppNumber = "6281234567890";

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
          Selamat Datang di FreshWash - Sign in untuk melanjutkan
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                autoComplete="email"
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <span
                onClick={() => {
                  const email = formData.email.trim();
                  if (!email) {
                    Swal.fire({
                      icon: "warning",
                      title: "Email belum diisi",
                      text: "Mohon isi email terlebih dahulu untuk reset password.",
                    });
                    return;
                  }
                  const message = encodeURIComponent(
                    `Halo, Admin. Saya ingin reset password dengan email ${email}`
                  );
                  const url = `https://wa.me/${adminWhatsAppNumber}?text=${message}`;
                  window.open(url, "_blank");
                }}
                className="text-sm text-indigo-600 cursor-pointer hover:underline"
                title="Reset Password via WhatsApp"
              >
                Reset Password
              </span>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Masukkan password anda"
                value={formData.password}
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
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Don't have account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum memiliki akun?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Buat akun disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
