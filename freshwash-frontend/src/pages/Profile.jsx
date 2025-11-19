import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pencil,
  CalendarDays,
  Clock,
  HelpCircle,
  LogOut,
  History,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photoUrl: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser({
          name: response.data.name,
          email: response.data.email,
          photoUrl: response.data.photoUrl || "",
        });
      } catch (error) {
        Swal.fire("Error", "Gagal memuat data profil", "error");
      }
    };

    fetchUserProfile();
  }, []);

  const menuItems = [
    {
      icon: <Pencil className="w-5 h-5" />,
      text: "Edit Profil",
      to: "/profile/edit",
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      text: "Reservasi Anda",
      to: "/profile/orders",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Pengerjaan Pencucian",
      to: "/profile/on-progress",
    },
    {
      icon: <History className="w-5 h-5" />,
      text: "Riwayat Reservasi",
      to: "/profile/history",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "Bantuan",
      external: "https://wa.me/6281234567890",
    },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Anda yakin ingin Keluar?",
      text: "Semua sesi Anda akan berakhir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
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
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={user.photoUrl || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <h2 className="text-xl font-semibold mt-4">
            {user.name || "Nama Pengguna"}
          </h2>
          <p className="text-gray-600">{user.email || "Email"}</p>
        </div>

        {/* Menu List */}
        <div className="border rounded-md overflow-hidden divide-y">
          {menuItems.map((item, index) =>
            item.external ? (
              <a
                key={index}
                href={item.external}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 hover:bg-gray-50"
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.text}</span>
              </a>
            ) : (
              <Link
                key={index}
                to={item.to}
                className="flex items-center px-4 py-3 hover:bg-gray-50"
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.text}</span>
              </Link>
            )
          )}

          {/* Signout */}
          <a
            href="/logout"
            onClick={handleLogout}
            className="flex items-center px-4 py-3 hover:bg-gray-50 text-red-600"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Keluar</span>
          </a>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Profile;
