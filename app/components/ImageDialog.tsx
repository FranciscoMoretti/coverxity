import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  Copy,
  CropIcon,
  Download,
  ExternalLink,
  Link,
  X,
} from "lucide-react";
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
    <DialogContent className="max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
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
              src={image.src.large || "/placeholder.svg"}
              alt={image.alt || "Image"}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:w-72">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="font-medium">{image.photographer}</div>
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {image.alt && (
              <div className="text-sm text-muted-foreground">{image.alt}</div>
            )}
            <div className="text-sm text-muted-foreground">
              Free to use under the Pexels license
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isCropping ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsCropping(false)}
                  className="w-full justify-start"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={getCroppedImage}
                  className="w-full justify-start"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Cropped
                </Button>
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
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Original
                </Button>
                <Button
                  onClick={(e) =>
                    handleCopyClick(
                      e,
                      image.src.original,
                      `dialog-${query}-${index}`
                    )
                  }
                  variant="outline"
                  className="w-full justify-start"
                >
                  {copiedStates[`dialog-${query}-${index}`] ? (
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      URL Copied
                    </div>
                  ) : (
                    <>
                      <Link className="mr-2 h-4 w-4" />
                      Copy URL
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsCropping(true)}
                  className="w-full justify-start"
                >
                  <CropIcon className="mr-2 h-4 w-4" />
                  Crop OG Image
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
