import React, { useState } from "react";
import HomePage from "./components/HomePage";
import LogPage from "./components/LogPage";
import PlannerPage from "./components/WeeklyPlanner";
import "./style.css";

export default function App() {
  const [page, setPage] = useState("home"); // home | log | planner
  const [currentDay, setCurrentDay] = useState(""); // track the day for LogPage

  const getTodayDay = () => {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[new Date().getDay()];
  };

  const handleLogToday = () => {
    const today = getTodayDay();
    setCurrentDay(today);
    setPage("log");
  };

  return (
    <div className="App">
      <header>
        <h1>Food Tracker</h1>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={handleLogToday}>Log Today's Food</button>
          <button onClick={() => setPage("planner")}>Weekly Planner</button>
        </nav>
      </header>

{page === "home" && (
  <HomePage setPage={setPage} handleLogToday={handleLogToday} />
)}
      {page === "log" && <LogPage currentDay={currentDay} />}
      {page === "planner" && (
        <PlannerPage setPage={setPage} setCurrentDay={setCurrentDay} />
      )}
    </div>
  );
}
