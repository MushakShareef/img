import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ImageCompressor from "./components/ImageCompressor";
import ImageResizer from "./components/ImageResizer";
import ImageConverter from "./components/ImageConverter";
import ImageToPDF from "./components/ImageToPDF";
import PdfToImage from "./components/PdfToImage";
import PdfToWord from "./components/PdfToWord";






function App() {
  const [imageFile, setImageFile] = useState(null);

  const handleImageSelect = (file) => {
    setImageFile(file);
    console.log("Image selected:", file);
  };

  return (
    <div>
      <h1 style={styles.heading}>🖼️ Image Converter Tool</h1>
      <ImageUpload onImageSelect={handleImageSelect} />
      {imageFile && <ImageCompressor imageFile={imageFile} />}
      {imageFile && <ImageResizer imageFile={imageFile} />}
      {imageFile && <ImageConverter imageFile={imageFile} />}
      {imageFile && <ImageToPDF imageFile={imageFile} />}      
      {imageFile && (
        <div style={styles.previewBox}>
          <p>File: {imageFile.name}</p>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        </div>
      )}
      
      <hr />
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>📚 PDF Tools</h2>
      <PdfToImage />
      <PdfToWord />

    </div>
  );
}

const styles = {
  heading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "24px",
    color: "#333",
  },
  previewBox: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default App;
