import React from "react";

function ImageUpload({ onImageSelect }) {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file); // send the file back to App
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <div style={styles.container}>
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    border: "2px dashed #aaa",
    borderRadius: "10px",
    textAlign: "center",
    margin: "20px",
  },
};

export default ImageUpload;
