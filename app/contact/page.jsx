"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar"; // ✅ Navbar импортлоно

export default function ContactPage() {
  const { user } = useAppContext();
  const [form, setForm] = useState({
    name: user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const sendMessage = async () => {
    if (!form.message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id, // ✅ Clerk ID дамжуулна
          ...form,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Message sent!");
        setForm({ ...form, subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Navbar харагдуулна */}
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Fill out the form and we’ll respond as soon as possible.
          </p>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your Name"
              className="w-full border rounded px-3 py-2 bg-transparent"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Your Email"
              className="w-full border rounded px-3 py-2 bg-transparent"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Your Phone Number"
              className="w-full border rounded px-3 py-2 bg-transparent"
            />
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder="Subject"
              className="w-full border rounded px-3 py-2 bg-transparent"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows={5}
              placeholder="Your Message"
              className="w-full border rounded px-3 py-2 bg-transparent resize-y"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="flex items-center gap-3">
            <span className="font-medium">📞 Phone:</span> +976 8888‑0000
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">✉️ Email:</span> support@quickcart.mn
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">📍 Address:</span> Ulaanbaatar, Mongolia
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">⏰ Hours:</span> Mon‑Fri: 9:00 AM – 6:00 PM
          </div>
        </div>
      </section>
    </>
  );
}
