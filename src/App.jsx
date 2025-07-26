import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ImageCompressor from "./components/ImageCompressor";
import ImageResizer from "./components/ImageResizer";
import ImageConverter from "./components/ImageConverter";
import ImageToPDF from "./components/ImageToPDF";
import PdfToImage from "./components/PdfToImage";
import PdfToWord from "./components/PdfToWord";
import VideoCompressor from "./components/VideoCompressor";
import VideoFormatConverter from "./components/VideoFormatConverter"; // 👈 New
import AudioFormatConverter from "./components/AudioFormatConverter";
import AudioCompressor from "./components/AudioCompressor";
import AudioExtractor from "./components/AudioExtractor";
import QRCodeGenerator from "./components/QRCodeGenerator";
import PdfToExcel from "./components/PdfToExcel";

import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageSelect = (file) => {
    setImageFile(file);
  };

  const handleToolChange = (category, tool) => {
    setSelectedCategory(category);
    setSelectedTool(tool);
    setImageFile(null); // reset file when switching tools
  };

  const renderTool = () => {
    if (selectedCategory === "Image") {
      switch (selectedTool) {
        case "compress":
          return (
            <>
              <ImageUpload onImageSelect={handleImageSelect} />
              {imageFile && <ImageCompressor imageFile={imageFile} />}
            </>
          );
        case "resize":
          return (
            <>
              <ImageUpload onImageSelect={handleImageSelect} />
              {imageFile && <ImageResizer imageFile={imageFile} />}
            </>
          );
        case "convert":
          return (
            <>
              <ImageUpload onImageSelect={handleImageSelect} />
              {imageFile && <ImageConverter imageFile={imageFile} />}
            </>
          );
        case "img2pdf":
          return (
            <>
              <ImageUpload onImageSelect={handleImageSelect} />
              {imageFile && <ImageToPDF imageFile={imageFile} />}
            </>
          );
        default:
          
          return <p className="info-text">Select a tool from Image Tools</p>;
      }
    }

    if (selectedCategory === "PDF") {
      switch (selectedTool) {
        case "pdf2img":
          return <PdfToImage />;
        case "pdf2docx":
          return <PdfToWord />;
        case "pdf2excel":
          return <PdfToExcel />;
        default:
          return <p className="info-text">Select a tool from PDF Tools</p>;
      }
    }

    if (selectedCategory === "Video") {
      switch (selectedTool) {
      case "compress":
        return <VideoCompressor />;
      case "convert":
        return <VideoFormatConverter />;
      default:
        return <p className="info-text">Select a tool from Video Tools</p>;
      

     }
    }

    if (selectedCategory === "Audio") {
      switch (selectedTool) {
      case "convert":
          return <AudioFormatConverter />;
      case "compress":
          return <AudioCompressor />;
      case "extract":
          return <AudioExtractor />;

      default:
          return <p className="info-text">Select a tool from Audio Tools</p>;
      }
    }

    if (selectedCategory === "QR") {
      switch (selectedTool) {
      case "qrcode":
        return <QRCodeGenerator />;
      default:
        return <p className="info-text">Select a tool from QR Tools</p>;
      }
    }



    return (
        <div className="welcome-box">
          <h2>Welcome to Ameer’s Board</h2>
          <p>Where Tools Work for You</p>
          <p>Select a category from above to get started.</p>
        </div>
      );
  };

  return (
    <div className="app-container">
      <div className="ad-banner">[Google AdSense Unit]</div>

      <h1 className="app-title">🧰 All-in-One File Toolkit</h1>

      {/* Dropdown Section */}
      <div className="dropdown-section">
        <div className="dropdown">
          <button className="dropbtn">🖼️ Image Tools</button>
          <div className="dropdown-content">
            <button onClick={() => handleToolChange("Image", "compress")}>
              Compress Image
            </button>
            <button onClick={() => handleToolChange("Image", "resize")}>
              Resize Image
            </button>
            <button onClick={() => handleToolChange("Image", "convert")}>
              Convert Image
            </button>
            <button onClick={() => handleToolChange("Image", "img2pdf")}>
              Image to PDF
            </button>
            
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">📚 PDF Tools</button>
          <div className="dropdown-content">
            <button onClick={() => handleToolChange("PDF", "pdf2img")}>
              PDF to Image
            </button>
            <button onClick={() => handleToolChange("PDF", "pdf2docx")}>
              PDF to Word
            </button>
            <button onClick={() => handleToolChange("PDF", "pdf2excel")}>
              PDF to Excel
            </button>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">🎧 Audio Tools</button>
          <div className="dropdown-content">
            <button onClick={() => handleToolChange("Audio", "convert")}>
              Convert Audio Format
            </button>
            <button onClick={() => handleToolChange("Audio", "compress")}>
              Compress Audio
            </button>
            <button onClick={() => handleToolChange("Audio", "extract")}>
              Extract Audio from Video
            </button>

          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">🎬 Video Tools</button>
          <div className="dropdown-content">
          <button onClick={() => handleToolChange("Video", "compress")}>
          Compress Video
          </button>
          <button onClick={() => handleToolChange("Video", "convert")}>
            Convert Format
          </button>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">🧾 QR Tools</button>
          <div className="dropdown-content">
            <button onClick={() => handleToolChange("QR", "qrcode")}>
              QR Code Generator
            </button>
          </div>
        </div>


      </div>

      {/* Tool Display Area */}
      <div className="tool-section">{renderTool()}</div>
    </div>
  );
}

export default App;
