import React, { useState } from "react";

export default function FoodInput({ addFood }) {
  const [foodName, setFoodName] = useState("");

  const handleAdd = () => {
    if (!foodName) return;
    addFood({ name: foodName, amount: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    setFoodName("");
  };

  return (
    <div id="foodInputContainer">
      <input
        type="text"
        value={foodName}
        placeholder="Type a food..."
        onChange={(e) => setFoodName(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
