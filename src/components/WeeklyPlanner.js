import React from "react"

export default function PlannerPage({ setPage, setCurrentDay }) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

  const handleDayClick = (day) => {
    setCurrentDay(day) // pass selected day to LogPage
    setPage("log")      // navigate to LogPage
  }

  return (
    <div className="page">
      <h2>Weekly Log </h2>
      <h3>Click on a day of the week to log food for that day</h3>
      <div className="planner-grid">
        {days.map((day) => (
          <button
            key={day}
            className="day-card"
            onClick={() => handleDayClick(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
