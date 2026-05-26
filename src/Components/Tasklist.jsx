import React from "react";

export default function TaskList({
  tasks,
  updateTask,
  deleteTask,
}) {

  /* TASK ACTIONS */

  // Toggle task completion status
  const toggleComplete = (index) => {
    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed,
    };

    updateTask(updatedTask, index);
  };

  /*  UI RENDER */

  return (
    <ul className="task-list">

      {/* EMPTY STATE */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No Tasks Yet !</h2>
          <p>Start adding tasks and get things done faster.</p>
        </div>
      ) : (
        tasks.map((task, index) => (
          <li
            key={index}
            className={task.completed ? "completed" : ""}
          >

            {/* =========================
                TASK DETAILS
            ========================= */}

            <div className="task-content">

              {/* TASK TITLE */}
              <span className="task-title">
                {task.taskName}
              </span>

              {/* PRIORITY + CATEGORY */}
              <span className="task-priority">

                {task.priority === "High" && "🔥"}
                {task.priority === "Medium" && "⚡"}
                {task.priority === "Low" && "🌿"}

                {" "}
                {task.priority} • {task.category}

              </span>

              {/* DATE & TIME */}
              {(task.date || task.time) && (
                <span className="task-priority">
                  📅 {task.date} {" "} ⏰ {task.time}
                </span>
              )}

            </div>

            {/* =========================
                ACTION BUTTONS
            ========================= */}

            <div className="task-actions">

              {/* COMPLETE / UNDO */}
              <button
                className="complete-btn"
                onClick={() => toggleComplete(index)}
              >
                {task.completed ? "↩ Undo" : "✔ Complete"}
              </button>

              {/* DELETE TASK */}
              <button
                className="delete-btn"
                onClick={() => deleteTask(index)}
              >
                🗑 Delete
              </button>

            </div>

          </li>
        ))
      )}

    </ul>
  );
}