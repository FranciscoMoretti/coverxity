"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageCropperProps {
  imageUrl: string;
  onClose: () => void;
  open: boolean;
}

export default function ImageCropper({
  imageUrl,
  onClose,
  open,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 52.5, // Maintains 1.9:1 aspect ratio (630/1200 = 0.525)
    x: 0,
    y: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const getCroppedImage = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = 1200;
    canvas.height = 630;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      1200,
      630
    );

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "og-image.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Crop Image for OG Cover
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1200 / 630}
            className="max-h-[70vh] object-contain"
          >
            <img
              ref={imageRef}
              src={imageUrl || "/placeholder.svg"}
              alt="Original image for cropping"
              className="max-w-full h-auto"
              crossOrigin="anonymous"
            />
          </ReactCrop>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={getCroppedImage}>Download Cropped Image</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
