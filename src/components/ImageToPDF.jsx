import React from "react";
import { jsPDF } from "jspdf";

function ImageToPDF({ imageFile }) {
  const handleConvertToPDF = () => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgData = e.target.result;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const img = new Image();
      img.onload = function () {
        // Calculate size to fit A4
        const pageWidth = 595;
        const pageHeight = 842;
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);

        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
        pdf.save("image.pdf");
      };

      img.src = imgData;
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <div style={styles.container}>
      <h3>🧾 Convert Image to PDF</h3>
      <button onClick={handleConvertToPDF} style={styles.button}>
        Convert to PDF
      </button>
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
    backgroundColor: "#e83e8c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ImageToPDF;
