import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchNutritionMock } from "./mockApi";

const defaultTargets = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 70,
    fiber: 30,
};

export default function LogPage({ currentDay }) {
    const [foods, setFoods] = useState([]);
    const [input, setInput] = useState("");
    const [targets, setTargets] = useState(defaultTargets);
    const [showTargets, setShowTargets] = useState(false);

    const inputRef = useRef(null);
    const foodListRef = useRef(null);

    // --- Local Storage Helpers ---
    const saveDailyLogs = (day, foodsToSave) => {
        const stored = JSON.parse(localStorage.getItem("dailyLogs") || "{}");
        stored[day] = foodsToSave;
        localStorage.setItem("dailyLogs", JSON.stringify(stored));
    };

    const loadDailyLogs = (day) => {
        const stored = JSON.parse(localStorage.getItem("dailyLogs") || "{}");
        return stored[day] || [];
    };

    // --- Load saved foods when day changes ---
    useEffect(() => {
        const savedFoods = loadDailyLogs(currentDay);
        setFoods(savedFoods);
    }, [currentDay]);

    // --- Calculate totals using useMemo ---
    const totals = useMemo(() => {
        return foods.reduce(
            (acc, f) => ({
                calories: acc.calories + (Number(f.calories) || 0),
                protein: acc.protein + (Number(f.protein) || 0),
                carbs: acc.carbs + (Number(f.carbs) || 0),
                fat: acc.fat + (Number(f.fat) || 0),
                fiber: acc.fiber + (Number(f.fiber) || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );
    }, [foods]);

    // --- Handlers ---
    const handleAdd = async () => {
        if (!input.trim()) return;
        try {
            const nutrition = await fetchNutritionMock(input.trim());
            const newFood = {
                ...nutrition,
                baseCalories: nutrition.calories,
                baseProtein: nutrition.protein,
                baseCarbs: nutrition.carbs,
                baseFat: nutrition.fat,
                baseFiber: nutrition.fiber,
                amount: 1,
                unit: "serving",
            };
            const updatedFoods = [...foods, newFood];
            setFoods(updatedFoods);
            saveDailyLogs(currentDay, updatedFoods);
            setInput("");
            if (inputRef.current) inputRef.current.textContent = "";
            setTimeout(() => {
                if (foodListRef.current)
                    foodListRef.current.scrollTop = foodListRef.current.scrollHeight;
            }, 100);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch nutrition info");
        }
    };

    const handleDelete = (index) => {
        const updatedFoods = foods.filter((_, i) => i !== index);
        setFoods(updatedFoods);
        saveDailyLogs(currentDay, updatedFoods);
    };

    const handleUpdate = (index) => {
        const updatedFoods = foods.map((food, i) => {
            if (i !== index) return food;
            const amt = Number(food.amount) || 1;
            return {
                ...food,
                calories: Math.round(food.baseCalories * amt),
                protein: +(food.baseProtein * amt).toFixed(1),
                carbs: +(food.baseCarbs * amt).toFixed(1),
                fat: +(food.baseFat * amt).toFixed(1),
                fiber: +(food.baseFiber * amt).toFixed(1),
            };
        });
        setFoods(updatedFoods);
        saveDailyLogs(currentDay, updatedFoods);
    };

    const handleFieldChange = (index, field, value) => {
        setFoods((prev) =>
            prev.map((food, i) =>
                i === index ? { ...food, [field]: value } : food
            )
        );
    };

    useEffect(() => {
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


    const calcPercent = (nutrient) =>
        Math.round((totals[nutrient] / targets[nutrient]) * 100);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    const displayDay = currentDay === today ? "Today" : currentDay;

    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            setIsLoadingSuggest(true);

            const res = await fetch(
                `https://edamam-food-and-grocery-database.p.rapidapi.com/auto-complete?q=${encodeURIComponent(query)}`,
                {
                    method: "GET",
                    headers: {
                        'x-rapidapi-key': '670b8ee474mshc1ece69a82160d2p16f5c2jsn2a8bc870e451',
                        'x-rapidapi-host': 'edamam-food-and-grocery-database.p.rapidapi.com'
                    }
                }
            );

            const data = await res.json();

            // Data is an array of text-only suggestions
            setSuggestions(data.slice(0, 6)); // limit for UI
        } catch (err) {
            console.error("Autocomplete error:", err);
        } finally {
            setIsLoadingSuggest(false);
        }
    };



    return (
        <div className="page">
            <h2>Log Food - {displayDay}</h2>

            {/* FOOD LIST */}
            <ul className="food-list" ref={foodListRef}>
                {foods.map((food, i) => (
                    <li key={i} className="food-card">
                        <div className="food-title">{food.name}</div>
                        <div className="food-details">
                            <div className="amount-container">
                                <input
                                    type="number"
                                    className="amount-input"
                                    min="0.1"
                                    step="0.1"
                                    value={food.amount}
                                    onChange={(e) =>
                                        handleFieldChange(i, "amount", Number(e.target.value))
                                    }
                                />
                                <select
                                    className="unit-select"
                                    value={food.unit}
                                    onChange={(e) =>
                                        handleFieldChange(i, "unit", e.target.value)
                                    }
                                >
                                    <option value="serving">serving</option>
                                    <option value="g">g</option>
                                    <option value="cup">cup</option>
                                    <option value="slice">slice</option>
                                    <option value="large">large</option>
                                    <option value="medium">medium</option>
                                </select>
                                <button className="update-amount-btn" onClick={() => handleUpdate(i)}>Update</button>

                            </div>

                            <div className="food-macros">
                                <p>Calories: <strong>{food.calories}</strong> kcal</p>
                                <p>Protein: <strong>{food.protein}g</strong></p>
                                <p>Carbs: <strong>{food.carbs}g</strong></p>
                                <p>Fat: <strong>{food.fat}g</strong></p>
                                <p>Fiber: <strong>{food.fiber}g</strong></p>
                            </div>

                            <button className="remove-btn" onClick={() => handleDelete(i)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* DAILY TOTALS */}
<div className="totals-card">
  <h3>
    Daily Totals
    <button
      id="editTargetsBtn"
      onClick={() => setShowTargets(!showTargets)}
      title="Click to edit daily targets"
    >
      ⚙️
    </button>
  </h3>

  {/* Targets Panel */}
  <div id="targetsPanel" className={showTargets ? "show" : ""}>
    {Object.keys(targets).map((nutr) => (
      <p key={nutr}>
        {nutr.charAt(0).toUpperCase() + nutr.slice(1)}:{" "}
        <input
          type="number"
          value={targets[nutr]}
          onChange={(e) =>
            setTargets((prev) => ({ ...prev, [nutr]: Number(e.target.value) }))
          }
        />{" "}
        {nutr === "calories" ? "kcal" : "g"}
      </p>
    ))}
  </div>

  {/* Totals and Progress Bars */}
  {Object.keys(totals).map((nutr) => {
    const percent = Math.round((totals[nutr] / targets[nutr]) * 100);
    const overPercent = Math.max(0, percent - 100);
    const cappedOver = Math.min(overPercent, 100);
    const pinkIntensity = 200 + Math.round((55 * cappedOver) / 100);
    const barColor =
      percent > 100
        ? `rgb(${pinkIntensity}, 60, 120)`
        : `linear-gradient(to right, var(--frosted-blue), var(--icy-aqua))`;

    const unit = nutr === "calories" ? "kcal" : "g";

    return (
      <div key={nutr} className="nutrient">
        <p>
          {nutr.charAt(0).toUpperCase() + nutr.slice(1)}: {totals[nutr]} {unit} (
          {percent}% of daily target)
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(percent, 100)}%`,
              background: barColor,
            }}
          ></div>
        </div>
      </div>
    );
  })}
</div>


            {/* FOOD INPUT */}
              <div id="foodInputContainer">
            <div
                contentEditable
                className="food-input"
                ref={inputRef}
                data-placeholder="Enter a food here..."
                onInput={(e) => {
                    const value = e.currentTarget.textContent;
                    setInput(value);
                    fetchSuggestions(value);  
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                    }
                }}
            ></div>
                <button id="addBtn" onClick={handleAdd}>Add</button>

           
             {/* AUTOCOMPLETE */}
  {suggestions.length > 0 && (
    <ul className="autocomplete-list">
      {suggestions.map((item, idx) => (
        <li
          key={idx}
          className="autocomplete-item"
          onClick={() => {
            setInput(item);
            if (inputRef.current) inputRef.current.textContent = item;
            setSuggestions([]);
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  )}
 </div>
        </div>
    );
}

