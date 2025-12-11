import React from "react";

export default function HomePage({ setPage, handleLogToday }) {
  return (
    <section className="page">
      <div className="home-card">
        <h2>Welcome!</h2>
        <p>Track your meals, view nutrition, and plan your week.</p>
      </div>
      <div className="home-grid">
        <div className="home-link" onClick={handleLogToday}>
          <h3>Log Today's Food</h3>
        </div>
        <div className="home-link" onClick={() => setPage("planner")}>
          <h3>Weekly Meal Planner</h3>
        </div>
      </div>
    </section>
  );
}
