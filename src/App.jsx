import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ImageCompressor from "./components/ImageCompressor";
import ImageResizer from "./components/ImageResizer";
import ImageConverter from "./components/ImageConverter";
import ImageToPDF from "./components/ImageToPDF";
import PdfToImage from "./components/PdfToImage";
import PdfToWord from "./components/PdfToWord";
import VideoCompressor from "./components/VideoCompressor";

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
        default:
          return <p className="info-text">Select a tool from PDF Tools</p>;
      }
    }

    if (selectedCategory === "Video") {
      switch (selectedTool) {
      case "compress":
        return <VideoCompressor />;
      default:
      return <p className="info-text">Select a tool from Video Tools</p>;
     }
    }

    return <p className="info-text">Please select a category</p>;
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
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">🎧 Audio Tools</button>
          <div className="dropdown-content">
            <button disabled>Coming Soon</button>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">🎬 Video Tools</button>
          <div className="dropdown-content">
          <button onClick={() => handleToolChange("Video", "compress")}>
          Compress Video
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
