import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Download, X } from "lucide-react";
import { Photo } from "pexels";
import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;
const ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT;

interface ImageDialogProps {
  image: Photo;
  query: string;
  index: number;
}

export default function ImageDialog({ image, query, index }: ImageDialogProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>(() => {
    const imageWidth = image.width;
    const imageHeight = image.height;

    // If image is wider than OG aspect ratio
    if (imageWidth / imageHeight > ASPECT_RATIO) {
      const targetHeight = imageHeight;
      const targetWidth = targetHeight * ASPECT_RATIO;
      const percentWidth = (targetWidth / imageWidth) * 100;
      console.log("percentWidth", percentWidth);
      return {
        unit: "%",
        width: percentWidth,
        height: 100,
        x: (100 - percentWidth) / 2,
        y: 0,
      };
    } else {
      // If image is taller than OG aspect ratio
      const targetWidth = imageWidth;
      const targetHeight = targetWidth / ASPECT_RATIO;
      const percentHeight = (targetHeight / imageHeight) * 100;
      console.log("percentHeight", percentHeight);
      return {
        unit: "%",
        width: 100,
        height: percentHeight,
        x: 0,
        y: (100 - percentHeight) / 2,
      };
    }
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleCopyClick = (
    e: React.MouseEvent,
    imageUrl: string,
    id: string
  ) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [id]: false }));
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleDownload = async (
    e: React.MouseEvent,
    imageUrl: string,
    filename: string
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download: ", err);
    }
  };

  const getCroppedImage = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;

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
      TARGET_WIDTH,
      TARGET_HEIGHT
    );

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
    <DialogContent className="max-w-3xl">
      <DialogTitle className="flex items-center justify-between">
        {image.alt || "Image"}
      </DialogTitle>

      <div className="relative">
        <div className={`${isCropping ? "block" : "hidden"}`}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={ASPECT_RATIO}
            className="object-contain"
          >
            <img
              ref={imageRef}
              src={image.src.original || "/placeholder.svg"}
              alt={image.alt || "Image"}
              className="max-w-full h-auto"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>
        <div className={`${isCropping ? "hidden" : "block"}`}>
          <img
            src={image.src.medium || "/placeholder.svg"}
            alt={image.alt || "Image"}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <DialogFooter className="mt-4">
        <div className="flex gap-2">
          {isCropping ? (
            <>
              <Button variant="outline" onClick={() => setIsCropping(false)}>
                Cancel
              </Button>
              <Button onClick={getCroppedImage}>Download Cropped Image</Button>
            </>
          ) : (
            <>
              <Button
                onClick={(e) =>
                  handleDownload(
                    e,
                    image.src.original,
                    image.alt || `image-${index}`
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={(e) =>
                  handleCopyClick(
                    e,
                    image.src.original,
                    `dialog-${query}-${index}`
                  )
                }
                className="transition-all"
              >
                {copiedStates[`dialog-${query}-${index}`] ? (
                  <div className="flex items-center space-x-2">
                    <span>URL Copied</span>
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </>
                )}
              </Button>
              <Button onClick={() => setIsCropping(true)}>
                Create OG Image
              </Button>
            </>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
