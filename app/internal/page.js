"use client";

import { useState } from "react";
import Image from "next/image";
import companyLogo from "@/public/company-logo.png";

export default function InternalPage() {
  const [showBack, setShowBack] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-roboto">
      {/* Toggle Buttons - Matching external design */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowBack(false)}
          className={`px-4 py-2 rounded-md font-medium ${
            !showBack
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setShowBack(true)}
          className={`px-4 py-2 rounded-md font-medium ${
            showBack
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Back
        </button>
      </div>

      {/* ID Card */}
      <div className="relative bg-white shadow-xl border w-[340px] h-[540px] rounded-md flex overflow-hidden">
        {/* Left Section: Logo and blue bar */}
        <div className="flex flex-col items-center relative">
          {/* Company Logo OUTSIDE blue bar */}
          <div className="w-[55px] h-[70px] flex justify-center items-center bg-white">
            <Image
              src={companyLogo}
              alt="Logo"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Blue vertical bar with department text */}
          <div className="bg-blue-900 w-[55px] flex-1 flex flex-col justify-center items-center">
            <div
              className="rotate-[270deg] text-white font-roboto font-extrabold text-[26px] leading-none"
              style={{
                letterSpacing: "0.66em",
              }}
            >
              DEPARTMENT
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!showBack ? (
          /* ---------- FRONT SIDE ---------- */
          <div className="flex-1 flex flex-col items-center justify-between p-6 pb-4">
            {/* Header (WorkSavers logo + address) */}
            <div className="text-center mb-2">
              <h1
                className="worksavers-logo text-4xl text-blue-900 leading-none"
                style={{
                  fontFamily: "Greycliff Arabic CF, sans-serif",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Work<span className="text-red-600">savers</span>
              </h1>
              <p className="text-[9px] text-center leading-tight mt-1 text-black">
                7827 Worksavers Bldg., S. Javier St.<br />
                Brgy. Pio Del Pilar, Makati City, 1230<br />
                Tel. 8937307; 8122608; 8122022
              </p>
            </div>

            {/* Photo placeholder */}
            <div className="border-[3px] border-red-700 rounded-[12px] w-[192px] h-[192px] flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-t from-green-300 to-blue-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                Photo Here
              </div>
            </div>

            {/* WORKSAVERS label (moved below image) */}
            <div className="text-center mt-3">
              <p className="text-[10px] font-bold tracking-wide text-black">
                WORKSAVERS PERSONNEL SVCS., INC.
              </p>
            </div>

            {/* Employee Info */}
            <div className="text-center text-black">
              <p className="font-bold text-lg">FULL NAME</p>
              <p className="text-[11px] tracking-widest mb-2">POSITION</p>
              <p className="text-[11px] mb-4">ID NO</p>
              <div className="border-t border-black w-[120px] mx-auto mt-2"></div>
              <p className="text-[10px] mt-1">Signature</p>
            </div>
          </div>
        ) : (
          /* ---------- BACK SIDE ---------- */
          <div className="flex-1 flex flex-col justify-start p-5 pl-6 relative">
            <div className="ml-[15px] mt-16 text-[11px] text-black leading-tight space-y-1">
              <p>
                <strong>SSS No:</strong> 00-0000000-0
              </p>
              <p>
                <strong>TIN No:</strong> 000-000-000
              </p>

              {/* Emergency contact section */}
              <div className="mt-5">
                <p className="font-bold mb-1">
                  In case of Emergency Please Notify:
                </p>
                <p>
                  <strong>Name:</strong> First Name M.I. Last Name
                </p>
                <p>
                  <strong>Address:</strong> ## St. Brgy. Municipality, City
                </p>
                <p>
                  <strong>Contact No:</strong> 0900-000-0000
                </p>
              </div>

              {/* Notice */}
              <div className="mt-10 text-[10px] leading-snug text-justify tracking-[0.02em]">
                <p>
                  THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE
                  SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A
                  REQUIREMENT FOR CLEARANCE.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-10 flex flex-col items-center">
                <div className="border-t border-black w-[220px] mb-1"></div>
                <p className="font-bold text-[11px]">
                  CHARMAINE C. EDIRISINGHE
                </p>
                <p className="text-[9px]">Treasurer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
