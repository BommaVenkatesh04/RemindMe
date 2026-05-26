import React, { useRef, useState } from "react";

export default function TaskForm({ addTask }) {

  /* FORM STATE */

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  /* INPUT REFERENCES */

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  /* HANDLE SUBMIT */

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent empty task
    if (!task.trim()) return;

    const newTask = {
      taskName: task,
      priority,
      category,
      date: dueDate,
      time: dueTime,
      completed: false,
    };

    addTask(newTask);

    // Reset form
    setTask("");
    setPriority("Medium");
    setCategory("General");
    setDueDate("");
    setDueTime("");
  };

  /* UI RENDER */

  return (
    <form onSubmit={handleSubmit} className="task-form">

      {/* TASK INPUT SECTION */}
      <div id="inp">

        <input
          type="text"
          placeholder="✨ Enter your next task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button type="submit">
          + Add Task
        </button>

      </div>

      {/* OPTIONS SECTION */}
      <div id="btns">

        {/* PRIORITY SELECT */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🌿 Low</option>
        </select>

        {/* CATEGORY SELECT */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">📌 General</option>
          <option value="Work">💼 Work</option>
          <option value="Personal">🏠 Personal</option>
          <option value="Study">📚 Study</option>
          <option value="Health">💪 Health</option>
        </select>

        {/* DATE PICKER BUTTON */}
        <button
          type="button"
          className="action-btn"
          onClick={() => dateRef.current?.showPicker()}
        >
          📅 Select Date
        </button>

        <input
          ref={dateRef}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ display: "none" }}
        />

        {/* TIME PICKER BUTTON */}
        <button
          type="button"
          className="action-btn"
          onClick={() => timeRef.current?.showPicker()}
        >
          ⏰ Select Time
        </button>

        <input
          ref={timeRef}
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          style={{ display: "none" }}
        />

      </div>

    </form>
  );
}