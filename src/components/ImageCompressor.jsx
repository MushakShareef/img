import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function ImageCompressor({ imageFile }) {
  const [quality, setQuality] = useState(70); // default compression %
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    if (!imageFile) return;

    setLoading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      const compressed = await imageCompression(imageFile, options);
      setCompressedFile(compressed);
    } catch (error) {
      console.error("Compression error:", error);
      alert("Something went wrong during compression.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3>🗜️ Image Compression</h3>
      <label>Compression Quality: {quality}%</label>
      <input
        type="range"
        min="10"
        max="100"
        value={quality}
        onChange={(e) => setQuality(Number(e.target.value))}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button onClick={handleCompress} style={styles.button} disabled={loading}>
        {loading ? "Compressing..." : "Compress Image"}
      </button>

      {compressedFile && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ Compressed Size: {(compressedFile.size / 1024).toFixed(2)} KB</p>
          <a
            href={URL.createObjectURL(compressedFile)}
            download={`compressed-${imageFile.name}`}
            style={styles.download}
          >
            Download Compressed Image
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
  button: {
    padding: "10px 20px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  download: {
    display: "inline-block",
    marginTop: "10px",
    color: "#007bff",
    textDecoration: "underline",
  },
};

export default ImageCompressor;
