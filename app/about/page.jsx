"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaTruck, FaCreditCard, FaMobileAlt, FaTags, FaSmile, FaBoxOpen } from "react-icons/fa";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-10 space-y-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 md:p-12 shadow-lg">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">
            About <span className="text-indigo-600">Thessara</span>
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl">
            Thessara is built to make shopping seamless, fast, and delightful. 
            From transparent pricing to reliable delivery, we focus on clarity and joy in every interaction.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge label="Fast delivery" color="blue" />
            <Badge label="Secure payments" color="emerald" />
            <Badge label="Quality products" color="violet" />
          </div>
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Our Mission</h2>
          <p className="mt-3 text-gray-600 text-sm md:text-base max-w-3xl">
            To craft an intuitive shopping experience that feels effortless. 
            We combine robust backend automation with playful, responsive UI so every order feels smooth and reliable.
          </p>
        </section>

        {/* Value props */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ValueCard
            title="Transparent pricing"
            desc="Clear prices, localized currency formatting."
            icon={<FaTags className="text-indigo-600" size={28} />}
          />
          <ValueCard
            title="Reliable delivery"
            desc="Track statuses from pending to delivered."
            icon={<FaTruck className="text-blue-600" size={28} />}
          />
          <ValueCard
            title="Secure payments"
            desc="Straightforward payment flows with status feedback."
            icon={<FaCreditCard className="text-emerald-600" size={28} />}
          />
          <ValueCard
            title="Responsive UI"
            desc="Optimized for phones first, no clutter."
            icon={<FaMobileAlt className="text-violet-600" size={28} />}
          />
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Store at a glance</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-6">
            <Stat label="Products" value="1,250+" icon={<FaBoxOpen size={22} className="text-indigo-600" />} />
            <Stat label="Orders fulfilled" value="8,300+" icon={<FaTruck size={22} className="text-blue-600" />} />
            <Stat label="Happy customers" value="4,900+" icon={<FaSmile size={22} className="text-emerald-600" />} />
            <Stat label="Avg. delivery time" value="2–4 days" icon={<FaTruck size={22} className="text-violet-600" />} />
            <Stat label="Return rate" value="< 2%" icon={<FaCreditCard size={22} className="text-pink-600" />} />
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Our Journey</h2>
          <div className="mt-4 space-y-6">
            <TimelineItem year="2023" title="Foundation" desc="Launched core product catalog and clean cart flow." />
            <TimelineItem year="2024" title="Automation" desc="Integrated event-driven updates for payment and delivery." />
            <TimelineItem year="2025" title="Playful UI" desc="Polished mobile interactions, gradients, and animations." />
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-primary">Questions or feedback?</h3>
              <p className="text-gray-600 text-sm md:text-base mt-2">
                We iterate fast. Tell us what you want to see next.
              </p>
            </div>
            <button className="px-5 py-2 rounded bg-button text-white hover:opacity-90 transition">
              Contact us
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const Badge = ({ label, color }) => {
  const colors = {
    blue: "bg-blue-600/15 text-blue-700 dark:text-blue-300",
    emerald: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
    violet: "bg-violet-600/15 text-violet-700 dark:text-violet-300",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
};

const ValueCard = ({ title, desc, icon }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow hover:shadow-md transition">
    <div className="flex items-center gap-3">
      {icon}
      <p className="font-medium text-primary">{title}</p>
    </div>
    <p className="mt-2 text-xs md:text-sm text-gray-600">{desc}</p>
  </div>
);

const Stat = ({ label, value, icon }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 text-center shadow">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-xl md:text-2xl font-semibold text-primary">{value}</p>
    <p className="text-xs md:text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

const TimelineItem = ({ year, title, desc }) => (
  <div className="relative pl-10">
    <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-button/20 border border-button" />
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow">
      <p className="text-xs text-gray-500">{year}</p>
      <p className="font-medium text-primary">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  </div>
);

export default AboutPage;
