import { useState } from "react";
import SendCard from "./components/SendCard";
import ReceiveCard from "./components/ReceiveCard";

const API = import.meta.env.VITE_API_URL;
type Phase = "idle" | "sending" | "receiving" | "loading" | "result";

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [link, setLink] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("30");

  const handleUpload = async (file: File) => {
    setPhase("loading");
    const data = new FormData();
    data.append("file", file);
    data.append("expiryMinutes", expiryMinutes);

    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: data });
      const out = await res.json();
      setLink(`${API}${out.url}`);
      setPhase("result");
    } catch {
      alert("Upload failed");
      setPhase("sending");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 antialiased">
      
      {/* 📁 FOLDER GRID */}
      {phase === "idle" && (
        <div className="flex flex-col md:flex-row gap-12 animate-in fade-in zoom-in-95 duration-700">
          
          {/* Send Folder (Dark) */}
          <div onClick={() => setPhase("sending")} className="cursor-pointer group">
            <SendCard variant="preview" />
            <p className="text-center mt-4 font-bold text-slate-400 group-hover:text-black transition-colors uppercase tracking-widest text-[10px]">Send</p>
          </div>

          {/* Receive Folder (Yellow) */}
          <div onClick={() => setPhase("receiving")} className="cursor-pointer group">
            <ReceiveCard variant="preview" />
            <p className="text-center mt-4 font-bold text-slate-400 group-hover:text-yellow-600 transition-colors uppercase tracking-widest text-[10px]">Receive</p>
          </div>

        </div>
      )}

      {/* 🚀 ACTION VIEWS */}
      <div className="w-full max-w-sm">
        {phase === "sending" && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
             <button onClick={() => setPhase("idle")} className="mb-8 text-slate-300 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">← Back</button>
             <div className="mb-6 px-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Expiry (Mins)</label>
                <input type="number" value={expiryMinutes} onChange={(e) => setExpiryMinutes(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold" />
             </div>
             <SendCard variant="active" onFile={handleUpload} />
          </div>
        )}

        {phase === "receiving" && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
             <button onClick={() => setPhase("idle")} className="mb-8 text-slate-300 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">← Back</button>
             <ReceiveCard variant="active" onComplete={() => setPhase("idle")} />
          </div>
        )}

        {/* Loading State */}
        {phase === "loading" && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-slate-100 border-t-black rounded-full animate-spin"></div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">Uploading...</p>
          </div>
        )}

        {/* Result State */}
        {phase === "result" && (
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 text-center animate-in zoom-in-95">
            <div className="text-4xl mb-6">✨</div>
            <div className="bg-slate-50 p-4 rounded-2xl break-all font-mono text-xs text-slate-500 mb-8 border border-slate-100">{link}</div>
            <button onClick={() => setPhase("idle")} className="w-full py-4 bg-black text-white rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-slate-800 transition-all">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
