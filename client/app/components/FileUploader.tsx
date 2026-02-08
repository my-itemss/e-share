"use client";

import { useState } from "react";

export default function FileUploader() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    const id = data.link.split("/").pop();

    setLink(`/file/${id}`);
    setLoading(false);
  };

  return (
    <div className="border p-6 rounded flex flex-col gap-4">
      <input type="file" onChange={uploadFile} />

      {loading && <p>Uploading...</p>}

      {link && (
        <a href={link} className="text-blue-600 underline">
          Go to download page
        </a>
      )}
    </div>
  );
}
