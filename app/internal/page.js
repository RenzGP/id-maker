"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import company_logo from "@/public/company-logo.png";

export default function InternalPage() {
  const router = useRouter();
  const card_ref = useRef(null);

  const [show_back, set_show_back] = useState(false);

  // -------------------- FRONT SIDE STATES --------------------
  const [department, set_department] = useState("");
  const [full_name, set_full_name] = useState("");
  const [position, set_position] = useState("");
  const [id_no, set_id_no] = useState("");
  const [photo_url, set_photo_url] = useState("");

  // -------------------- BACK SIDE STATES --------------------
  const [sss_no, set_sss_no] = useState("");
  const [tin_no, set_tin_no] = useState("");
  const [emergency_name, set_emergency_name] = useState("");
  const [emergency_address, set_emergency_address] = useState("");
  const [emergency_contact, set_emergency_contact] = useState("");

  // -------------------- FONT SIZES --------------------
  const [font_size_dept, set_font_size_dept] = useState(26);
  const [font_size_name, set_font_size_name] = useState(18);
  const [font_size_position, set_font_size_position] = useState(11);
  const [font_size_back, set_font_size_back] = useState(11);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (photo_url) URL.revokeObjectURL(photo_url);
    };
  }, [photo_url]);

  // -------------------- IMAGE UPLOAD --------------------
  const handle_photo_upload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set_photo_url(reader.result || "");
    reader.readAsDataURL(file);
  };

  // -------------------- FORMATTERS --------------------
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

  // -------------------- IMAGE LOADING ENSURER --------------------
  const ensure_images_loaded = async (root) => {
    const imgs = (root || card_ref.current)?.querySelectorAll("img") || [];
    await Promise.all(
      Array.from(imgs).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  // -------------------- SAVE AS IMAGE --------------------
  const save_as_image = async () => {
    if (!card_ref.current) return alert("No card to save");
    try {
      await ensure_images_loaded();
      const data_url = await htmlToImage.toPng(card_ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "white",
        style: {
          fontFamily: "Greycliff Arabic CF, sans-serif, 'Font Awesome 6 Free'",
        },
      });
      const a = document.createElement("a");
      a.href = data_url;
      a.download = `${(full_name || "id-card").replace(/\s+/g, "_")}_id.png`;
      a.click();
    } catch (err) {
      console.error("Save image error:", err);
      alert("Saving image failed — check console.");
    }
  };

  // -------------------- PRINT BOTH SIDES --------------------
  const print_both_sides = async () => {
    if (!card_ref.current) return alert("No card to print");
    try {
      await ensure_images_loaded();

      const front_shown = !show_back;
      if (!front_shown) set_show_back(false);
      await new Promise((r) => setTimeout(r, 300));
      await ensure_images_loaded();

      const front_data = await htmlToImage.toPng(card_ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "white",
        style: { fontFamily: "Greycliff Arabic CF, sans-serif, 'Font Awesome 6 Free'" },
      });

      set_show_back(true);
      await new Promise((r) => setTimeout(r, 300));
      await ensure_images_loaded();

      const back_data = await htmlToImage.toPng(card_ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "white",
        style: { fontFamily: "Greycliff Arabic CF, sans-serif, 'Font Awesome 6 Free'" },
      });

      set_show_back(!front_shown);

      const print_window = window.open("", "_blank");
      if (!print_window) return alert("Pop-up blocked.");

      print_window.document.write(`
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
              <img src="${front_data}" />
              <img src="${back_data}" />
            </div>
            <script>window.onload = () => { window.print(); }</script>
          </body>
        </html>
      `);
      print_window.document.close();
    } catch (err) {
      console.error("Print error:", err);
      alert("Printing failed — check console.");
    }
  };

  // -------------------- COMPONENT RENDER --------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-roboto relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-blue-900 text-white px-3 py-2 rounded-md shadow-md hover:bg-blue-800 transition"
      >
        <i className="fa-solid fa-arrow-left text-sm" />
        <span className="text-sm font-medium">Go Back Home</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-6">Internal Employee — ID Builder</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------- LEFT: ID PREVIEW ---------- */}
          <div className="flex-shrink-0">
            <div
              ref={card_ref}
              className="relative bg-white shadow-xl border w-[340px] h-[540px] rounded-md flex overflow-hidden"
            >
              <div className="flex flex-col items-center relative">
                <div className="w-[55px] h-[70px] flex justify-center items-center bg-white">
                  <Image
                    src={company_logo}
                    alt="Logo"
                    width={60}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="bg-blue-900 w-[55px] flex-1 flex flex-col justify-center items-center">
                  <div
                    className="rotate-[270deg] text-white font-extrabold leading-none text-center"
                    style={{
                      letterSpacing: "0.5em",
                      fontSize: `${font_size_dept}px`,
                    }}
                  >
                    {department || "DEPARTMENT"}
                  </div>
                </div>
              </div>

              {!show_back ? (
                <div className="flex-1 flex flex-col items-center justify-between p-6 pb-4">
                  <div className="text-center mb-2">
                    <h1
                      className="worksavers-logo text-4xl text-blue-900 leading-none"
                      style={{
                        fontFamily:
                          "Greycliff Arabic CF, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Work<span className="text-red-600">savers</span>
                    </h1>
                    <div className="mt-1">
                      <p className="text-[10px] font-bold tracking-wide text-black">
                        WORKSAVERS PERSONNEL SVCS., INC.
                      </p>
                      <p className="text-[9px] leading-tight mt-1 text-black">
                        7827 Worksavers Bldg., S. Javier St.
                        <br />
                        Brgy. Pio Del Pilar, Makati City, 1230
                        <br />
                        Tel. 8937307; 8122608; 8122022
                      </p>
                    </div>
                  </div>

                  <div className="border-[3px] border-red-700 rounded-[12px] w-[192px] h-[192px] flex items-center justify-center overflow-hidden bg-gray-200">
                    {photo_url ? (
                      <img
                        src={photo_url}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-600">Photo Here</div>
                    )}
                  </div>

                  <div className="text-center text-black">
                    <p
                      className="font-bold"
                      style={{ fontSize: `${font_size_name}px` }}
                    >
                      {full_name || "FULL NAME"}
                    </p>
                    <p
                      className="tracking-widest mb-2"
                      style={{ fontSize: `${font_size_position}px` }}
                    >
                      {position || "POSITION"}
                    </p>
                    <p className="text-[11px] mb-4">{id_no || "ID NO"}</p>
                    <div className="border-t border-black w-[120px] mx-auto mt-2" />
                    <p className="text-[10px] mt-1">Signature</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-start p-5 pl-6 relative">
                  <div
                    className="ml-[15px] mt-16 text-black leading-tight space-y-1"
                    style={{ fontSize: `${font_size_back}px` }}
                  >
                    <p>
                      <strong>SSS No:</strong> {sss_no || "00-0000000-0"}
                    </p>
                    <p>
                      <strong>TIN No:</strong> {tin_no || "000-000-000"}
                    </p>
                    <div className="mt-5">
                      <p className="font-bold mb-1">
                        In case of Emergency Please Notify:
                      </p>
                      <p>
                        <strong>Name:</strong>{" "}
                        {emergency_name || "First Name M.I. Last Name"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {emergency_address || "## St. Brgy. Municipality, City"}
                      </p>
                      <p>
                        <strong>Contact No:</strong>{" "}
                        {emergency_contact || "0900-000-0000"}
                      </p>
                    </div>
                    <div className="mt-10 text-[10px] leading-snug text-justify tracking-[0.02em]">
                      THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE
                      SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS
                      A REQUIREMENT FOR CLEARANCE.
                    </div>
                    <div className="mt-10 flex flex-col items-center">
                      <div className="border-t border-black w-[220px] mb-1" />
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

          {/* ---------- RIGHT: CONTROL PANEL ---------- */}
          <div className="flex-1 lg:w-[420px]">
            <div key={show_back ? "back-panel" : "front-panel"} className="bg-white shadow-md p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                ID Controls
              </h2>

              {/* Toolbar (one line, right-aligned like a toolbar) */}
                <div className="flex justify-center items-center gap-3 mb-4">
                  <button
                    onClick={() => set_show_back(false)}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      !show_back
                        ? "bg-blue-900 text-white shadow"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Front
                  </button>

                  <button
                    onClick={() => set_show_back(true)}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      show_back
                        ? "bg-blue-900 text-white shadow"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    onClick={save_as_image}
                    className="px-3 py-2 bg-green-600 text-white rounded"
                  >
                    Save Image
                  </button>

                  <button
                    onClick={print_both_sides}
                    className="px-3 py-2 bg-red-600 text-white rounded"
                  >
                    Print Both Sides
                  </button>
                </div>

              <div className="space-y-3 text-sm">
                {!show_back ? (
                  <div key="front">
                    <div>
                      <label className="block font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={full_name || ""}
                        onChange={(e) =>
                          set_full_name(e.target.value.toUpperCase())
                        }
                        className="w-full border rounded px-2 py-1 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Position</label>
                      <input
                        type="text"
                        placeholder="Enter position"
                        value={position || ""}
                        onChange={(e) =>
                          set_position(e.target.value.toUpperCase())
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ID No.</label>
                      <input
                        type="text"
                        placeholder="Enter ID number"
                        value={id_no || ""}
                        onChange={(e) => set_id_no(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Department</label>
                      <input
                        type="text"
                        placeholder="Enter department"
                        value={department || ""}
                        onChange={(e) =>
                          set_department(e.target.value.toUpperCase())
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Upload Photo (2x2)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handle_photo_upload}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Department Font Size: {font_size_dept}px
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="40"
                        value={font_size_dept}
                        onChange={(e) =>
                          set_font_size_dept(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Name Font Size: {font_size_name}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="30"
                        value={font_size_name}
                        onChange={(e) =>
                          set_font_size_name(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Position Font Size: {font_size_position}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="20"
                        value={font_size_position}
                        onChange={(e) =>
                          set_font_size_position(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div key="back">
                    <div>
                      <label className="block font-medium mb-1">SSS No.</label>
                      <input
                        type="text"
                        placeholder="00-0000000-0"
                        value={sss_no || ""}
                        onChange={(e) =>
                          set_sss_no(format_sss(e.target.value))
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">TIN No.</label>
                      <input
                        type="text"
                        placeholder="000-000-000"
                        value={tin_no || ""}
                        onChange={(e) =>
                          set_tin_no(format_tin(e.target.value))
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Emergency Name
                      </label>
                      <input
                        type="text"
                        placeholder="First Name M.I. Last Name"
                        value={emergency_name || ""}
                        onChange={(e) => set_emergency_name(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Emergency Address
                      </label>
                      <input
                        type="text"
                        placeholder="## St. Brgy. Municipality, City"
                        value={emergency_address || ""}
                        onChange={(e) => set_emergency_address(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Emergency Contact No.
                      </label>
                      <input
                        type="text"
                        placeholder="0900-000-0000"
                        value={emergency_contact || ""}
                        onChange={(e) =>
                          set_emergency_contact(format_contact(e.target.value))
                        }
                        className="w-full border rounded px-2 py-1"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Back Font Size: {font_size_back}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="20"
                        value={font_size_back}
                        onChange={(e) =>
                          set_font_size_back(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
