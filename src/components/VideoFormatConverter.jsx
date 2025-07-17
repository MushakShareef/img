// components/VideoFormatConverter.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
import "./VideoCompressor.css"; // reuse same styles

const { createFFmpeg, fetchFile } = ffmpegModule;
const ffmpeg = createFFmpeg({ log: true });

const VideoFormatConverter = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("webm");
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setOutputUrl("");
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handleFormatChange = (e) => {
    setOutputFormat(e.target.value);
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
    const outputName = `output.${outputFormat}`;

    ffmpeg.FS("writeFile", inputName, await fetchFile(videoFile));

    setProgressText(`Converting to .${outputFormat}...`);

    await ffmpeg.run("-i", inputName, outputName);

    const data = ffmpeg.FS("readFile", outputName);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${outputFormat}` }));

    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Conversion complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🔄 Video Format Converter</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} className="input" />
        </label>

        <label className="label">
          Output Format:
          <select value={outputFormat} onChange={handleFormatChange} className="select">
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="avi">AVI</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Convert Video"}
        </button>
      </form>

      {isProcessing && <p className="info">{progressText}</p>}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Conversion done!</p>
          <video src={outputUrl} controls width="100%" />
          <a href={outputUrl} download={`converted_video.${outputFormat}`} className="button">
            Download Converted Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoFormatConverter;
