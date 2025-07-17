// components/AudioFormatConverter.jsx
import React, { useState } from "react";
import ffmpegModule from "@ffmpeg/ffmpeg";
import "./VideoCompressor.css"; // reuse existing styles

const { createFFmpeg, fetchFile } = ffmpegModule;
const ffmpeg = createFFmpeg({ log: true });

const AudioFormatConverter = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setOutputUrl("");
    } else {
      alert("Please select a valid audio file.");
    }
  };

  const handleFormatChange = (e) => {
    setOutputFormat(e.target.value);
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

    const inputName = "input." + audioFile.name.split(".").pop();
    const outputName = `output.${outputFormat}`;

    ffmpeg.FS("writeFile", inputName, await fetchFile(audioFile));

    setProgressText(`Converting to .${outputFormat}...`);

    await ffmpeg.run("-i", inputName, outputName);

    const data = ffmpeg.FS("readFile", outputName);
    const blob = new Blob([data.buffer], { type: `audio/${outputFormat}` });
    const url = URL.createObjectURL(blob);

    setOutputUrl(url);
    setIsProcessing(false);
    setProgressText("Conversion complete!");
  };

  return (
    <div className="video-tool-container">
      <h2>🔁 Audio Format Converter</h2>

      <form onSubmit={handleSubmit}>
        <label className="label">
          Select Audio File:
          <input type="file" accept="audio/*" onChange={handleFileChange} className="input" />
        </label>

        <label className="label">
          Output Format:
          <select value={outputFormat} onChange={handleFormatChange} className="select">
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="ogg">OGG</option>
            <option value="opus">OPUS</option>
          </select>
        </label>

        <button type="submit" className="button" disabled={isProcessing}>
          {isProcessing ? "Converting..." : "Convert Audio"}
        </button>
      </form>

      {isProcessing && <p className="info">{progressText}</p>}

      {outputUrl && (
        <div className="download-section">
          <p>✅ Conversion done!</p>
          <audio controls src={outputUrl} style={{ width: "100%" }} />
          <a href={outputUrl} download={`converted_audio.${outputFormat}`} className="button">
            Download Converted Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioFormatConverter;
