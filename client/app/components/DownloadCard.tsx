"use client";

export default function DownloadCard({ id }) {
  const download = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/download/${id}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded flex flex-col gap-4">
        <h2 className="text-xl font-bold">File Ready</h2>
        <button
          onClick={download}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Download File
        </button>
      </div>
    </div>
  );
}
