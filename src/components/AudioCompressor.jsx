// components/AudioCompressor.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
import "./VideoCompressor.css";

const { createFFmpeg, fetchFile } = ffmpegModule;
const ffmpeg = createFFmpeg({ log: true });

const AudioCompressor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [bitrate, setBitrate] = useState("128k");
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setOriginalSize(file.size);
      setOutputUrl("");
    } else {
      alert("Please select a valid audio file.");
    }
  };

  const handleBitrateChange = (e) => {
    setBitrate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile) {
      alert("Please upload an audio file first.");
      return;
    }

    setIsProcessing(true);
    setProgressText("Loading FFmpeg...");

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputExt = audioFile.name.split(".").pop();
    const inputName = `input.${inputExt}`;
    const outputName = `output.${inputExt}`;

    ffmpeg.FS("writeFile", inputName, await fetchFile(audioFile));

    setProgressText("Compressing audio...");

    await ffmpeg.run("-i", inputName, "-b:a", bitrate, outputName);

    const data = ffmpeg.FS("readFile", outputName);
    const blob = new Blob([data.buffer], { type: `audio/${inputExt}` });
    const url = URL.createObjectURL(blob);

    setOutputSize(blob.size);
    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Compression complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🔊 Audio Compressor</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Audio File:
          <input type="file" accept="audio/*" onChange={handleFileChange} className="input" />
        </label>

        <label className="label">
          Select Bitrate:
          <select value={bitrate} onChange={handleBitrateChange} className="select">
            <option value="320k">320 kbps (High Quality)</option>
            <option value="192k">192 kbps (Medium)</option>
            <option value="128k">128 kbps (Standard)</option>
            <option value="64k">64 kbps (Smallest)</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Compress Audio"}
        </button>
      </form>

      {isProcessing && <p className="info">{progressText}</p>}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Compression done!</p>
          <audio controls src={outputUrl} style={{ width: "100%" }} />
          <p>
            📁 Original: {(originalSize / 1024 / 1024).toFixed(2)} MB <br />
            📉 Compressed: {(outputSize / 1024 / 1024).toFixed(2)} MB
          </p>
          <a href={outputUrl} download={`compressed_audio.${audioFile.name.split(".").pop()}`} className="button">
            Download Compressed Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioCompressor;
