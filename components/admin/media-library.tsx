"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, Pencil, Check, X, Loader2, ImageOff, Copy } from "lucide-react";
import { uploadMedia, renameMedia, deleteMedia } from "@/lib/actions/media";
import { formatDate } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

export function MediaLibrary({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [items, setItems] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const res = await uploadMedia(file, "library");
      if (res.url) {
        setItems((prev) => [
          { id: crypto.randomUUID(), url: res.url as string, filename: file.name, folder: "library", size_kb: Math.round(file.size / 1024), uploaded_at: new Date().toISOString() },
          ...prev,
        ]);
      }
    }
    setUploading(false);
  }

  function startRename(item: MediaItem) {
    setRenamingId(item.id);
    setRenameValue(item.filename);
  }

  function saveRename(id: string) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, filename: renameValue } : m)));
    startTransition(() => { void renameMedia(id, renameValue); });
    setRenamingId(null);
  }

  function handleDelete(item: MediaItem) {
    if (!confirm("Delete this file? Any project, employee, or content section using it will show a broken image.")) return;
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    startTransition(() => { void deleteMedia(item.id, item.url); });
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-concrete-500">{items.length} file{items.length === 1 ? "" : "s"} &middot; upload once, use anywhere on the site</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-warmwhite hover:bg-charcoal-800 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-concrete-300 bg-white p-14 text-center">
          <ImageOff className="mx-auto h-8 w-8 text-concrete-300" />
          <p className="mt-3 text-sm text-concrete-500">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-concrete-200 bg-white">
              <div className="relative aspect-square w-full bg-concrete-100">
                <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-3">
                {renamingId === item.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="w-full rounded-lg border border-concrete-200 px-2 py-1 text-xs outline-none focus:border-gold-500"
                      autoFocus
                    />
                    <button onClick={() => saveRename(item.id)} className="text-green-600"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setRenamingId(null)} className="text-concrete-400"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <p className="truncate text-xs font-medium text-charcoal-800">{item.filename}</p>
                )}
                <p className="mt-0.5 text-[10px] text-concrete-400">{item.size_kb ? `${item.size_kb} KB` : ""} &middot; {formatDate(item.uploaded_at)}</p>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => copyUrl(item)} className="rounded-md p-1.5 text-concrete-500 hover:bg-warmwhite hover:text-charcoal-900" title="Copy URL">
                    {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => startRename(item)} className="rounded-md p-1.5 text-concrete-500 hover:bg-warmwhite hover:text-charcoal-900" title="Rename">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="ml-auto rounded-md p-1.5 text-red-500 hover:bg-red-50" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
