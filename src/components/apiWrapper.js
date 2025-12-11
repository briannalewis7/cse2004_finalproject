// apiWrapper.js
import { fetchNutritionMock } from "./mockApi";

const USE_MOCK = true; // toggle this to false for real API

export const fetchNutrition = async (foodName, APP_ID, APP_KEY) => {
  if (USE_MOCK) return fetchNutritionMock(foodName);

  const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(
    foodName
  )}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const ing = data.ingredients?.[0]?.parsed?.[0]?.nutrients ?? {};

    return {
      name: foodName,
      amount: 1,
      unit: "serving",
      calories: Math.round(ing.ENERC_KCAL?.quantity || 0),
      protein: +(ing.PROCNT?.quantity || 0).toFixed(1),
      carbs: +(ing.CHOCDF?.quantity || 0).toFixed(1),
      fat: +(ing.FAT?.quantity || 0).toFixed(1),
      fiber: +(ing.FIBTG?.quantity || 0).toFixed(1),
    };
  } catch (err) {
    console.error("API fetch error", err);
    return {
      name: foodName,
      amount: 1,
      unit: "serving",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }
};
