"use client";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

/* resize image before upload */
async function resizeImage(file, maxWidth, maxHeight) {
  const img = new Image();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Page() {
  /* form state */
  const [form_data, set_form_data] = useState({
    full_name: "",
    position: "",
    company_assigned: "",
    expiry_date: "",
    sss_no: "",
    tin_no: "",
    emergency_name: "",
    emergency_address: "",
    emergency_contact_number: "",
    employee_photo_file: null,
    signature_file: null,
  });

  const [employee_photo_preview, set_employee_photo_preview] = useState(null);
  const [signature_preview, set_signature_preview] = useState(null);

  useEffect(() => {
    return () => {
      if (employee_photo_preview) URL.revokeObjectURL(employee_photo_preview);
      if (signature_preview) URL.revokeObjectURL(signature_preview);
    };
  }, [employee_photo_preview, signature_preview]);

  /* auto-format helpers */
  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{4})(\d{3})(\d{0,4})/, (_, a, b, c) =>
        c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a
      )
      .trim();
  };

  const formatSSS = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    return digits
      .replace(/(\d{2})(\d{7})(\d{0,1})/, (_, a, b, c) =>
        c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a
      )
      .trim();
  };

  const formatTIN = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    return digits
      .replace(/(\d{3})(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c, d) =>
        d ? `${a}-${b}-${c}-${d}` : c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a
      )
      .trim();
  };

  /* input handler with live formatting */
  const handle_input = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "emergency_contact_number") formatted = formatPhone(value);
    else if (name === "sss_no") formatted = formatSSS(value);
    else if (name === "tin_no") formatted = formatTIN(value);

    set_form_data((p) => ({ ...p, [name]: formatted }));
  };

  const handle_file = async (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;

    let base64 = await resizeImage(file, 600, 600);
    set_form_data((p) => ({ ...p, [name]: file }));

    if (name === "employee_photo_file") set_employee_photo_preview(base64);
    if (name === "signature_file") set_signature_preview(base64);
  };

  /* refs & toggle */
  const card_ref = useRef(null);
  const [is_front, set_is_front] = useState(true);

  /* print card */
  const print_card = async () => {
    if (!card_ref.current) return alert("No card to print");
    try {
      const ensure_images_loaded = async () => {
        const imgs = card_ref.current.querySelectorAll("img");
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

      set_is_front(true);
      await new Promise((r) => setTimeout(r, 700));
      await ensure_images_loaded();

      const front = await htmlToImage.toPng(card_ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "white",
      });

      set_is_front(false);
      await new Promise((r) => setTimeout(r, 700));
      await ensure_images_loaded();

      const back = await htmlToImage.toPng(card_ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "white",
      });

      set_is_front(true);

      const print_window = window.open("", "_blank");
      if (!print_window) return alert("Pop-up blocked.");

      print_window.document.write(`
        <html><head><title>Print ID</title>
        <style>
          @page { size: auto; margin: 0; }
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: white; }
          .print-container { display: flex; flex-direction: row; gap: 0.5in; }
          img { width: 2.125in; height: 3.375in; object-fit: contain; }
        </style></head>
        <body>
          <div class="print-container">
            <img src="${front}" />
            <img src="${back}" />
          </div>
          <script>window.onload = () => window.print()</script>
        </body></html>
      `);
      print_window.document.close();
    } catch (err) {
      console.error("print error", err);
      alert("Printing failed — see console.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Employee & Back Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Full name" name="full_name" value={form_data.full_name} onChange={handle_input} />
            <Input label="Position" name="position" value={form_data.position} onChange={handle_input} />
            <Input label="Company assigned" name="company_assigned" value={form_data.company_assigned} onChange={handle_input} />
            <FileInput label="Upload employee photo (1×1)" name="employee_photo_file" onChange={handle_file} />
            <FileInput label="Upload signature image" name="signature_file" onChange={handle_file} />
          </div>

          <hr className="my-2" />
          <h3 className="font-semibold">Back-side details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input type="date" label="Expiry date" name="expiry_date" value={form_data.expiry_date} onChange={handle_input} min={today} />
            <Input label="SSS no." name="sss_no" value={form_data.sss_no} onChange={handle_input} placeholder="12-3456789-0" />
            <Input label="TIN no." name="tin_no" value={form_data.tin_no} onChange={handle_input} placeholder="123-456-789-000" />
            <Input className="md:col-span-3" label="Emergency contact — full name" name="emergency_name" value={form_data.emergency_name} onChange={handle_input} />
            <Input className="md:col-span-2" label="Emergency contact — address" name="emergency_address" value={form_data.emergency_address} onChange={handle_input} />
            <Input label="Emergency contact — contact number" name="emergency_contact_number" value={form_data.emergency_contact_number} onChange={handle_input} placeholder="0912 345 6789" />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => set_is_front(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Show Front</button>
            <button onClick={() => set_is_front(false)} className="px-3 py-2 border rounded">Show Back</button>
            <button onClick={print_card} className="px-3 py-2 bg-red-600 text-white rounded">Print</button>
          </div>
        </section>

        <aside className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-2">Live preview</p>
          <div ref={card_ref} className="relative w-[340px] h-[540px] bg-white border rounded-lg overflow-hidden">
            {is_front ? (
              <Front_side form_data={form_data} employee_photo_src={employee_photo_preview} signature_src={signature_preview} />
            ) : (
              <Back_side form_data={form_data} />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

/* reusable inputs */
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-700">{label}</label>
      <input {...props} className="w-full border rounded p-2" />
    </div>
  );
}

function FileInput({ label, name, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <input type="file" name={name} accept="image/*" onChange={onChange} className="w-full" />
    </div>
  );
}

/* front side of id */
function Front_side({ form_data, employee_photo_src, signature_src }) {
  const [logo_src, set_logo_src] = useState("/company-logo.png");

  return (
    <div className="w-full h-full flex flex-col">
      {/* header */}
      <div className="flex items-center bg-blue-900 text-white p-3">
        <div className="w-16 h-16 flex-shrink-0 mr-2">
          <img
            src={logo_src}
            alt="company logo"
            className="w-full h-full object-contain bg-gray-200"
            onError={() =>
              set_logo_src(
                "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23ccc'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10'>LOGO</text></svg>"
              )
            }
          />
        </div>
        <div className="leading-tight">
          <div className="text-lg font-extrabold tracking-tight">WORKSAVERS</div>
          <div className="text-sm font-semibold -mt-0.5">PERSONNEL SERVICES INC.</div>
          <div className="text-[10px] mt-1 leading-tight">
            Worksavers Bldg. #7827 S. Javier St. Cor. M. Ocampo St.
            <br />
            Pio Del Pilar, Makati City
            <br />
            Tel. 8937307, 8122608, 8122022 • Telefax 893-7304
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-28 h-28 bg-gray-100 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center mb-4">
          {employee_photo_src ? (
            <img src={employee_photo_src} alt="employee" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">1×1 PHOTO</span>
          )}
        </div>

        <div className="text-center mb-4 space-y-2">
          <div className="font-bold text-xl uppercase">{form_data.full_name || "Full Name"}</div>
          <div className="text-sm font-semibold">{form_data.position || "Position"}</div>
          <div className="text-sm font-semibold">{form_data.company_assigned || "Company Assigned"}</div>
        </div>

        {/* signature */}
        <div className="mt-2 w-full text-center">
          {signature_src ? (
            <>
              <img src={signature_src} alt="signature" className="w-32 mx-auto mb-[-4px]" />
              <div className="border-t border-gray-700 w-40 mx-auto"></div>
              <div className="text-xs mt-1 text-gray-600">Signature</div>
            </>
          ) : (
            <>
              <div className="border-t border-gray-700 w-40 mx-auto"></div>
              <div className="text-xs mt-1 text-gray-600">Signature</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* back side of id */
function Back_side({ form_data }) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 text-gray-800">
      <div className="space-y-2 text-sm">
        <div>
          <strong>Expiry Date:</strong> {form_data.expiry_date || "—"}
        </div>
        <div>
          <strong>SSS No.:</strong> {form_data.sss_no || "—"}
        </div>
        <div>
          <strong>TIN No.:</strong> {form_data.tin_no || "—"}
        </div>
      </div>

      <div className="mt-2 text-sm">
        <div className="font-semibold">In Case of Emergency:</div>
        <div>{form_data.emergency_name || "Full name"}</div>
        <div className="text-xs">{form_data.emergency_address || "Address"}</div>
        <div className="mt-1">Contact: {form_data.emergency_contact_number || "—"}</div>
      </div>

      <div className="text-sm leading-tight text-center mt-4 font-bold">
        THIS IDENTIFICATION CARD BELONGS TO THE COMPANY AND MUST BE SURRENDERED UPON RESIGNATION OR TERMINATION OF EMPLOYMENT AS A REQUIREMENT FOR CLEARANCE.
      </div>

      <div className="text-center mt-2">
        <div className="border-t border-gray-700 w-36 mx-auto"></div>
        <div className="text-xs font-semibold mt-1">MARLENE C. SENDO</div>
        <div className="text-[11px] text-gray-600 -mt-1">President</div>
      </div>
    </div>
  );
}
