"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uplaod", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
    setFile(null);

    // console.log({ data });

    setUploading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Image to Cloudinary</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {result?.data && (
        <div className="mt-6 text-center">
          <p className="mb-2">✅ Uploaded successfully!</p>
          <img
            src={result?.data?.url}
            alt="Uploaded"
            className="max-w-xs rounded-lg"
          />
          <p className="text-sm text-gray-600 break-all">{result?.data?.url}</p>
        </div>
      )}
    </main>
  );
}
