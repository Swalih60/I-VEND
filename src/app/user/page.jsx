"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { addDoc, collection } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";

// Loading component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
      <p className="text-gray-600">
        Please wait while we process your order...
      </p>
    </div>
  </div>
);

// QR Code component
const QRCodeDisplay = ({ orderData, cartItems }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Your Purchase QR Code
      </h1>

      <Card className="w-full max-w-md bg-white">
        <CardContent className="flex flex-col items-center p-6">
          <div className={`my-4 relative ${isExpired ? "opacity-50" : ""}`}>
            {isExpired ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-8 bg-red-500 rotate-12 absolute" />
                <div className="w-full h-8 bg-red-500 -rotate-12 absolute" />
                <span className="text-xl font-bold text-white z-10">
                  EXPIRED
                </span>
              </div>
            ) : null}
            <QRCodeSVG
              value={orderData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          {!isExpired ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="text-lg font-semibold text-red-500">
                Expires in: {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600 text-center">
                Scan this QR code at the vending machine to collect your items
              </p>
            </div>
          ) : (
            <div className="text-red-600 font-semibold text-center mt-4">
              This QR code has expired. Please place a new order.
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full">
            <h3 className="font-semibold mb-3">Order Details:</h3>
            <ul className="space-y-2">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">Qty: {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [orderQRData, setOrderQRData] = useState("");
  const [items] = useState([
    { id: 1, name: "Beverages", price: 2, img: "/images/7Up.jpg", slot: "A1" },
    { id: 2, name: "Lays", price: 3, img: "/image.png", slot: "A2" },
    {
      id: 3,
      name: "Notebook",
      price: 5,
      img: "/images/notebook.jpg",
      slot: "A3",
    },
    { id: 4, name: "Record", price: 8, img: "/images/notebook.jpg", slot: "B1" },
    {
      id: 5,
      name: "Rough Record",
      price: 4,
      img: "/images/notebook.jpg",
      slot: "B2",
    },
    { id: 6, name: "Pen", price: 1, img: "/images/pen.jpg", slot: "B3" },
    {
      id: 7,
      name: "Packet Chips",
      price: 3,
      img: "/image.png",
      slot: "C1",
    },
    {
      id: 8,
      name: "Chocolate Bar",
      price: 2,
      img: "/images/chocolate.jpg",
      slot: "C2",
    },
    {
      id: 9,
      name: "Water Bottle",
      price: 2,
      img: "/images/Pespsi.jpg",
      slot: "C3",
    },
  ]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem && existingItem.quantity < 3) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      setTotalAmount(totalAmount + item.price);
    } else if (!existingItem) {
      setCart([...cart, { ...item, quantity: 1 }]);
      setTotalAmount(totalAmount + item.price);
    }
  };

  const removeFromCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setCart(
          cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        );
        setTotalAmount(totalAmount - item.price);
      } else {
        setCart(cart.filter((cartItem) => cartItem.id !== item.id));
        setTotalAmount(totalAmount - item.price);
      }
    }
  };

  const getQuantity = (itemId) => {
    const itemInCart = cart.find((item) => item.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const generateOrderString = (orderItems, userId) => {
    const itemsString = orderItems
      .map((item) => `${item.slot} ${item.quantity}`)
      .join(" ");
    return `${itemsString} ${userId}`;
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to the cart.");
      return;
    }

    setIsLoading(true);

    const orderItems = cart.map((item) => ({
      slot: item.slot,
      quantity: item.quantity,
    }));

    // Hardcoded user ID for now - you can replace this with actual user ID later
    const userId = "USER" + Math.random().toString(36).substr(2, 6);

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customerName: "Current User",
        items: orderItems,
        totalAmount,
        orderDate: new Date().toISOString(),
        userId: userId,
      });

      // Generate QR code data
      const qrData = generateOrderString(orderItems, userId);
      setOrderQRData(qrData);

      // Simulate payment processing
      setTimeout(() => {
        setIsLoading(false);
        setShowQRCode(true);
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
      setIsLoading(false);
    }
  };

  if (showQRCode) {
    return <QRCodeDisplay orderData={orderQRData} cartItems={cart} />;
  }

  return (
    <div className="bg-gray-100 p-5 min-h-screen relative">
      {isLoading && <LoadingScreen />}

      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Welcome to I-VEND
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <Card key={item.id} className="rounded overflow-hidden">
            <CardContent>
              <img
                src={item.img}
                alt={item.name}
                className="h-30 w-30 mx-auto object-cover rounded"
              />
              <p className="text-center mt-2 text-lg font-semibold">
                Ordered: {getQuantity(item.id)}
              </p>
              <CardTitle className="text-xl font-semibold mt-3 text-center">
                {item.name}
              </CardTitle>
              <CardDescription className="text-gray-700 text-center">
                ${item.price}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
              <button
                onClick={() => removeFromCart(item)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                -
              </button>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                +
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-white mt-10 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Cart</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {item.name} - ${item.price} x {item.quantity}
                </span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty</p>
        )}
        {cart.length > 0 && (
          <div className="mt-4 text-xl font-bold">Total: ${totalAmount}</div>
        )}
        <button
          onClick={placeOrder}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default HomePage;
