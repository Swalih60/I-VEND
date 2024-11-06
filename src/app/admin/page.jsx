"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminPage() {
  const rows = ["A", "B", "C"];
  const columns = [1, 2, 3];
  const [items, setItems] = useState({});

  const handleUpdate = () => {
    toast.success("Products successfully updated");
    // Save the items data to the backend or database as needed
  };

  const handleInputChange = (slot, field, value) => {
    setItems((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        [field]: value,
      },
    }));
  };

  const handleImageChange = (slot, file) => {
    // Create a URL for the selected file to display itq
    const imageUrl = URL.createObjectURL(file);
    handleInputChange(slot, "image", imageUrl);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Admin Panel - Vending Machine Slots
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {rows.map((row) =>
          columns.map((col) => {
            const slot = `${row}${col}`;
            return (
              <div
                key={slot}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center space-y-4 w-full max-w-xs"
              >
                <h2 className="text-lg font-semibold">{slot}</h2>

                {/* Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm w-full"
                  onChange={(e) => handleImageChange(slot, e.target.files[0])}
                />

                {/* Image Preview */}
                {items[slot]?.image && (
                  <img
                    src={items[slot].image}
                    alt={`Preview of ${slot}`}
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}

                {/* Amount Input */}
                <input
                  type="number"
                  placeholder="Amount"
                  className="border border-gray-300 rounded-md p-2 w-full text-center"
                  onChange={(e) =>
                    handleInputChange(slot, "amount", e.target.value)
                  }
                />

                {/* Quantity Input */}
                <input
                  type="number"
                  placeholder="Quantity"
                  className="border border-gray-300 rounded-md p-2 w-full text-center"
                  onChange={(e) =>
                    handleInputChange(slot, "quantity", e.target.value)
                  }
                />
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={handleUpdate}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Update
      </button>

      <ToastContainer />
    </div>
  );
}

export default AdminPage;
