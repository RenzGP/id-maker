"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import company_logo from "@/public/company-logo.jpg";

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
  const [employee_signature, set_employee_signature] = useState("");
  const [signature_width_employee, set_signature_width_employee] = useState(120);
  const [signature_height_employee, set_signature_height_employee] = useState(40);

  // -------------------- BACK SIDE STATES --------------------
  const [sss_no, set_sss_no] = useState("");
  const [tin_no, set_tin_no] = useState("");
  const [emergency_name, set_emergency_name] = useState("");
  const [emergency_address, set_emergency_address] = useState("");
  const [emergency_contact, set_emergency_contact] = useState("");
  const [charmaine_signature, set_charmaine_signature] = useState("")
  const [signature_width_charmaine, set_signature_width_charmaine] = useState(160);
  const [signature_height_charmaine, set_signature_height_charmaine] = useState(50);

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

  // -------------------- SIGNATURE UPLOAD --------------------
  const handle_signature_upload = (e, setter) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => setter(reader.result || "");
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
      style: {
        fontFamily: "Greycliff Arabic CF, sans-serif, 'Font Awesome 6 Free'",
      },
    });

    set_show_back(true);
    await new Promise((r) => setTimeout(r, 300));
    await ensure_images_loaded();

    const back_data = await htmlToImage.toPng(card_ref.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "white",
      style: {
        fontFamily: "Greycliff Arabic CF, sans-serif, 'Font Awesome 6 Free'",
      },
    });

    // Restore previous state
    set_show_back(!front_shown);

    // Open print window
    const print_window = window.open("", "_blank");
    if (!print_window) return alert("Pop-up blocked.");

    // Constants for layout
    const CARD_WIDTH_IN = 2.125; // wider look
    const CARD_HEIGHT_IN = 3.375; // standard ID height
    const GAP_IN = 0.5;
    const PAGE_MARGIN_IN = 0.25;

    // 🔹 HTML must be inside a template literal (backticks)
    print_window.document.write(`
      <html>
        <head>
          <title>Print ID</title>
          <link rel="stylesheet" href="/fa/css/all.min.css">
          <style>
            @page {
              size: ${CARD_WIDTH_IN * 2 + GAP_IN + PAGE_MARGIN_IN * 2}in ${CARD_HEIGHT_IN + PAGE_MARGIN_IN * 2}in;
              margin: ${PAGE_MARGIN_IN}in;
            }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: white;
            }
            .container {
              display: flex;
              flex-direction: row;
              gap: ${GAP_IN}in;
            }
            img {
              width: ${CARD_WIDTH_IN}in;
              height: ${CARD_HEIGHT_IN}in;
              object-fit: contain;
              border: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${front_data}" />
            <img src="${back_data}" />
          </div>
          <script>
            window.onload = () => window.print();
          </script>
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
              <div className="flex flex-col items-center relative" style={{ height: "100%" }}>
                {/* Full vertical bar including logo */}
                <div
                  className="flex flex-col justify-start items-center"
                  style={{
                    width: "70px",
                    height: "100%",
                    backgroundColor: "#2b467d",
                  }}
                >
                  {/* Logo section with gray background */}
                  <div
                    className="w-full h-[85px] flex justify-center items-center"
                    style={{
                      backgroundColor: "#d9d9d9",
                    }}
                  >
                    <Image
                      src={company_logo}
                      alt="Logo"
                      width={60}
                      height={60}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Department label fills remaining space */}
                  <div className="flex-1 flex justify-center items-center">
                    <div
                      className="rotate-[270deg] text-white font-extrabold leading-none text-center whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        letterSpacing: "0.5em",
                        fontSize: `${font_size_dept}px`,
                        transformOrigin: "center center",
                        maxWidth: "400px", //adjust if needed
                      }}
                    >
                      {department || "DEPARTMENT"}
                    </div>
                  </div>
                </div>
              </div>
                {/* Main card area */}
                <div className="flex-1 flex justify-center items-start mt-4">
                  {!show_back ? (
                    <div className="flex flex-col items-center justify-between p-6 pb-4 w-[260px]">
                      <div className="text-center mb-2">
                        <h1
                          className="worksavers-logo text-4xl leading-none"
                          style={{
                            fontFamily: "Greycliff Arabic CF, sans-serif",
                            fontWeight: 700,
                            textTransform: "none", // ensures it keeps the original case
                          }}
                        >
                          <span style={{ color: "#2b467d" }}>Work</span>
                          <span style={{ color: "#a6033f" }}>savers</span>
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

                      <div className="border-[3px] border-[#a6033f] rounded-[24px] w-[192px] h-[192px] flex items-center justify-center overflow-hidden bg-gray-200 mb-3">
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


                      {/* Name & Position */}
                      <div className="text-center text-black mb-2">
                        <p
                          className="font-bold"
                          style={{ fontSize: `${font_size_name}px` }}
                        >
                          {full_name || "FULL NAME"}
                        </p>
                        <p
                          className="tracking-widest"
                          style={{ fontSize: `${font_size_position}px` }}
                        >
                          {position || "POSITION"}
                        </p>
                      </div>

                      {/* ID Number */}
                      <div className="text-center text-black mb-2">
                        <p className="text-[11px]">{id_no || "ID NO"}</p>
                      </div>

                      {/* Signature Section */}
                      <div className="text-center text-black mt-6">
                        {employee_signature ? (
                          <img
                            src={employee_signature}
                            alt="Employee Signature"
                            className="mx-auto mb-1"
                            style={{
                              width: `${signature_width_employee}px`,
                              height: `${signature_height_employee}px`,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            className="mx-auto mb-1 flex items-center justify-center text-[9px] text-gray-500 border border-gray-300 rounded"
                            style={{
                              width: `${signature_width_employee}px`,
                              height: `${signature_height_employee}px`,
                            }}
                          >
                            Signature Here
                          </div>
                        )}
                        <div className="border-t border-black w-[120px] mx-auto" />
                        <p className="text-[10px] mt-1">Signature</p>
                      </div>

                    </div>
                  ) : (
                    <div className="flex flex-col justify-start w-[260px] p-5 pl-6 relative">
                      <div
                        className="mt-16 text-black leading-tight space-y-1"
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
                          SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A
                          REQUIREMENT FOR CLEARANCE.
                        </div>

                        <div className="mt-10 flex flex-col items-center">
                          {charmaine_signature ? (
                            <img
                              src={charmaine_signature}
                              alt="Charmaine Signature"
                              className="mb-1"
                              style={{
                                width: `${signature_width_charmaine}px`,
                                height: `${signature_height_charmaine}px`,
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div
                              className="mb-1 flex items-center justify-center text-[9px] text-gray-500 border border-gray-300 rounded"
                              style={{
                                width: `${signature_width_charmaine}px`,
                                height: `${signature_height_charmaine}px`,
                              }}
                            >
                              Charmaine Signature
                            </div>
                          )}
                          <div className="border-t border-black w-[220px] mb-1" />
                          <p className="font-bold text-[11px]">CHARMAINE C. EDIRISINGHE</p>
                          <p className="text-[9px]">Treasurer</p>
                        </div>


                      </div>
                    </div>
                  )}
                </div>
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
                        className="border w-full p-2 mb-3 rounded-md uppercase"
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
                        className="border w-full p-2 mb-3 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ID No.</label>
                      <input
                        type="text"
                        placeholder="Enter ID number"
                        value={id_no || ""}
                        onChange={(e) => set_id_no(e.target.value)}
                        className="border w-full p-2 mb-3 rounded-md"
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
                        className="border w-full p-2 mb-3 rounded-md"
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
                      Upload Employee Signature
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handle_signature_upload(e, set_employee_signature)}
                      className="w-full"
                    />
                  </div>
                    <div className="mt-3">
                      <label className="block font-medium mb-1">
                        Department Font Size: {font_size_dept}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="30"
                        value={font_size_dept}
                        onChange={(e) =>
                          set_font_size_dept(Number(e.target.value))
                        }
                        className="w-full mb-1"
                      />

                      <label className="block font-medium mb-1">
                        Full Name Font Size: {font_size_name}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="20"
                        value={font_size_name}
                        onChange={(e) =>
                          set_font_size_name(Number(e.target.value))
                        }
                        className="w-full mb-1"
                      />

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
                        className="w-full mb-1"
                      />
                      {/* <p className="font-semibold text-[13px] mb-1">Employee Signature Size</p>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex flex-col text-[12px]">
                            Width: {signature_width_employee}px
                            <input
                              type="range"
                              min="60"
                              max="200"
                              value={signature_width_employee}
                              onChange={(e) => set_signature_width_employee(e.target.value)}
                            />
                          </label>
                          <label className="flex flex-col text-[12px]">
                            Height: {signature_height_employee}px
                            <input
                              type="range"
                              min="20"
                              max="100"
                              value={signature_height_employee}
                              onChange={(e) => set_signature_height_employee(e.target.value)}
                            />
                          </label>
                        </div> */}
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
                        className="border w-full p-2 mb-3 rounded-md"
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
                        className="border w-full p-2 mb-3 rounded-md"
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
                        onChange={(e) => set_emergency_name(e.target.value.toUpperCase())}
                        className="border w-full p-2 mb-3 rounded-md"
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
                        onChange={(e) => set_emergency_address(e.target.value.toUpperCase())}
                        className="border w-full p-2 mb-3 rounded-md"
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
                        className="border w-full p-2 mb-3 rounded-md"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block font-medium mb-1">
                        Upload Charmaine Signature
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handle_signature_upload(e, set_charmaine_signature)}
                        className="w-full"
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
                      {/* <p className="font-semibold text-[13px] mb-1">Charmaine Signature Size</p>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex flex-col text-[12px]">
                            Width: {signature_width_charmaine}px
                            <input
                              type="range"
                              min="60"
                              max="250"
                              value={signature_width_charmaine}
                              onChange={(e) => set_signature_width_charmaine(e.target.value)}
                            />
                          </label>
                          <label className="flex flex-col text-[12px]">
                            Height: {signature_height_charmaine}px
                            <input
                              type="range"
                              min="20"
                              max="120"
                              value={signature_height_charmaine}
                              onChange={(e) => set_signature_height_charmaine(e.target.value)}
                            />
                          </label>
                        </div> */}
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
