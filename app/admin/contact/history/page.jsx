"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/admin/messages/history");
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to load history");
      }
    };
    fetchHistory();
  }, []);

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📜 Reply History</h1>
        {/* ✅ Back button */}
        <button
          onClick={() => router.push("/admin/contact")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          ⬅ Back
        </button>
      </div>

      {users.length === 0 && <p>No replied messages yet.</p>}
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
                <p><strong>Subject:</strong> {m.subject}</p>
                <p><strong>Message:</strong> {m.message}</p>
                <p><strong>Reply:</strong> {m.reply}</p>
                <p><strong>Replied At:</strong> {new Date(m.repliedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
