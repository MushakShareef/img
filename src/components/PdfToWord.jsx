import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.js`;

function PdfToWord() {
  const [loading, setLoading] = useState(false);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let allText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        allText += `Page ${i}:\n${pageText}\n\n`;
      }

      // Create DOCX from extracted text
      const doc = new Document({
        sections: [
          {
            children: allText.split("\n").map((line) => new Paragraph(line)),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "converted.docx");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={styles.container}>
      <h3>📄 Convert PDF to Word (.docx)</h3>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      {loading && <p style={styles.loading}>⏳ Converting PDF to Word...</p>}
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
};

export default PdfToWord;
