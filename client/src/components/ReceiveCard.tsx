import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function ReceiveCard() {
  const [key, setKey] = useState("");

  const download = () => {
    if (!key) return;
    window.open(`${API}/f/${key}`, "_blank");
  };

  return (
    <div className="bg-gray-200 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold">Receive</h2>

      <div className="flex gap-3 mt-4">
        <input
          className="flex-1 px-4 py-2 rounded-lg outline-none"
          placeholder="Input key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <button
          onClick={download}
          className="px-4 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          ↓
        </button>
      </div>
    </div>
  );
}
