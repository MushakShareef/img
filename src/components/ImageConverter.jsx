import React, { useState } from "react";

function ImageConverter({ imageFile }) {
  const [format, setFormat] = useState("jpeg");
  const [convertedURL, setConvertedURL] = useState(null);

  const convertImage = () => {
    if (!imageFile) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const mimeType = `image/${format}`;
        const dataURL = canvas.toDataURL(mimeType);
        setConvertedURL(dataURL);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <div style={styles.container}>
      <h3>🖼️ Image Format Converter</h3>
      <label>Select Output Format:</label>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        style={styles.select}
      >
        <option value="jpeg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WEBP</option>
      </select>

      <button onClick={convertImage} style={styles.button}>
        Convert Image
      </button>

      {convertedURL && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ Converted!</p>
          <a
            href={convertedURL}
            download={`converted-image.${format}`}
            style={styles.download}
          >
            Download {format.toUpperCase()}
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
  select: {
    margin: "10px",
    padding: "5px 10px",
  },
  button: {
    padding: "10px 20px",
    marginTop: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  download: {
    display: "inline-block",
    marginTop: "10px",
    color: "#28a745",
    textDecoration: "underline",
  },
};

export default ImageConverter;
