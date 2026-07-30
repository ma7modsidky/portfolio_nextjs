"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onChange([...images, ...data.urls]);
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [images[index], ...images.filter((_, i) => i !== index)];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Project Images
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10
                   hover:border-primary/50 hover:bg-white/[0.02] transition-all cursor-pointer"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Uploading...</p>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-text-muted">
              Drop images here or click to browse
            </p>
            <p className="text-xs text-text-muted/60 mt-1">
              PNG, JPG, WebP up to 10MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-surface-lighter/50">
              {i === 0 && (
                <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md bg-accent/90 text-white text-[10px] font-medium">
                  Primary
                </div>
              )}
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className={`w-full h-full object-cover ${i === 0 ? "ring-2 ring-accent" : ""}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    className="p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
                    title="Set as primary"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-danger transition-all"
                  title="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-text-muted">
        {images.length} image{images.length !== 1 ? "s" : ""} uploaded
      </p>
    </div>
  );
}
