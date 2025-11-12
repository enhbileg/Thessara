"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 const clearCart = async (id) => {
  const res = await fetch(`/api/admin/users/${id}/clear-cart`, { method: "PUT" });
  const data = await res.json(); // NextResponse JSON‑ийг уншина
  toast.success("Cart cleared successfully");
  console.log("Clear cart response:", data);
  fetchUsers();
};


  return (
    <div className="bg-blank border-blank p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-specialText">Users</h1>
      <table className="w-full border-collapse border border-navbar">
        <thead>
          <tr className="bg-backBanner">
            <th className="border border-navbar px-4 py-2 text-left">Image</th>
            <th className="border border-navbar px-4 py-2 text-left">Name</th>
            <th className="border border-navbar px-4 py-2 text-left">Email</th>
            <th className="border border-navbar px-4 py-2 text-left">Cart Items</th>
            <th className="border border-navbar px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border border-navbar px-4 py-2">
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </td>
              <td className="border border-navbar px-4 py-2">{user.name}</td>
              <td className="border border-navbar px-4 py-2">{user.email}</td>
              <td className="border border-navbar px-4 py-2">
                {Object.keys(user.cartItems || {}).length}
              </td>
              <td className="border border-navbar px-4 py-2">
                <button
                  onClick={() => clearCart(user._id)}
                  className="bg-nbutton px-3 py-1 rounded"
                >
                  Clear Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
