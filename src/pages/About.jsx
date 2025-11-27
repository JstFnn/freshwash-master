import React from "react";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import logoFreshwash from "../assets/freshwash-logo.png";

const About = () => {
  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-12 space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10">
          Tentang Kami
        </motion.h2>
        {/* Tentang FreshWash */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start bg-white p-8 shadow-md rounded-2xl border">
          {/* <img src={logoFreshwash} alt="FreshWash Logo" className="h-40 w-auto mb-6 md:mb-0 md:mr-10" /> */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">FreshWash</h2>
            <p className="text-gray-700 leading-relaxed text-center">
              FreshWash adalah solusi modern untuk kebutuhan perawatan kendaraan Anda. Kami hadir untuk memberikan
              layanan cuci kendaraan berkualitas tinggi yang bisa diakses secara online, baik di tempat kami maupun
              langsung di rumah Anda. Tanpa antri, tanpa repot.
            </p>
          </div>
        </motion.div>

        {/* Misi Kami */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 shadow-md rounded-2xl border text-center">
          <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
          <p className="text-gray-700 leading-relaxed">
            Memberikan pengalaman terbaik dalam merawat kendaraan, dengan mengedepankan kebersihan, ketepatan waktu, dan
            kepuasan pelanggan. Kami percaya bahwa perawatan kendaraan tidak harus memakan waktu atau merepotkan karena
            itulah FreshWash hadir.
          </p>
        </motion.div>

        {/* Mengapa FreshWash? */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 shadow-md rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4 text-center">Mengapa FreshWash?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Hemat Waktu</strong> – Cukup booking via website, kami yang urus sisanya.
            </li>
            <li>
              <strong>Kualitas Terjamin</strong> – Kendaraan Anda ditangani oleh tim berpengalaman.
            </li>
            <li>
              <strong>Transparan dan Fleksibel</strong> – Informasi layanan jelas, waktu reservasi fleksibel.
            </li>
            <li>
              <strong>Aman dan Terpercaya</strong> – Kami menghargai waktu dan kendaraan Anda.
            </li>
          </ul>
        </motion.div>

        {/* Kontak Kami */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-8 shadow-md rounded-2xl border text-center">
          <h2 className="text-2xl font-bold mb-4">Kontak Kami</h2>
          <p className="text-gray-700 leading-relaxed">
            Jl. Pramuka No.155, Purwokerto Selatan, Kabupaten Banyumas, Jawa Tengah
          </p>
          <p className="text-gray-700 mb-6">Email: freshwashcling@gmail.com</p>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition">
            Hubungi via WhatsApp
          </a>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default About;
