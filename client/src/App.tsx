import { useState } from "react";
import SendCard from "./components/SendCard";
import ReceiveCard from "./components/ReceiveCard";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [link, setLink] = useState("");

  const upload = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("expiryHours", "24");

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    const out = await res.json();
    const full = API + out.url;

    // ✅ show in UI
    setLink(full);
  };

  return (
    <div className="min-h-screen bg-rose-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <SendCard onFile={upload} />

        {/* 👇 Link display */}
        {link && (
          <div className="bg-white rounded-xl p-4 shadow-lg break-all">
            <p className="font-semibold mb-2">Download link:</p>

            <a
              href={link}
              target="_blank"
              className="text-blue-600 underline"
            >
              {link}
            </a>

            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="mt-3 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Copy Link
            </button>
          </div>
        )}

        <ReceiveCard />
      </div>
    </div>
  );
}
