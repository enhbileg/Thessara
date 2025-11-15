"use client";
import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

export default function ContactPage() {
  const { user, language } = useAppContext();
  const [dict, setDict] = useState({});
  const [form, setForm] = useState({
    name: user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [waitingReply, setWaitingReply] = useState(false);
  const [settings, setSettings] = useState(null);

  // ✅ Dictionary fetch
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  // ✅ Settings fetch
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/${language}/api/admin/settings`);
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, [language]);

  // ✅ History fetch
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/${language}/api/contact/history`);
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages(data.messages);
          setWaitingReply(data.messages.some((m) => !m.reply));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [language]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const sendMessage = async () => {
    if (!form.message.trim()) {
      toast.error(dict.messageEmpty || "Message cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/${language}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          ...form,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(dict.messageSent || "Message sent!");
        setForm((f) => ({ ...f, subject: "", message: "" }));
        setWaitingReply(true);

        const historyRes = await fetch(`/${language}/api/contact/history`);
        const historyData = await historyRes.json();
        if (historyRes.ok && historyData.success) {
          setMessages(historyData.messages);
        }
      } else {
        toast.error(data.message || dict.messageFailed || "Failed to send message");
      }
    } catch (err) {
      toast.error(dict.serverError || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{dict.getInTouch || "Get in Touch"}</h1>

          {waitingReply ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="mb-4">{dict.waitingReplyText || "📩 Your message is awaiting reply..."}</p>
              {messages.some((m) => m.reply) && (
                <button
                  onClick={() => setWaitingReply(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {dict.newMessage || "✏️ New Message"}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4 ">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder={dict.yourName || "Your Name"}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent"
                  disabled
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder={dict.yourEmail || "Your Email"}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent"
                  disabled
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder={dict.yourPhone || "Your Phone Number"}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent"
                />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder={dict.subject || "Subject"}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={5}
                  placeholder={dict.yourMessage || "Your Message"}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent resize-y"
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={loading}
                className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loading ? dict.sending || "Sending..." : dict.sendMessage || "Send Message"}
              </button>
            </>
          )}
        </div>

        {/* Company Info + History */}
        <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold mb-4">{dict.contactInformation || "Contact Information"}</h2>
          {settings ? (
            <>
              <div className="flex items-center gap-3">
                <span className="font-medium">{dict.phone || "📞 Phone:"}</span> {settings.contactPhone}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{dict.email || "✉️ Email:"}</span> {settings.supportEmail}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{dict.address || "📍 Address:"}</span> {settings.contactAddress}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{dict.hours || "⏰ Hours:"}</span> {settings.workingHours}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">{dict.loadingSettings || "Loading settings..."}</p>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">{dict.messageHistory || "📜 Message History"}</h3>
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">{dict.noMessages || "No messages yet."}</p>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className="border rounded p-3 bg-white dark:bg-gray-700"
                  >
                    <p><strong>{dict.subject || "Subject"}:</strong> {m.subject}</p>
                    <p><strong>{dict.yourMessage || "Message"}:</strong> {m.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                    {m.reply ? (
                      <p className="mt-2 text-green-600">
                        <strong>{dict.reply || "Reply:"}</strong> {m.reply}
                      </p>
                    ) : (
                      <p className="mt-2 text-red-500">{dict.awaitingReply || "⏳ Awaiting reply..."}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
