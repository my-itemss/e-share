import { useRef } from "react";

export default function SendCard({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => inputRef.current?.click()}
        className="group relative transition-transform active:scale-95"
      >
        <img
          src="/log/upload.png"
          alt="Upload"
          className="w-70 h-70 object-contain group-hover:opacity-80 transition-opacity"
        />
        <p className="mt-4 text-xs font-bold text-slate-300 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
          Click to Upload
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </div>
  );
}
