import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFreshwash from "../assets/freshwash-logo.png";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Anda belum signin",
        text: "Silakan signin terlebih dahulu untuk mengakses profile.",
        confirmButtonText: "Signin sekarang",
        denyButtonText: "Batal",
        showDenyButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {/* <header className="bg-[#F8F8F8] shadow-sm"> */}
      <header className="bg-[#F8F8F8] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={logoFreshwash}
                alt="Freshwash Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <Link to="/about" className="text-stone-950 hover:text-gray-500 transition-colors duration-200">
              About us
            </Link>
            <Link to="/services" className="text-stone-950 hover:text-gray-500 transition-colors duration-200">
              Services
            </Link>
            <button
              onClick={handleProfileClick}
              className="text-stone-950 hover:text-gray-500 transition-colors duration-200 cursor-pointer">
              Profile
            </button>
            {role === "admin" && (
              <Link to="/admin" className="text-stone-950 hover:text-gray-500 transition-colors duration-200">
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-stone-950 focus:outline-none">
              {/* Icon hamburger menu */}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center space-y-4 pb-4">
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-stone-950 hover:text-gray-700 transition-colors duration-200">
              About us
            </Link>
            <Link
              to="/services"
              onClick={toggleMenu}
              className="text-stone-950 hover:text-gray-700 transition-colors duration-200">
              Services
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                handleProfileClick();
              }}
              className="text-stone-950 hover:text-gray-700 transition-colors duration-200">
              Profile
            </button>
            {role === "admin" && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="text-stone-950 hover:text-gray-700 transition-colors duration-200">
                Admin
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-3 bg-[#F8F8F8]">© FreshWash 2025</footer>
    </div>
  );
};

export default MainLayout;
