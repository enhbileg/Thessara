'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 pb-16"> 
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-lg md:text-2xl lg:text-3xl text-gray-500">
              Your <span className="font-medium text-specialText">Cart</span>
            </p>
            <p className="text-sm md:text-lg lg:text-xl text-gray-500/80">
              {getCartCount()} Items
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-4 md:pb-6 md:px-4 px-1 text-[11px] md:text-sm text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-4 md:pb-6 md:px-4 px-1 text-[11px] md:text-sm text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-4 md:pb-6 md:px-4 px-1 text-[11px] md:text-sm text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-4 md:pb-6 md:px-4 px-1 text-[11px] md:text-sm text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  return (
                    <tr key={itemId}>
                      {/* Product details */}
                      <td className="flex items-center gap-4 py-3 md:py-4 md:px-4 px-1 bg-primary">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-12 md:w-16 h-auto object-cover"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-[10px] text-specialText mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-xs md:text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <button
                            className="text-[10px] md:text-xs text-specialText mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 md:py-4 md:px-4 px-1 text-[12px] md:text-sm text-gray-600">
                        ₮ {Number(product.offerPrice).toLocaleString("mn-MN")}
                      </td>

                      {/* Quantity */}
                      <td className="py-3 md:py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-3 h-3 md:w-4 md:h-4"
                            />
                          </button>
                          <input
                            onChange={e => updateCartQuantity(product._id, Number(e.target.value))}
                            type="number"
                            value={cartItems[itemId]}
                            className="w-6 md:w-8 border-blank text-center appearance-none bg-blank text-[12px] md:text-sm"
                          />
                          <button onClick={() => addToCart(product._id)}>
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-3 h-3 md:w-4 md:h-4"
                            />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-3 md:py-4 md:px-4 px-1 text-[12px] md:text-sm text-gray-600">
                        ₮{Number((product.offerPrice * cartItems[itemId]).toFixed(2)).toLocaleString("mn-MN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Continue shopping */}
          <button
            onClick={() => router.push('/all-products')}
            className="group flex items-center mt-6 gap-2 text-specialText text-sm md:text-base"
          >
            <Image
              className="group-hover:-translate-x-1 transition h-5 w-5 md:h-7 md:w-7"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        {/* Order summary */}
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
