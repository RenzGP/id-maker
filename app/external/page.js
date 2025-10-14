"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import companyLogo from "@/public/company-logo.png";
import hexBg from "@/public/hex-bg.png";
import * as htmlToImage from "html-to-image";

export default function ExternalPage() {
  const [showBack, setShowBack] = useState(false);
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [companyAssigned, setCompanyAssigned] = useState("");
  const [photo, setPhoto] = useState(null);

  const [fullNameSize, setFullNameSize] = useState(16);
  const [positionSize, setPositionSize] = useState(11);
  const idRef = useRef(null);

  const saveImage = async () => {
    if (!idRef.current) return;
    const dataUrl = await htmlToImage.toPng(idRef.current, { quality: 1 });
    const link = document.createElement("a");
    link.download = `${fullName || "external-id"}.png`;
    link.href = dataUrl;
    link.click();
  };

  const printBothSides = async () => {
    const front = document.getElementById("front-id");
    const back = document.getElementById("back-id");

    if (!front || !back) return;

    const frontImg = await htmlToImage.toPng(front, { quality: 1 });
    const backImg = await htmlToImage.toPng(back, { quality: 1 });

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head><title>Print ID</title></head>
      <body style="margin:0;display:flex;flex-direction:column;align-items:center;">
        <img src="${frontImg}" style="width:340px;height:auto;margin-bottom:10px;" />
        <img src="${backImg}" style="width:340px;height:auto;" />
        <script>window.print()</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 py-10 font-roboto relative">
      {/* Go Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-800 transition-all duration-200"
      >
        <i className="fa-solid fa-arrow-left text-sm"></i>
        <span className="text-sm font-medium">Go Back Home</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-8">
        External Employee — ID Builder
      </h1>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 px-6">
        {/* ID Preview */}
        <div className="flex justify-center">
          <div ref={idRef}>
            {!showBack ? (
              <div
                id="front-id"
                className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300"
              >
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

                {/* Company Logo */}
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

                {/* Photo */}
                <div className="absolute left-1/2 top-[180px] -translate-x-1/2 flex flex-col items-center text-center z-10">
                  <div className="w-[130px] h-[130px] border-[3px] border-gray-400 rounded-md overflow-hidden mb-3 flex items-center justify-center bg-gray-200">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Uploaded"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <p className="text-[10px] text-gray-500">Photo Here</p>
                    )}
                  </div>

                  {/* Name and Info */}
                  <div className="mt-1">
                    <p
                      className="font-bold text-red-700 leading-tight"
                      style={{ fontSize: `${fullNameSize}px` }}
                    >
                      {fullName || "FULL NAME"}
                    </p>
                    <p
                      className="text-gray-700 tracking-wider"
                      style={{ fontSize: `${positionSize}px` }}
                    >
                      {position || "POSITION"}
                    </p>
                    <p
                      className="text-gray-700 tracking-wider"
                      style={{ fontSize: `${positionSize}px` }}
                    >
                      {companyAssigned || "COMPANY ASSIGNED"}
                    </p>
                  </div>
                </div>

                {/* Signature Line */}
                <div className="absolute bottom-[90px] w-full text-center">
                  <div className="border-t border-gray-700 w-[180px] mx-auto mb-1"></div>
                  <p className="text-[10px] text-gray-800">Signature</p>
                </div>

                {/* Footer Bar */}
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
            ) : (
              <div
                id="back-id"
                className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300"
              >
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
                    THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE
                    SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A
                    REQUIREMENT FOR CLEARANCE.
                  </p>
                </div>

                {/* Signature Section */}
                <div className="px-6 text-center mt-8 mb-12 z-10">
                  <div className="border-t border-gray-700 w-[220px] mx-auto mb-1"></div>
                  <p className="font-bold text-[11px] text-gray-900">
                    CHARMAINE C. EDIRISINGHE
                  </p>
                  <p className="text-[9px] text-gray-700">Treasurer</p>
                </div>

                {/* Footer Bar */}
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

        {/* ID Controls */}
        <div className="bg-white shadow-md rounded-xl p-6 lg:w-[820px]">
          <h2 className="text-lg font-semibold mb-4 text-center">ID Controls</h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setShowBack(false)}
              className={`px-4 py-2 rounded-md font-medium ${
                !showBack ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setShowBack(true)}
              className={`px-4 py-2 rounded-md font-medium ${
                showBack ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Back
            </button>

            
          {/* Buttons */}

            <button
              onClick={saveImage}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Save Image
            </button>
            <button
              onClick={printBothSides}
              className="px-3 py-2 bg-red-600 text-white rounded"
            >
              Print Both Sides
            </button>

          </div>

          {/* Font Size Sliders */}
          <label className="block text-sm font-semibold">
            Full Name Font Size: {fullNameSize}px
          </label>
          <input
            type="range"
            min="10"
            max="30"
            value={fullNameSize}
            onChange={(e) => setFullNameSize(e.target.value)}
            className="w-full mb-4"
          />

          <label className="block text-sm font-semibold">
            Position Font Size: {positionSize}px
          </label>
          <input
            type="range"
            min="8"
            max="20"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
            className="w-full mb-4"
          />

          {/* Inputs */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border w-full p-2 mb-3 rounded-md"
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border w-full p-2 mb-3 rounded-md"
          />
          <input
            type="text"
            placeholder="Company Assigned"
            value={companyAssigned}
            onChange={(e) => setCompanyAssigned(e.target.value)}
            className="border w-full p-2 mb-3 rounded-md"
          />

          {/* Upload Photo */}
          <label className="block text-sm font-semibold mb-1">Upload Photo (2x2)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mb-4 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}
