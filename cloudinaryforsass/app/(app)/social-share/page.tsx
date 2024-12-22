"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
};

type socialFormats = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<socialFormats>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload the Image");
      }

      const data = await response.json();
      setUploadedImage(data.public_id);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) {
      return;
    }

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="container max-w-3xl bg-base-100 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Social Media Image Creator
        </h1>

        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl text-secondary mb-4">
              Upload an Image
            </h2>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Choose an image file:
                </span>
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="file-input file-input-bordered file-input-primary w-full"
              />
            </div>

            {isUploading && (
              <div className="flex justify-center mt-4">
                <progress className="progress progress-primary w-3/4"></progress>
              </div>
            )}

            {uploadedImage && (
              <>
                <div className="divider mt-6 mb-6">Customize Image</div>
                <div>
                  <h2 className="card-title text-lg text-secondary mb-4">
                    Select Social Media Format:
                  </h2>
                  <div className="form-control">
                    <select
                      className="select select-bordered w-full"
                      value={selectedFormat}
                      onChange={(e) =>
                        setSelectedFormat(e.target.value as socialFormats)
                      }
                    >
                      {Object.keys(socialFormats).map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 relative">
                  <h3 className="text-lg font-semibold mb-3">Image Preview:</h3>
                  <div className="relative border border-dashed border-primary rounded-lg p-4">
                    {isTransforming && (
                      <div className="absolute inset-0 flex items-center justify-center bg-base-300 bg-opacity-70 z-10">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    )}
                    <div className="flex justify-center">
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity="auto"
                        ref={imageRef}
                        onLoad={() => setIsTransforming(false)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-actions mt-6 justify-center">
                  <button
                    className="btn btn-primary btn-lg px-8"
                    onClick={handleDownload}
                  >
                    Download for {selectedFormat}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
