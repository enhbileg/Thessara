"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminContactPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/messages"); // unreplied messages API
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, []);

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📨 Unreplied Messages</h1>
        {/* ✅ History button */}
        <button
          onClick={() => router.push("/admin/contact/history")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          View History
        </button>
      </div>

      {users.length === 0 && <p>No pending messages.</p>}
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
                <p><strong>Subject:</strong> {m.subject}</p>
                <p><strong>Message:</strong> {m.message}</p>
                <p><strong>Phone:</strong> {m.phone || "N/A"}</p>
                <p><strong>Created:</strong> {new Date(m.createdAt).toLocaleString()}</p>
                <ReplyForm userId={u._id} messageId={m._id} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReplyForm({ userId, messageId }) {
  const [reply, setReply] = useState("");
  const sendReply = async () => {
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messageId, reply }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Reply sent!");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="mt-3 flex gap-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        onClick={sendReply}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Send
      </button>
    </div>
  );
}
