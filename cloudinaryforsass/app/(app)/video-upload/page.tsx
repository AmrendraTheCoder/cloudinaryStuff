"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post("/api/video-upload", formData);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div className="card-body p-8">
          <h1 className="text-4xl font-bold text-primary text-center mb-6">
            Upload Your Video
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered input-primary w-full"
                placeholder="Enter your video title"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">
                  Description
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered textarea-primary w-full"
                placeholder="Enter a short description of your video"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">
                  Video File
                </span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered file-input-primary w-full"
                required
              />
              {file && (
                <span className="text-sm mt-2 text-gray-500">
                  Selected File: {file.name} (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
            <button
              type="submit"
              className={`btn btn-primary btn-lg w-full ${
                isUploading && "btn-disabled"
              }`}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                "Upload Video"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
