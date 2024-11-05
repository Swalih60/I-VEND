"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [items] = useState([
    { id: 1, name: "7UP", price: 2, img: "/7up.png" },
    { id: 2, name: "Lays", price: 3, img: "/image.png" },
    { id: 3, name: "Notebook", price: 5, img: "/images/notebook.jpg" },
    { id: 4, name: "Record", price: 8, img: "/images/record.jpg" },
    { id: 5, name: "Rough Record", price: 4, img: "/images/rough-record.jpg" },
    { id: 6, name: "Pen", price: 1, img: "/images/pen.jpg" },
    { id: 7, name: "Packet Chips", price: 3, img: "/images/packet-chips.jpg" },
    { id: 8, name: "Chocolate Bar", price: 2, img: "/images/chocolate.jpg" },
    { id: 9, name: "Water Bottle", price: 2, img: "/images/water.jpg" },
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

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to the cart.");
      return;
    }

    alert("Order placed successfully!");
    setCart([]);
    setTotalAmount(0);
  };

  return (
    <div className="bg-gray-100 p-5 min-h-screen relative">
      <div className="absolute top-0 right-0 p-5 font-bold text-xl">
        Cart Total: ${totalAmount}
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
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
              <CardTitle className="text-xl font-semibold mt-3 text-center">{item.name}</CardTitle>
              <CardDescription className="text-gray-700 text-center">${item.price}</CardDescription>
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
              <li key={index} className="flex justify-between items-center mb-2">
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
