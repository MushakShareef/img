// components/AudioExtractor.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
import "./VideoCompressor.css";

const { createFFmpeg, fetchFile } = ffmpegModule;
const ffmpeg = createFFmpeg({ log: true });

const AudioExtractor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [audioFormat, setAudioFormat] = useState("mp3");
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

  const handleFormatChange = (e) => {
    setAudioFormat(e.target.value);
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

    const inputName = "input." + videoFile.name.split(".").pop();

    const outputName = `output.mp3`;
    const mimeType = "audio/mp3";


    ffmpeg.FS("writeFile", inputName, await fetchFile(videoFile));

    setProgressText("Extracting audio...");

    
    await ffmpeg.run("-i", inputName, "-vn", "-acodec", "libmp3lame", outputName);

    const data = ffmpeg.FS("readFile", outputName);
    
    const blob = new Blob([data.buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);

    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Extraction complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🎤 Extract Audio from Video</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} className="input" />
        </label>

        <label className="label">
          Output Format:
          <select value={audioFormat} onChange={handleFormatChange} className="select">
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="ogg">OGG</option>
            <option value="opus">OPUS</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Extract Audio"}
        </button>
      </form>

      {isProcessing && <p className="info">{progressText}</p>}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Audio extracted!</p>
          <audio controls src={outputUrl} />
          <a href={outputUrl} download="extracted_audio.mp3" className="button">
            Download Extracted Audio
          </a>          
        </div>
      )}
    </div>
  );
};

export default AudioExtractor;
