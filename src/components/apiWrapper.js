import { fetchNutritionMock } from "./mockApi"
const USE_MOCK = false

export const fetchNutrition = async (foodName, APP_ID, APP_KEY, amount = 1, unit = "serving") => {
  if (USE_MOCK) return fetchNutritionMock(foodName)

  // Construct the ingredient string properly for Edamam
  const ingredientString = `${amount} ${unit} ${foodName}`
  const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(
    ingredientString
  )}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    // Grab nutrients from the first parsed ingredient
    const ing = data.ingredients?.[0]?.parsed?.[0]?.nutrients ?? {}

    return {
      name: foodName,
      amount,
      unit,
      calories: Math.round(ing.ENERC_KCAL?.quantity || 0),
      protein: +(ing.PROCNT?.quantity || 0).toFixed(1),
      carbs: +(ing.CHOCDF?.quantity || 0).toFixed(1),
      fat: +(ing.FAT?.quantity || 0).toFixed(1),
      fiber: +(ing.FIBTG?.quantity || 0).toFixed(1),
    }
  } catch (err) {
    console.error("API fetch error", err)
    return {
      name: foodName,
      amount,
      unit,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    }
  }
}
