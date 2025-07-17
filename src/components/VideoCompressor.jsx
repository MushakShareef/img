// components/VideoCompressor.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
import "./VideoCompressor.css";

const { createFFmpeg, fetchFile } = ffmpegModule;
const ffmpeg = createFFmpeg({
  log: true,
  progress: (p) => {
    if (p?.ratio) {
      setProgress(Math.round(p.ratio * 100));
    }
  },
});

let setProgress; // We'll hook this below

const VideoCompressor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [resolution, setResolution] = useState("original");
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);

  setProgress = setProgressValue; // Link FFmpeg progress to state updater

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setOriginalSize(file.size);
      setOutputUrl("");
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleCompressionChange = (e) => {
    setCompressionLevel(e.target.value);
  };

  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload a video file first.");
      return;
    }

    setIsProcessing(true);
    setProgressValue(0);
    setProgressText("Loading FFmpeg...");

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputName = "input.mp4";
    const outputName = "output.mp4";

    ffmpeg.FS("writeFile", inputName, await fetchFile(videoFile));

    let crf = "28";
    if (compressionLevel === "low") crf = "35";
    else if (compressionLevel === "high") crf = "23";

    const args = ["-i", inputName, "-vcodec", "libx264", "-crf", crf];

    if (resolution !== "original") {
      const [w, h] = resolution.split("x");
      args.push("-vf", `scale=${w}:${h}`);
    }

    args.push(outputName);

    setProgressText("Compressing video...");
    await ffmpeg.run(...args);

    const data = ffmpeg.FS("readFile", outputName);
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    setOutputSize(blob.size);
    const url = URL.createObjectURL(blob);

    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Compression complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🎬 Video Compressor + Resizer</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} className="input" />
        </label>

        <label className="label">
          Compression Level:
          <select value={compressionLevel} onChange={handleCompressionChange} className="select">
            <option value="low">Low (smallest size)</option>
            <option value="medium">Medium (balanced)</option>
            <option value="high">High (better quality)</option>
          </select>
        </label>

        <label className="label">
          Output Resolution:
          <select value={resolution} onChange={handleResolutionChange} className="select">
            <option value="original">Keep original</option>
            <option value="1920x1080">1920 x 1080 (Full HD)</option>
            <option value="1280x720">1280 x 720 (HD)</option>
            <option value="854x480">854 x 480 (SD)</option>
            <option value="640x360">640 x 360 (Mobile)</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Compress + Resize"}
        </button>
      </form>

      {isProcessing && (
        <>
          <p className="info">{progressText}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progressValue}%` }}></div>
          </div>
          <p className="info">Progress: {progressValue}%</p>
        </>
      )}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Done!</p>
          <video src={outputUrl} controls width="100%" />
          <p>
            📁 Original size: {(originalSize / (1024 * 1024)).toFixed(2)} MB
            <br />
            📉 Compressed size: {(outputSize / (1024 * 1024)).toFixed(2)} MB
          </p>
          <a href={outputUrl} download="compressed_video.mp4" className="button">
            Download Compressed Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoCompressor;
