// mockApi.js
export const fetchNutritionMock = async (foodName) => {
  const calories = Math.floor(Math.random() * 500) + 50
  const protein = Math.floor(Math.random() * 30)
  const carbs = Math.floor(Math.random() * 80)
  const fat = Math.floor(Math.random() * 20)
  const fiber = Math.floor(Math.random() * 10)

  return {
    name: foodName,
    baseCalories: calories,
    baseProtein: protein,
    baseCarbs: carbs,
    baseFat: fat,
    baseFiber: fiber,
    calories,
    protein,
    carbs,
    fat,
    fiber,
  }
}
