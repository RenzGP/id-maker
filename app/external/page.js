"use client";
import { useState } from "react";
import Image from "next/image";
import companyLogo from "@/public/company-logo.png";
import hexBg from "@/public/hex-bg.png";

export default function ExternalPage() {
  const [showBack, setShowBack] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 font-roboto">

      {/* Toggle Buttons */}
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

      <div className="relative">
        {/* FRONT SIDE */}
        {!showBack && (
          <div className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300">
            {/* Vertical Blue Line */}
              <div className="absolute left-[25px] top-[150px] bottom-0 w-[2px] bg-blue-900"></div>

            {/* Hex Background */}
            <div className="absolute top-0 left-0 w-[180px] h-[140px] opacity-90">
              <Image
                src={hexBg}
                alt="Decorative background"
                width={180}
                height={140}
                className="object-contain object-left-top"
              />
            </div>

            {/* Company Logo - top right */}
            <div className="absolute top-5 right-5 z-10">
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={90}
                height={90}
                className="object-contain"
              />
            </div>

            {/* Company Name */}
           <div className="absolute top-[130px] w-full text-center z-10 leading-tight">
            <p
              className="text-[15px] font-semibold text-gray-800 tracking-widest mt-[-2px]"
              style={{ fontFamily: "Greycliff Arabic CF, sans-serif" }}
            >
              WORKSAVERS
            </p>
            <p className="text-[15px] font-semibold text-gray-800 tracking-widest mt-[-2px]">
              PERSONNEL SVCS., INC.
            </p>
          </div>

            {/* Employee Photo */}
            <div className="absolute left-1/2 top-[180px] -translate-x-1/2 flex flex-col items-center text-center z-10">
              <div className="w-[130px] h-[130px] border-[3px] border-gray-400 rounded-md overflow-hidden mb-3 flex items-center justify-center bg-gray-200">
                <p className="text-[10px] text-gray-500">Photo Here</p>
              </div>

              {/* Name & Position */}
              <div className="mt-1">
                <p className="font-bold text-[16px] text-red-700 leading-tight">
                  FULL NAME
                </p>
                <p className="text-[11px] text-gray-700 tracking-wider">
                  POSITION
                </p>
                <p className="text-[11px] text-gray-700 tracking-wider">
                  COMPANY ASSIGNED
                </p>
              </div>
            </div>

            {/* Signature Line */}
            <div className="absolute bottom-[90px] w-full text-center">
              <div className="border-t border-gray-700 w-[180px] mx-auto mb-1"></div>
              <p className="text-[10px] text-gray-800">Signature</p>
            </div>

            {/* Floating Bottom Bar */}
            <div className="absolute bottom-[20px] left-0 w-full bg-[#a6192e] text-white py-1.5 px-5 text-left shadow-lg">
              <p className="text-[9.5px] font-medium leading-tight flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                7827 Worksavers Bldg., S. Javier St., Pio Del Pilar, Makati City
              </p>
              <p className="text-[8.5px] flex items-center gap-2">
                <i className="fa-solid fa-phone"></i>
                Tel. 8937307; 8122608; 8122022
              </p>
            </div>
          </div>
        )}

        {/* BACK SIDE */}
        {showBack && (
          <div className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300">
            {/* Vertical Blue Line */}
              <div className="absolute left-[24px] top-[150px] bottom-0 w-[2px] bg-blue-900"></div>

            {/* Hex Background */}
            <div className="absolute top-0 left-0 w-[180px] h-[140px] opacity-90">
              <Image
                src={hexBg}
                alt="Decorative background"
                width={180}
                height={140}
                className="object-contain object-left-top"
              />
            </div>

            {/* Info Section */}
            <div className="px-10 pt-36 text-[11px] text-gray-800 leading-relaxed z-10">
              <p>
                <strong>ID NO:</strong> 00000
              </p>
              <p>
                <strong>SSS NO:</strong> 00-0000000-0
              </p>
              <p>
                <strong>TIN NO:</strong> 000-000-000
              </p>

              <div className="my-3"></div>

              <p className="font-semibold text-[11px]">
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

              <div className="my-4"></div>

              <p className="text-justify text-[10.5px]">
                THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE SURRENDERED
                UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A REQUIREMENT FOR
                CLEARANCE.
              </p>
            </div>

            {/* Signature Section - Lowered */}
            <div className="px-6 text-center mt-8 mb-12 z-10">
              <div className="border-t border-gray-700 w-[220px] mx-auto mb-1"></div>
              <p className="font-bold text-[11px] text-gray-900">
                CHARMAINE C. EDIRISINGHE
              </p>
              <p className="text-[9px] text-gray-700">Treasurer</p>
            </div>

            {/* Floating Bottom Bar */}
            <div className="absolute bottom-[20px] left-0 w-full bg-[#a6192e] text-white py-1.5 px-5 text-left shadow-lg">
              <p className="text-[9.5px] font-medium leading-tight flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                7827 Worksavers Bldg., S. Javier St., Pio Del Pilar, Makati City
              </p>
              <p className="text-[8.5px] flex items-center gap-2">
                <i className="fa-solid fa-phone"></i>
                Tel. 8937307; 8122608; 8122022
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
