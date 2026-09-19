"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 4;

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset ?? "");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("No se pudo subir la imagen");
  }

  const data = await res.json();
  return data.secure_url as string;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const remainingSlots = MAX_IMAGES - value.length;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || remainingSlots <= 0) return;
    setError(null);
    setUploading(true);
    try {
      const files = Array.from(fileList).slice(0, remainingSlots);
      const urls = await Promise.all(files.map(uploadToCloudinary));
      onChange([...value, ...urls]);
    } catch {
      setError("No se pudo subir una o más imágenes. Intenta de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {remainingSlots > 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-vella-gold/50 px-4 py-8 text-center text-sm text-vella-navy/70 transition-colors",
            dragActive && "border-vella-gold bg-vella-gold/5"
          )}
        >
          {uploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-vella-gold border-t-transparent" />
          ) : (
            <>
              <span>Arrastra imágenes aquí o haz clic para elegir</span>
              <span className="text-xs text-vella-navy/50">
                Máximo {MAX_IMAGES} imágenes
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-lg border border-vella-gold/30 bg-vella-cream"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 rounded-full bg-vella-wine px-2 py-0.5 text-[10px] font-medium text-white">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                aria-label="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
