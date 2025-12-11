import React, { useEffect, useState } from "react";
import { fetchNutritionMock } from "./mockApi";

export default function FoodCard({
  food,
  currentDate,
  dailyLogs,
  setDailyLogs,
  useMock = true,
  APP_ID,
  APP_KEY,
}) {
  const [nutrients, setNutrients] = useState(food);

  useEffect(() => {
    fetchNutrition(food);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food, currentDate]);

  const fetchNutrition = async (foodItem) => {
    try {
      let updated;

      if (useMock) {
        updated = await fetchNutritionMock(foodItem);
      } else {
        const ingrText = `${foodItem.amount} ${foodItem.unit} ${foodItem.name}`;
        const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(ingrText)}`;
        const res = await fetch(url);
        const data = await res.json();
        const ing = data.ingredients?.[0]?.parsed?.[0]?.nutrients ?? {};
        updated = {
          ...foodItem,
          calories: Math.round(ing.ENERC_KCAL?.quantity || 0),
          protein: +(ing.PROCNT?.quantity || 0).toFixed(1),
          carbs: +(ing.CHOCDF?.quantity || 0).toFixed(1),
          fat: +(ing.FAT?.quantity || 0).toFixed(1),
          fiber: +(ing.FIBTG?.quantity || 0).toFixed(1),
        };
      }

      setNutrients(updated);

      // Update dailyLogs
      const updatedLogs = [...(dailyLogs[currentDate] || [])];
      const idx = updatedLogs.findIndex((f) => f.name === updated.name);
      if (idx >= 0) updatedLogs[idx] = updated;
      else updatedLogs.push(updated);
      setDailyLogs({ ...dailyLogs, [currentDate]: updatedLogs });
    } catch (err) {
      console.error("API fetch error", err);
    }
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setNutrients({ ...nutrients, amount: newAmount });
  };

  const handleUnitChange = (e) => {
    setNutrients({ ...nutrients, unit: e.target.value });
  };

  const handleUpdate = () => fetchNutrition(nutrients);

  const handleRemove = () => {
    const updatedLogs = (dailyLogs[currentDate] || []).filter(
      (f) => f.name !== nutrients.name
    );
    setDailyLogs({ ...dailyLogs, [currentDate]: updatedLogs });
  };

  return (
    <li>
      <div className="food-card">
        <div className="food-title">{nutrients.name}</div>
        <div className="amount-container">
          <input
            type="number"
            className="amount-input"
            value={nutrients.amount}
            min="0.1"
            step="0.1"
            onChange={handleAmountChange}
          />
          <select
            className="unit-select"
            value={nutrients.unit}
            onChange={handleUnitChange}
          >
            <option value="serving">serving</option>
            <option value="g">g</option>
            <option value="cup">cup</option>
            <option value="slice">slice</option>
            <option value="large">large</option>
            <option value="medium">medium</option>
          </select>
          <button className="update-amount-btn" onClick={handleUpdate}>
            Update
          </button>

        </div>
        <div className="food-macros">
          <p>Calories: <strong>{nutrients.calories}</strong> kcal</p>
          <p>Protein: <strong>{nutrients.protein}g</strong></p>
          <p>Carbs: <strong>{nutrients.carbs}g</strong></p>
          <p>Fat: <strong>{nutrients.fat}g</strong></p>
          <p>Fiber: <strong>{nutrients.fiber}g</strong></p>
        </div>
                  <button className="remove-btn" onClick={handleRemove}>
            Remove
          </button>
      </div>
    </li>
  );
}
