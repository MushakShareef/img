// components/QRCodeGenerator.jsx
import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import "./VideoCompressor.css"; // reuse for styling

const QRCodeGenerator = () => {
  const qrRef = useRef(null);
  const [qrData, setQrData] = useState("https://example.com");
  const [dotStyle, setDotStyle] = useState("square");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [logo, setLogo] = useState(null);

  const qrCode = useRef(
    new QRCodeStyling({
      width: size,
      height: size,
      data: qrData,
      dotsOptions: { type: dotStyle, color: fgColor },
      backgroundOptions: { color: bgColor },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
    })
  );

  useEffect(() => {
    qrCode.current.update({
      data: qrData,
      width: size,
      height: size,
      dotsOptions: { type: dotStyle, color: fgColor },
      backgroundOptions: { color: bgColor },
      image: logo || undefined,
    });
    qrCode.current.append(qrRef.current);
  }, [qrData, dotStyle, fgColor, bgColor, size, logo]);

  const handleDownload = () => {
    qrCode.current.download({ name: "qr-code", extension: "png" });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="video-tool-container">
      <h2>✨ QR Code Generator (Custom)</h2>

      <label className="label">
        Text or URL:
        <input
          type="text"
          className="input"
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
        />
      </label>

      <label className="label">
        Size (px):
        <input
          type="number"
          className="input"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </label>

      <label className="label">
        Dot Style:
        <select className="select" value={dotStyle} onChange={(e) => setDotStyle(e.target.value)}>
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="classy">Classy</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>

      <label className="label">
        Foreground Color:
        <input type="color" className="input" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
      </label>

      <label className="label">
        Background Color:
        <input type="color" className="input" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
      </label>

      <label className="label">
        Center Logo (optional):
        <input type="file" accept="image/*" className="input" onChange={handleLogoUpload} />
      </label>

      <div ref={qrRef} style={{ margin: "20px 0" }} />

      <button className="button" onClick={handleDownload}>
        ⬇️ Download QR as PNG
      </button>
    </div>
  );
};

export default QRCodeGenerator;
