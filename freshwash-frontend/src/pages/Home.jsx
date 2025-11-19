import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/home-bg.png";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <section className="relative bg-white">
        {/* Background Image */}
        <img
          src={heroImage}
          alt="Car Wash"
          className="w-full h-[calc(100vh-80px)] object-cover"
        />

        {/* Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent flex items-center">
          <div className="flex justify-end w-full px-6 md:px-12">
            <div className="max-w-lg text-left space-y-6">
              {/* Title */}
              <motion.h1
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-white leading-tight"
              >
                Cuci Kendaraan Anda dengan <br /> Tangan Profesional Kami
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/90 text-base md:text-lg"
              >
                Tak perlu antri atau buang waktu.
                <br />
                Pilih layanan, atur jadwal, dan kami urus sisanya!
              </motion.p>

              {/* Button */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 }}}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 }}}
              >
                <Link
                  to="/services"
                  className="inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
                >
                  Pilih Layanan ➔
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
