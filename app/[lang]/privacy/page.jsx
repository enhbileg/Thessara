// app/privacy/page.jsx
"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

export default function PrivacyPage() {
  const router = useRouter();
  const { language } = useAppContext();
  const [dict, setDict] = useState({});

  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  return (
    <>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {dict.back || "← Back"}
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {dict.privacyPolicy || "Privacy Policy"}
        </h1>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.introPrivacy}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.infoWeCollect || "Information We Collect"}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.infoWeCollectText}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.howWeUse || "How We Use Your Information"}
        </h2>
        <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
          {(dict.useList || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.dataProtection || "Data Protection"}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.dataProtectionText}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.sharingInfo || "Sharing of Information"}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.sharingInfoText}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.yourRights || "Your Rights"}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.yourRightsText}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.changesPolicy || "Changes to This Policy"}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {dict.changesPolicyText}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          {dict.contactUs || "Contact Us"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {dict.contactUsText}
        </p>
      </section>
    </>
  );
}
