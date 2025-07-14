import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url"; // <-- ✅ Note: `?url`

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;




function PdfToImage() {
  const [pdfImages, setPdfImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }

    setLoading(true);
    setPdfImages([]);
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        setTotalPages(pdf.numPages);
        const pages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          setCurrentPage(i);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          const imageData = canvas.toDataURL("image/png");
          pages.push(imageData);
        }

        setPdfImages(pages);
      } catch (err) {
        console.error("PDF Error:", err);
        alert("Failed to render PDF");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ color: "#fff", padding: 20 }}>
      <h2>📚 PDF Tools</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>⏳ Converting... Page {currentPage} of {totalPages}</p>}
      {pdfImages.map((src, i) => (
        <div key={i}>
          <img src={src} alt={`Page ${i + 1}`} style={{ maxWidth: "100%" }} />
          <a href={src} download={`page-${i + 1}.png`}>⬇️ Download</a>
        </div>
      ))}
    </div>
  );
}

export default PdfToImage;
