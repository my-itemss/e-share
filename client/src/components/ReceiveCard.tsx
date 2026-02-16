import { useState } from "react";
const API = import.meta.env.VITE_API_URL;

// Just adding the type definition here
interface ReceiveCardProps {
  variant: "preview" | "active";
  onComplete?: () => void;
}

export default function ReceiveCard({ variant : _variant, onComplete }: ReceiveCardProps) {
  const [key, setKey] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && key) {
      window.open(`${API}/f/${key}`, "_blank");
      // Added a check to make sure onComplete exists
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Enter File ID</h2>
      <input
        autoFocus
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 12345"
        className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-center text-xl"
      />
      <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
        Press Enter to Fetch
      </p>
    </div>
  );
}
