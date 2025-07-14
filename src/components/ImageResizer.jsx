import React, { useState, useEffect } from "react";

function ImageResizer({ imageFile }) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [resizedURL, setResizedURL] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get original dimensions when image is loaded
    const img = new Image();
    img.onload = function () {
      setOriginalDimensions({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = URL.createObjectURL(imageFile);
  }, [imageFile]);

  const handleResize = () => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataUrl = canvas.toDataURL("image/jpeg");
      setResizedURL(resizedDataUrl);
    };
    img.src = URL.createObjectURL(imageFile);
  };

  return (
    <div style={styles.container}>
      <h3>📐 Image Resizer</h3>
      <p>Original Size: {originalDimensions.width} x {originalDimensions.height} px</p>

      <div>
        <label>New Width (px): </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={styles.input}
        />
      </div>
      <div>
        <label>New Height (px): </label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          style={styles.input}
        />
      </div>

      <button onClick={handleResize} style={styles.button}>
        Resize Image
      </button>

      {resizedURL && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ Resized!</p>
          <a
            href={resizedURL}
            download={`resized-${imageFile.name}`}
            style={styles.download}
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    margin: "20px",
    textAlign: "center",
  },
  input: {
    padding: "5px",
    width: "80px",
    margin: "10px",
  },
  button: {
    padding: "10px 20px",
    marginTop: "10px",
    backgroundColor: "#6f42c1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  download: {
    display: "inline-block",
    marginTop: "10px",
    color: "#6f42c1",
    textDecoration: "underline",
  },
};

export default ImageResizer;
