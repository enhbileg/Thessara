"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext"; 
import { getDictionary } from "@/app/[lang]/dictionaries.js"; 
import Footer from "@/components/seller/Footer";

export default function AdminContactPage() {
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/${language}/api/admin/messages`); // unreplied messages API
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error(dict.loadFailed || "Failed to load messages");
      }
    };
    fetchMessages();
  }, [language]);

  return (
    <>
      <section className="p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {dict.unrepliedMessages || "📨 Unreplied Messages"}
          </h1>
          {/* ✅ History button */}
          <button
            onClick={() => router.push(`/${language}/admin/contact/history`)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {dict.viewHistory || "View History"}
          </button>
        </div>

        {users.length === 0 && <p>{dict.noPending || "No pending messages."}</p>}
        <div className="space-y-6">
          {users.map((u) => (
            <div key={u._id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">
                {u.name} ({u.email})
              </h2>
              {u.messages.map((m) => (
                <div
                  key={m._id}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3"
                >
                  <p><strong>{dict.subject || "Subject"}:</strong> {m.subject}</p>
                  <p><strong>{dict.message || "Message"}:</strong> {m.message}</p>
                  <p><strong>{dict.phone || "Phone"}:</strong> {m.phone || "N/A"}</p>
                  <p><strong>{dict.created || "Created"}:</strong> {new Date(m.createdAt).toLocaleString()}</p>
                  <ReplyForm userId={u._id} messageId={m._id} dict={dict} language={language} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Admin Footer */}
      <Footer />
    </>
  );
}

function ReplyForm({ userId, messageId, dict, language }) {
  const [reply, setReply] = useState("");
  const sendReply = async () => {
    try {
      const res = await fetch(`/${language}/api/admin/messages/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messageId, reply }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(dict.replySent || "Reply sent!");
      } else {
        toast.error(data.message || dict.replyFailed || "Failed to send reply");
      }
    } catch {
      toast.error(dict.replyFailed || "Failed to send reply");
    }
  };

  return (
    <div className="mt-3 flex gap-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder={dict.replyPlaceholder || "Write a reply..."}
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        onClick={sendReply}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {dict.send || "Send"}
      </button>
    </div>
  );
}
