import { useRef } from "react";

type Props = {
  onFile: (file: File) => void;
};

export default function SendCard({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="bg-gray-200 rounded-xl p-6 h-56 cursor-pointer shadow-lg relative"
    >
      <h2 className="text-xl font-semibold">Send</h2>

      <div className="flex items-center justify-center h-full">
        <span className="text-6xl text-pink-500 leading-none">+</span>
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}
