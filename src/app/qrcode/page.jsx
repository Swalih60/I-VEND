"use client";

import { Card, CardContent } from "@/components/ui/card";
import QRCode from "qrcode.js";
import { useEffect } from "react";

const QRCodePurchase = () => {
  useEffect(() => {
    // Create QR Code once the component mounts
    const qrcode = new QRCode(document.getElementById("qrcode"), {
      text: "https://example.com/purchase/123456",
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Cleanup function
    return () => {
      document.getElementById("qrcode").innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Purchase QR Code
      </h1>

      <Card className="w-full max-w-md bg-white">
        <CardContent className="flex flex-col items-center p-6">
          <div id="qrcode" className="my-4" />
          <p className="text-gray-600 text-center mt-4">
            Scan this QR code to complete this purchase
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodePurchase;
