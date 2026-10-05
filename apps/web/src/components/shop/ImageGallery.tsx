"use client";

import React, { useState } from "react";

export interface ImageGalleryProps {
  images: { id?: string; url: string; altText?: string }[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 font-medium text-sm">
        No Images Available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass-card border border-slate-800">
        <img
          src={images[selectedIndex]?.url}
          alt={images[selectedIndex]?.altText || "Product Image"}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedIndex === idx
                  ? "border-indigo-500 scale-95"
                  : "border-slate-800 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
