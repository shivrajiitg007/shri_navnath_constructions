"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Loader2, ImageIcon } from "lucide-react";
import { uploadMedia } from "@/lib/actions/media";

export function MediaPicker({
  value,
  onChange,
  folder = "general",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const res = await uploadMedia(file, folder);
    setBusy(false);
    if (res.error || !res.url) {
      setError(res.error ?? "Upload failed");
      return;
    }
    onChange(res.url);
  }

  return (
    <div>
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-concrete-200">
          <Image src={value} alt="Selected" fill className="object-cover" sizes="300px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-charcoal-950/70 p-1.5 text-warmwhite hover:bg-charcoal-950"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-concrete-300 bg-warmwhite text-concrete-500 transition hover:border-gold-500 hover:text-gold-600 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          <span className="text-xs font-medium">{busy ? "Uploading..." : "Click to upload image"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {!value && !busy && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-concrete-400">
          <ImageIcon className="h-3 w-3" /> Uploads to your Media Library automatically
        </p>
      )}
    </div>
  );
}
