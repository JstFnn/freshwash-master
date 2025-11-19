import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const Services = () => {
  const navigate = useNavigate();
  const [regularServices, setRegularServices] = useState([]);
  const [bundlingServices, setBundlingServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/services")
      .then((res) => {
        const data = res.data;
        setRegularServices(data.filter((item) => item.is_bundling === 0));
        setBundlingServices(data.filter((item) => item.is_bundling === 1));
      })
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

  const handleReservationClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Anda belum signin",
        text: "Silakan signin terlebih dahulu untuk melakukan reservasi.",
        confirmButtonText: "Signin sekarang",
        denyButtonText: "Batal",
        showDenyButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    } else {
      navigate("/reservation");
    }
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-6 py-12">
        {/* Paket Reguler */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10">
          Layanan Kami
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {regularServices.map((service, index) => {
            const slug = slugify(service.name);
            return (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white border rounded-2xl shadow-md p-8 text-center cursor-pointer hover:shadow-lg transition">
                <Link to={`/services/${slug}`} className="block">
                  <h3 className="text-xl font-semibold mb-4">{service.name}</h3>
                  {service.prices && (
                    <p className="text-2xl font-bold mb-4">Mulai Rp {Number(service.prices.S).toLocaleString()}</p>
                  )}
                </Link>
                <button
                  onClick={handleReservationClick}
                  className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-full transition cursor-pointer">
                  Reservasi
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bundling Cling */}
        {/* <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl font-bold text-center mb-10">
          Bundling Cling
        </motion.h2> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundlingServices.map((bundle, index) => {
            const slug = slugify(bundle.name);
            return (
              <motion.div
                key={bundle.service_id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white border rounded-2xl shadow-md p-8 text-center cursor-pointer hover:shadow-lg transition">
                <Link to={`/services/${slug}`} className="block">
                  <h3 className="text-xl font-semibold mb-4">{bundle.name}</h3>
                  {bundle.prices && (
                    <p className="text-2xl font-bold mb-4">Mulai Rp{Number(bundle.prices.S).toLocaleString()}</p>
                  )}
                </Link>
                <button
                  onClick={handleReservationClick}
                  className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-full transition cursor-pointer">
                  Reservasi
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
