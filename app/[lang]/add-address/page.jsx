'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const ULAANBAATAR_DISTRICTS = [
  { en: "Bayangol", mn: "Баянгол" },
  { en: "Bayanzurkh", mn: "Баянзүрх" },
  { en: "Chingeltei", mn: "Чингэлтэй" },
  { en: "Khan-Uul", mn: "Хан-Уул" },
  { en: "Songinokhairkhan", mn: "Сонгинохайрхан" },
  { en: "Sukhbaatar", mn: "Сүхбаатар" },
  { en: "Nalaikh", mn: "Налайх" },
  { en: "Baganuur", mn: "Багануур" },
  { en: "Bagakhangai", mn: "Багахангай" }
];

export default function AddAddress() {
  const { getToken, router, language } = useAppContext();

  const [dict, setDict] = useState({});
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    city: "Ulaanbaatar",
       district: "",
          state: "",                              
    compoundBuilding: "",       
    apartment: "",              
    notes: ""                   
  });

  // Load dictionary by language
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();


    if (!address.district) return toast.error(dict.selectDistrictError || "Please select a district");
    if (!address.state) return toast.error(dict.enterKhorooError || "Please enter khoroo");
    if (!address.compoundBuilding) return toast.error(dict.enterCompoundError || "Please enter compound/building");
    if (!address.apartment) return toast.error(dict.enterApartmentError || "Please enter apartment/unit");
   

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `/${language}/api/user/add-address`,
        {address},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(dict.addressSuccess || "Address saved successfully!");
        router.push(`/${language}/cart`);
      } else {
        toast.error(data.message || dict.addressFailed || "Failed to save address");
      }
    } catch (error) {
      toast.error(dict.addressFailed || error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            {dict.addShippingAddress || "Add Shipping Address"}
          </p>

          <div className="space-y-3 max-w-xl mt-10">
            {/* Full name */}
<input
  type="text"
  placeholder={dict.fullName || "Full name"}
  value={address.fullName}
  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.fullName ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

{/* Phone number */}
<input
  type="text"
  placeholder={dict.phoneNumber || "Phone number"}
  value={address.phoneNumber}
  onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.phoneNumber ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

{/* District (UB) */}
<select
  value={address.district}
  onChange={(e) => setAddress({ ...address, district: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.district ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
>
  <option value="">{dict.ulaanbaatarDistrict || "District (Ulaanbaatar)"}</option>
  {ULAANBAATAR_DISTRICTS.map((d) => (
    <option key={d.en} value={d.en}>
      {d.en} / {d.mn}
    </option>
  ))}
</select>

{/* Khoroo */}
<input
  type="text"
  placeholder={dict.khoroo || "Хороо"}
  value={address.state}
  onChange={(e) => setAddress({ ...address, state: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.state ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

{/* Compound / Building */}
<input
  type="text"
  placeholder={dict.compoundBuilding || "Хотхон / Байр"}
  value={address.compoundBuilding}
  onChange={(e) => setAddress({ ...address, compoundBuilding: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.compoundBuilding ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

{/* Apartment / Unit */}
<input
  type="text"
  placeholder={dict.apartment || "Тоот"}
  value={address.apartment}
  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full
    ${address.apartment ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

{/* Optional notes */}
<textarea
  rows={3}
  placeholder={dict.notes || "Additional notes (optional)"}
  value={address.notes}
  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
  className={`px-2 py-2.5 bg-backBanner focus:border-primary transition border border-gray-500/30 rounded outline-none w-full resize-none
    ${address.notes ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
/>

            </div>


          <button
            type="submit"
            className="max-w-sm h-10 w-full mt-6 rounded-3xl bg-button text-primary uppercase"
          >
            {dict.saveAddress || "Save address"}
          </button>
        </form>

        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
      <Footer />
    </>
  );
}
