// QRCodeGenerator.jsx
"use client";
import dynamic from "next/dynamic";

// Dynamically import QRCode and specifically get the default export
const QRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading QR Code...</p>,
  }
);

const QRCodeGenerator = ({ mess_id }) => (
  <div className="flex justify-center items-center">
    {mess_id ? (
      <QRCode
        value={mess_id}
        size={256}
        className="w-64 h-64"
        level="H"
        includeMargin={true}
      />
    ) : (
      <p>No QR code data provided</p>
    )}
  </div>
);

export default QRCodeGenerator;
