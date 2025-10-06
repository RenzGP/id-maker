"use client";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

export default function Page() {
  const [form_data, set_form_data] = useState({
    // front fields
    full_name: "",
    position: "",
    company_assigned: "",
    signature_text: "",
    address: "",
    contact_number: "",

    // back fields
    expiry_date: "",
    sss_no: "",
    tin_no: "",

    // emergency contact (full name, address, contact number)
    emergency_name: "",
    emergency_address: "",
    emergency_contact_number: "",

    // files (store File objects)
    company_logo_file: null,
    employee_photo_file: null,
  });

  // previews for files (object URLs)
  const [company_logo_preview, set_company_logo_preview] = useState(null);
  const [employee_photo_preview, set_employee_photo_preview] = useState(null);

  // keep track of previous object URLs to revoke them
  useEffect(() => {
    return () => {
      if (company_logo_preview) try { URL.revokeObjectURL(company_logo_preview); } catch {}
      if (employee_photo_preview) try { URL.revokeObjectURL(employee_photo_preview); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // regular text input handler
  const handle_input = (e) => {
    const { name, value } = e.target;
    set_form_data((p) => ({ ...p, [name]: value }));
  };

  // numeric input handler (blocks letters)
  const handle_number_input = (e) => {
    const { name, value } = e.target;
    // allow only digits and dashes
    const cleaned = value.replace(/[^0-9\-]/g, "");
    set_form_data((p) => ({ ...p, [name]: cleaned }));
  };

  const handle_file = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    set_form_data((p) => ({ ...p, [name]: file }));

    if (name === "company_logo_file") {
      if (company_logo_preview) try { URL.revokeObjectURL(company_logo_preview); } catch {}
      if (file) {
        const url = URL.createObjectURL(file);
        set_company_logo_preview(url);
      } else set_company_logo_preview(null);
    }

    if (name === "employee_photo_file") {
      if (employee_photo_preview) try { URL.revokeObjectURL(employee_photo_preview); } catch {}
      if (file) {
        const url = URL.createObjectURL(file);
        set_employee_photo_preview(url);
      } else set_employee_photo_preview(null);
    }
  };

  const card_ref = useRef(null);
  const [is_front, set_is_front] = useState(true);

  const download_png = async () => {
    if (!card_ref.current) return alert("No card to export");
    try {
      const data_url = await htmlToImage.toPng(card_ref.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `${form_data.full_name || "id-card"}.png`;
      link.href = data_url;
      link.click();
    } catch (err) {
      console.error("export error", err);
      alert("Export failed — check console (CORS issues possible with external images).");
    }
  };

  // helper to get preview src, fallback to public asset
  const src_for = (preview_url, fallback_path) => {
    if (preview_url) return preview_url;
    return fallback_path || null;
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT: FORM (takes 2 cols on large screens) ===== */}
        <section className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Employee & Back Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Full name</label>
              <input
                name="full_name"
                value={form_data.full_name}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Juan Dela Cruz"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Position</label>
              <input
                name="position"
                value={form_data.position}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Service Crew"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Company assigned</label>
              <input
                name="company_assigned"
                value={form_data.company_assigned}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Branch / Unit"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Signature (printed)</label>
              <input
                name="signature_text"
                value={form_data.signature_text}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Printed signature text"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Upload employee photo (1×1)</label>
              <input
                name="employee_photo_file"
                type="file"
                accept="image/*"
                onChange={handle_file}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Use close-cropped headshot for best results.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700">Upload company logo (optional)</label>
              <input
                name="company_logo_file"
                type="file"
                accept="image/*"
                onChange={handle_file}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Replace /public/company-logo.png by uploading here (preview only). To change permanently, replace the file in /public.
              </p>
            </div>
          </div>

          <hr className="my-2" />

          <h3 className="font-semibold">Back-side details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Expiry date</label>
              <input
                type="date"
                name="expiry_date"
                value={form_data.expiry_date}
                onChange={handle_input}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">SSS no.</label>
              <input
                name="sss_no"
                value={form_data.sss_no}
                onInput={handle_number_input} // numeric only
                className="w-full border rounded p-2"
                placeholder="12-3456789-0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">TIN no.</label>
              <input
                name="tin_no"
                value={form_data.tin_no}
                onInput={handle_number_input} // numeric only
                className="w-full border rounded p-2"
                placeholder="123-456-789"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm text-gray-700">Emergency contact — full name</label>
              <input
                name="emergency_name"
                value={form_data.emergency_name}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Full name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700">Emergency contact — address</label>
              <input
                name="emergency_address"
                value={form_data.emergency_address}
                onChange={handle_input}
                className="w-full border rounded p-2"
                placeholder="Address"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Emergency contact — contact number</label>
              <input
                name="emergency_contact_number"
                value={form_data.emergency_contact_number}
                onInput={handle_number_input} // numeric only
                className="w-full border rounded p-2"
                placeholder="0917-xxx-xxxx"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => set_is_front(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Show Front</button>
            <button onClick={() => set_is_front(false)} className="px-3 py-2 border rounded">Show Back</button>
            <button onClick={download_png} className="px-3 py-2 bg-green-600 text-white rounded">Download PNG</button>
          </div>
        </section>

        {/* ===== RIGHT: LIVE PREVIEW (vertical ID) ===== */}
        <aside className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-2">Live preview</p>

          <div ref={card_ref} className="relative w-[340px] h-[540px] bg-white border rounded-lg overflow-hidden">
            {is_front ? (
              <Front_side
                form_data={form_data}
                company_logo_src={src_for(company_logo_preview, "/company-logo.png")}
                employee_photo_src={src_for(employee_photo_preview, null)}
              />
            ) : (
              <Back_side form_data={form_data} />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center max-w-[340px]">
            Replace <code>/public/company-logo.png</code> to permanently change the logo.
          </p>
        </aside>
      </div>
    </main>
  );
}

/* ------------------ FRONT SIDE COMPONENT ------------------ */
function Front_side({ form_data, company_logo_src, employee_photo_src }) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* header */}
      <div className="flex items-center bg-blue-900 text-white p-3">
        <div className="w-16 h-16 flex-shrink-0 mr-2">
          {company_logo_src ? (
            <img src={company_logo_src} alt="company logo" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">LOGO</div>
          )}
        </div>

        <div className="leading-tight">
          <div className="text-lg font-extrabold tracking-tight">WORKSAVERS</div>
          <div className="text-sm font-semibold -mt-0.5">PERSONNEL SERVICES INC.</div>
          <div className="text-[10px] mt-1 leading-tight">
            Worksavers Bldg. #7827 S. Javier St. Cor. M. Ocampo St.<br />
            Pio Del Pilar, Makati City<br />
            Tel. 8937307, 8122608, 8122022 • Telefax 893-7304
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* photo */}
        <div className="w-28 h-28 bg-gray-100 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center mb-4">
          {employee_photo_src ? (
            <img src={employee_photo_src} alt="employee" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">1×1 PHOTO</span>
          )}
        </div>

        {/* main info */}
        <div className="text-center mb-4 space-y-2">
          <div className="font-bold text-xl uppercase">{form_data.full_name || "Full Name"}</div>
          <div className="text-sm font-semibold">{form_data.position || "Position"}</div>
          <div className="text-sm font-semibold">{form_data.company_assigned || "Company Assigned"}</div>
        </div>

        {/* signature */}
        <div className="mt-4 w-full text-center">
          <div className="border-t border-gray-700 w-40 mx-auto"></div>
          <div className="text-xs mt-1">
            {form_data.signature_text ? (
              <span className="font-semibold">{form_data.signature_text}</span>
            ) : (
              <span className="text-gray-600">Signature</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ------------------ BACK SIDE COMPONENT ------------------ */
function Back_side({ form_data }) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 text-gray-800">
      <div className="space-y-2 text-sm">
        <div><strong>Expiry Date:</strong> {form_data.expiry_date || "—"}</div>
        <div><strong>SSS No.:</strong> {form_data.sss_no || "—"}</div>
        <div><strong>TIN No.:</strong> {form_data.tin_no || "—"}</div>
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
