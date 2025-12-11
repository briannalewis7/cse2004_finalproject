import React from "react";

export default function DailyTotals({ foodCards }) {
  const totals = foodCards.reduce(
    (acc, f) => {
      acc.calories += f.calories || 0;
      acc.protein += f.protein || 0;
      acc.carbs += f.carbs || 0;
      acc.fat += f.fat || 0;
      acc.fiber += f.fiber || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const dailyTargets = { calories: 2000, protein: 50, carbs: 275, fat: 70, fiber: 30 };
  const percent = (val, target) => Math.round((val / target) * 100);

  return (
    <div className="totals-card">
      <h3>Daily Totals</h3>
      <div className="nutrient">
        <p>Calories: {totals.calories} kcal ({percent(totals.calories, dailyTargets.calories)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: Math.min(percent(totals.calories, dailyTargets.calories), 100) + "%" }}></div>
        </div>
      </div>
      <div className="nutrient">
        <p>Protein: {totals.protein} g ({percent(totals.protein, dailyTargets.protein)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: Math.min(percent(totals.protein, dailyTargets.protein), 100) + "%" }}></div>
        </div>
      </div>
      <div className="nutrient">
        <p>Carbs: {totals.carbs} g ({percent(totals.carbs, dailyTargets.carbs)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: Math.min(percent(totals.carbs, dailyTargets.carbs), 100) + "%" }}></div>
        </div>
      </div>
      <div className="nutrient">
        <p>Fat: {totals.fat} g ({percent(totals.fat, dailyTargets.fat)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: Math.min(percent(totals.fat, dailyTargets.fat), 100) + "%" }}></div>
        </div>
      </div>
      <div className="nutrient">
        <p>Fiber: {totals.fiber} g ({percent(totals.fiber, dailyTargets.fiber)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: Math.min(percent(totals.fiber, dailyTargets.fiber), 100) + "%" }}></div>
        </div>
      </div>
    </div>
  );
}
