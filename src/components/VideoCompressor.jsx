// components/VideoCompressor.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
const { createFFmpeg, fetchFile } = ffmpegModule;
import "./VideoCompressor.css";

const ffmpeg = createFFmpeg({ log: true });

const VideoCompressor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setOutputUrl("");
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleCompressionChange = (e) => {
    setCompressionLevel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload a video file first.");
      return;
    }

    setIsProcessing(true);
    setProgressText("Loading FFmpeg...");

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputName = "input.mp4";
    const outputName = "output.mp4";
    ffmpeg.FS("writeFile", inputName, await fetchFile(videoFile));

    // Define compression presets
    let crf = "28"; // default
    if (compressionLevel === "low") crf = "35";
    else if (compressionLevel === "medium") crf = "28";
    else if (compressionLevel === "high") crf = "23";

    setProgressText("Compressing video...");

    await ffmpeg.run(
      "-i",
      inputName,
      "-vcodec",
      "libx264",
      "-crf",
      crf,
      outputName
    );

    setProgressText("Reading output file...");

    const data = ffmpeg.FS("readFile", outputName);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Compression complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🎬 Video Compressor</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Video File:
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="input"
          />
        </label>

        <label className="label">
          Compression Level:
          <select
            value={compressionLevel}
            onChange={handleCompressionChange}
            className="select"
          >
            <option value="low">Low (Smallest size)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Better quality)</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Compress Video"}
        </button>
      </form>

      {isProcessing && <p className="info">{progressText}</p>}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Compression done!</p>
          <video src={outputUrl} controls width="100%" />
          <a href={outputUrl} download="compressed_video.mp4" className="button">
            Download Compressed Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoCompressor;
