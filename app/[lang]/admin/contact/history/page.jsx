"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext"; // ✅ хэл context
import { getDictionary } from "@/app/[lang]/dictionaries.js"; // ✅ dictionary

export default function HistoryPage() {
  const { language } = useAppContext();
  const [users, setUsers] = useState([]);
  const [dict, setDict] = useState({});
  const router = useRouter();

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/${language}/api/admin/messages/history`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(dict.loadFailed || "Failed to load history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [language]);

  // ✅ Clear History function
  const clearHistory = async () => {
    if (!confirm(dict.confirmClear || "Are you sure you want to clear ALL history?")) return;
    try {
      const res = await fetch(`/${language}/api/admin/messages/history/clear`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(dict.historyCleared || "History cleared successfully");
        setUsers([]); // frontend талд хоосолно
      } else {
        toast.error(data.message || dict.clearFailed || "Failed to clear history");
      }
    } catch {
      toast.error(dict.clearFailed || "Failed to clear history");
    }
  };

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {dict.replyHistory || "📜 Reply History"}
        </h1>
        <div className="flex gap-3">
          {/* ✅ Back button */}
          <button
            onClick={() => router.push(`/${language}/admin/contact`)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {dict.back || "⬅ Back"}
          </button>
          {/* ✅ Clear History button */}
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {dict.clearHistory || "🗑 Clear History"}
          </button>
        </div>
      </div>

      {users.length === 0 && <p>{dict.noReplied || "No replied messages yet."}</p>}
      <div className="space-y-6">
        {users.map((u) => (
          <div key={u._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-lg mb-2">
              {u.name} ({u.email})
            </h2>
            {u.messages.map((m, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3"
              >
                <p><strong>{dict.subject || "Subject"}:</strong> {m.subject}</p>
                <p><strong>{dict.message || "Message"}:</strong> {m.message}</p>
                <p><strong>{dict.reply || "Reply"}:</strong> {m.reply}</p>
                <p><strong>{dict.repliedAt || "Replied At"}:</strong> {new Date(m.repliedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
