import React, { useState } from "react";

function PdfToWord() {
  const [loading, setLoading] = useState(false);
  const [docxUrl, setDocxUrl] = useState(null);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  

    try {
      const response = await fetch("https://pdf2docx-api.onrender.com/convert-ocr", {
      method: "POST",
      body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDocxUrl(url);
    } catch (err) {
      alert("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3>📄 Convert PDF to Word (.docx)</h3>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      {loading && <p style={styles.loading}>⏳ Converting PDF to Word...</p>}
      {docxUrl && (
        <a href={docxUrl} download="converted.docx" style={styles.download}>
          ⬇️ Download Converted DOCX
        </a>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #555",
    borderRadius: "10px",
    textAlign: "center",
    background: "#f0f0f0",
  },
  loading: {
    fontStyle: "italic",
    color: "#333",
  },
  download: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default PdfToWord;
