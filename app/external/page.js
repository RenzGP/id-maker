"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import companyLogo from "@/public/company-logo-external.png";
import hexBg from "@/public/hex-bg.png";
import * as htmlToImage from "html-to-image";

export default function ExternalPage() {
  const [showBack, setShowBack] = useState(false);

  // FRONT SIDE FIELDS
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [companyAssigned, setCompanyAssigned] = useState("");
  const [photo, setPhoto] = useState(null);

  // BACK SIDE FIELDS
  const [idNo, setIdNo] = useState("");
  const [sssNo, setSssNo] = useState("");
  const [tinNo, setTinNo] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyAddress, setEmergencyAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // FONT SIZE SLIDERS
  const [fullNameSize, setFullNameSize] = useState(16);
  const [positionSize, setPositionSize] = useState(11);
  const [backDetailsSize, setBackDetailsSize] = useState(11);
  const [backEmergencySize, setBackEmergencySize] = useState(11);

  const idRef = useRef(null);

  // 🔧 SAVE CURRENTLY VISIBLE SIDE (front/back)
  const saveImage = async () => {
    const element = document.getElementById(showBack ? "back-id" : "front-id");
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 3,
        skipAutoScale: true,
        canvasWidth: 1020, // 340 * 3
        canvasHeight: 1560, // 520 * 3
        style: {
          transform: 'scale(1)',
        },
      });
      
      const link = document.createElement("a");
      link.download = `${fullName || "external-id"}-${showBack ? "back" : "front"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const ensureImagesLoaded = () => {
      return new Promise((resolve) => {
        const imgs = Array.from(document.images);
        if (imgs.length === 0) return resolve();
        let loaded = 0;
        imgs.forEach((img) => {
          if (img.complete) {
            loaded++;
            if (loaded === imgs.length) resolve();
          } else {
            img.onload = img.onerror = () => {
              loaded++;
              if (loaded === imgs.length) resolve();
            };
          }
        });
      });
    };

    const printBothSides = async () => {
      if (!idRef.current) return alert("No ID card to print");

      try {
        await ensureImagesLoaded();

        const frontShown = !showBack;
        if (!frontShown) setShowBack(false);
        await new Promise((r) => setTimeout(r, 300));
        await ensureImagesLoaded();

        const frontData = await htmlToImage.toPng(idRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor: "white",
          style: {
            fontFamily: "Roboto, sans-serif, 'Font Awesome 6 Free'",
          },
        });

        setShowBack(true);
        await new Promise((r) => setTimeout(r, 300));
        await ensureImagesLoaded();

        const backData = await htmlToImage.toPng(idRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor: "white",
          style: {
            fontFamily: "Roboto, sans-serif, 'Font Awesome 6 Free'",
          },
        });

        setShowBack(!frontShown);

        const printWindow = window.open("", "_blank");
        if (!printWindow) return alert("Pop-up blocked.");

        printWindow.document.write(`
          <html>
            <head>
              <title>Print ID</title>
              <link rel="stylesheet" href="/fa/css/all.min.css">
              <style>
                @page { size: auto; margin: 0; }
                body { margin: 0; display:flex; align-items:center; justify-content:center; height:100vh; background:white; }
                .container { display:flex; gap:0.5in; }
                img { width:2.125in; height:3.375in; object-fit:contain; }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${frontData}" />
                <img src="${backData}" />
              </div>
              <script>window.onload = () => { window.print(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (err) {
        console.error("Print error:", err);
        alert("Printing failed — check console.");
      }
    };

const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };


  // FORMATTERS
  const format_sss = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 10);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 9) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}-${numbers.slice(9)}`;
  };
  const format_tin = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 9);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };
  const format_contact = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7)}`;
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

      <h1 className="text-2xl font-semibold text-center mb-8">
        External Employee — ID Builder
      </h1>

      <div className="flex flex-col lg:flex-row justify-center gap-8 px-6">
        {/* ID PREVIEW */}
        <div className="flex justify-center">
          <div ref={idRef}>
            {!showBack ? (
              /* FRONT SIDE */
              <div
                key="front"
                id="front-id"
                className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300"
              >
                <div className="absolute left-[25px] top-[150px] bottom-0 w-[2px] bg-blue-900"></div>

                {/* Hex pattern LEFT */}
                <div className="absolute top-0 left-0 w-[180px] h-[140px] opacity-90 z-0">
                  <Image
                    src={hexBg}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority={true}
                    unoptimized={true}
                  />
                </div>

                {/* Company logo RIGHT */}
                <div className="absolute top-3 right-3 z-10">
                  <Image
                    src={companyLogo}
                    alt="Company Logo"
                    width={90}
                    height={90}
                    className="object-contain"
                    priority
                    crossOrigin="anonymous"
                  />
                </div>

                <div className="absolute top-[130px] w-full text-center z-10 leading-tight">
                  <p className="text-[15px] font-semibold text-gray-800 tracking-widest">
                    WORKSAVERS
                  </p>
                  <p className="text-[15px] font-semibold text-gray-800 tracking-widest">
                    PERSONNEL SVCS., INC.
                  </p>
                </div>

                <div className="absolute left-1/2 top-[180px] -translate-x-1/2 flex flex-col items-center text-center z-10">
                  <div className="w-[130px] h-[130px] border-[3px] border-gray-400 rounded-md overflow-hidden mb-3 flex items-center justify-center bg-gray-200">
                    {photo ? (
                      <img src={photo} alt="Uploaded" className="object-cover w-full h-full" />
                    ) : (
                      <p className="text-[10px] text-gray-500">Photo Here</p>
                    )}
                  </div>

                  <div className="mt-1">
                    <p className="font-bold text-red-700 leading-tight" style={{ fontSize: `${fullNameSize}px` }}>
                      {fullName || "FULL NAME"}
                    </p>
                    <p className="text-gray-700 tracking-wider" style={{ fontSize: `${positionSize}px` }}>
                      {position || "POSITION"}
                    </p>
                    <p className="text-gray-700 tracking-wider" style={{ fontSize: `${positionSize}px` }}>
                      {companyAssigned || "COMPANY ASSIGNED"}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-[90px] w-full text-center">
                  <div className="border-t border-gray-700 w-[180px] mx-auto mb-1"></div>
                  <p className="text-[10px] text-gray-800">Signature</p>
                </div>

                <div className="absolute bottom-[20px] left-0 w-full bg-[#a6192e] text-white py-1.5 px-5">
                  <p className="text-[9.5px] font-medium flex items-center gap-2">
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
              /* BACK SIDE */
              <div
                key="back"
                id="back-id"
                className="relative bg-white w-[340px] h-[520px] shadow-2xl rounded-lg overflow-hidden border border-gray-300"
              >
                <div className="absolute left-[24px] top-[150px] bottom-0 w-[2px] bg-blue-900"></div>

                {/* Hex pattern only (no logo) */}
                <div className="absolute top-0 left-0 w-[180px] h-[140px] opacity-90">
                  <Image
                    src={hexBg}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority={true}
                    unoptimized={true}
                  />
                </div>

                <div className="px-10 pt-36 text-[11px] text-gray-800 leading-relaxed z-10">
                  <p style={{ fontSize: `${backDetailsSize}px` }}>
                    <strong>ID NO:</strong> {idNo || "00000"}
                  </p>
                  <p style={{ fontSize: `${backDetailsSize}px` }}>
                    <strong>SSS NO:</strong> {sssNo || "00-0000000-0"}
                  </p>
                  <p style={{ fontSize: `${backDetailsSize}px` }}>
                    <strong>TIN NO:</strong> {tinNo || "000-000-000"}
                  </p>

                  <div className="my-3"></div>

                  <p className="font-semibold text-[11px]">
                    In case of Emergency Please Notify:
                  </p>
                  <p style={{ fontSize: `${backEmergencySize}px` }}>
                    <strong>Name:</strong> {emergencyName || "First M. Last"}
                  </p>
                  <p style={{ fontSize: `${backEmergencySize}px` }}>
                    <strong>Address:</strong> {emergencyAddress || "## St., City"}
                  </p>
                  <p style={{ fontSize: `${backEmergencySize}px` }}>
                    <strong>Contact No:</strong> {emergencyContact || "0900-000-0000"}
                  </p>

                  <div className="my-4"></div>

                  <p className="text-justify text-[10.5px]">
                    THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE
                    SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A
                    REQUIREMENT FOR CLEARANCE.
                  </p>
                </div>

                <div className="px-6 text-center mt-8 mb-12">
                  <div className="border-t border-gray-700 w-[220px] mx-auto mb-1"></div>
                  <p className="font-bold text-[11px] text-gray-900">
                    CHARMAINE C. EDIRISINGHE
                  </p>
                  <p className="text-[9px] text-gray-700">Treasurer</p>
                </div>

                <div className="absolute bottom-[20px] left-0 w-full bg-[#a6192e] text-white py-1.5 px-5">
                  <p className="text-[9.5px] font-medium flex items-center gap-2">
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

        {/* CONTROLS */}
        <div className="bg-white shadow-md rounded-xl p-6 lg:w-[820px]">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
            ID Controls
          </h2>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mb-6">
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
            <button onClick={saveImage} className="px-3 py-2 bg-green-600 text-white rounded">
              Save Image
            </button>
            <button onClick={printBothSides} className="px-3 py-2 bg-red-600 text-white rounded">
              Print Both Sides
            </button>
          </div>
          {/* Font Size sliders are shown below each group's inputs */}

          {/* FRONT INPUTS */}
          {!showBack ? (
            <div key="front-controls">
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value.toUpperCase())}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">Position</label>
              <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value.toUpperCase())}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">Company Assigned</label>
              <input
                type="text"
                placeholder="Company Assigned"
                value={companyAssigned}
                onChange={(e) => setCompanyAssigned(e.target.value.toUpperCase())}
                className="border w-full p-2 mb-3 rounded-md"
              />

              <label className="block text-sm font-semibold mb-1">
                Upload Photo (2x2)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mb-2 w-full text-sm"
              />

              {/* Front font size sliders (below front inputs) */}
              <div className="mt-3">
                <label className="block font-medium mb-1">
                  Full Name Font Size: {fullNameSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={fullNameSize}
                  onChange={(e) => setFullNameSize(Number(e.target.value))}
                  className="w-full mb-1"
                />

                <label className="block font-medium mb-1">
                  Position Font Size: {positionSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="20"
                  value={positionSize}
                  onChange={(e) => setPositionSize(Number(e.target.value))}
                  className="w-full mb-1"
                />
              </div>
            </div>
          ) : (
            /* BACK INPUTS */
            <div key="back-controls">
              <label className="block font-medium mb-1">ID No.</label>
              <input
                type="text"
                placeholder="ID No."
                value={idNo}
                onChange={(e) => setIdNo(e.target.value)}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">SSS No.</label>
              <input
                type="text"
                placeholder="SSS No."
                value={sssNo}
                onChange={(e) => setSssNo(format_sss(e.target.value))}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">TIN No.</label>
              <input
                type="text"
                placeholder="TIN No."
                value={tinNo}
                onChange={(e) => setTinNo(format_tin(e.target.value))}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">Emergency Contact Name</label>
              <input
                type="text"
                placeholder="Emergency Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value.toUpperCase())}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">Emergency Contact Address</label>
              <input
                type="text"
                placeholder="Emergency Contact Address"
                value={emergencyAddress}
                onChange={(e) => setEmergencyAddress(e.target.value)}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <label className="block font-medium mb-1">Emergency Contact Number</label>
              <input
                type="text"
                placeholder="Emergency Contact Number"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(format_contact(e.target.value))}
                className="border w-full p-2 mb-3 rounded-md"
              />

              {/* Back font size sliders (below back inputs) */}
              <div className="mt-3">
                <label className="block font-medium mb-1">
                  Back Details Font Size: {backDetailsSize}px
                </label>
                <input
                  type="range"
                  min="9"
                  max="16"
                  value={backDetailsSize}
                  onChange={(e) => setBackDetailsSize(Number(e.target.value))}
                  className="w-full mb-1"
                />

                <label className="block font-medium mb-1">
                  Emergency Details Font Size: {backEmergencySize}px
                </label>
                <input
                  type="range"
                  min="9"
                  max="16"
                  value={backEmergencySize}
                  onChange={(e) => setBackEmergencySize(Number(e.target.value))}
                  className="w-full mb-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
