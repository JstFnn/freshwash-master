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

      {/* About Us Preview Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Tentang FreshWash
            </h2>
            <p className="text-gray-700 text-center text-lg leading-relaxed mb-8">
              FreshWash adalah solusi modern untuk kebutuhan perawatan kendaraan Anda. 
              Kami hadir untuk memberikan layanan cuci kendaraan berkualitas tinggi yang 
              bisa diakses secara online, baik di tempat kami maupun langsung di rumah Anda. 
              Tanpa antri, tanpa repot.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3">Misi Kami</h3>
                <p className="text-gray-600">
                  Memberikan pengalaman terbaik dalam merawat kendaraan dengan 
                  mengedepankan kebersihan, ketepatan waktu, dan kepuasan pelanggan.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3">Mengapa FreshWash?</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Hemat Waktu</li>
                  <li>✓ Kualitas Terjamin</li>
                  <li>✓ Transparan & Fleksibel</li>
                  <li>✓ Aman & Terpercaya</li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 }}}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 }}}
            >
              <Link
                to="/about"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
              >
                Selengkapnya Tentang Kami ➔
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Layanan Kami
            </h2>
            <p className="text-gray-600 text-center text-lg mb-12">
              Pilih layanan terbaik untuk kendaraan Anda
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold mb-2">Cuci Reguler</h3>
                <p className="text-gray-600 mb-4">
                  Layanan cuci kendaraan standar dengan hasil maksimal
                </p>
                <p className="text-2xl font-bold text-sky-600">Mulai Rp 25.000</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Premium Detailing</h3>
                <p className="text-gray-600 mb-4">
                  Perawatan menyeluruh untuk kendaraan kesayangan Anda
                </p>
                <p className="text-2xl font-bold text-green-600">Mulai Rp 75.000</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-2">Paket Bundling</h3>
                <p className="text-gray-600 mb-4">
                  Hemat lebih dengan paket kombinasi layanan
                </p>
                <p className="text-2xl font-bold text-purple-600">Mulai Rp 100.000</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 }}}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 }}}
            >
              <Link
                to="/services"
                className="inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
              >
                Lihat Semua Layanan ➔
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
