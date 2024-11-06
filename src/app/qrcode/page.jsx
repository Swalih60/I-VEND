import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

const QRCodePurchase = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Your Purchase QR Code
      </h1>

      <Card className="w-full max-w-md bg-white">
        <CardContent className="flex flex-col items-center p-6">
          <div className="my-4">
            <QRCodeSVG
              value="A1 2 B3 3 12adsd221 "
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-gray-600 text-center mt-4">
            Scan this QR code to complete this purchase
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodePurchase;
