"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearCart = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/clear-cart`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        toast.success("Cart cleared successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to clear cart");
      }
    } catch (error) {
      toast.error("Error clearing cart");
    }
  };

  return (
    <div className="bg-blank border-blank p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-specialText">Users</h1>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block">
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
                    src={user.imageUrl || "/placeholder.png"}
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

      {/* ✅ Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-backBanner rounded-lg shadow-md p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={user.imageUrl || "/placeholder.png"}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-primary">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Cart Items: {Object.keys(user.cartItems || {}).length}
            </p>
            <button
              onClick={() => clearCart(user._id)}
              className="bg-nbutton px-3 py-2 rounded text-white text-sm"
            >
              Clear Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
