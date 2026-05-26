export default function ProgressTracker({ tasks }) {

  /* TASK ANALYSIS */

  // Count completed tasks
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  // Total number of tasks
  const totalTasks = tasks.length;

  // Calculate progress percentage
  const progress =
    totalTasks === 0
      ? 0
      : (completedTasks / totalTasks) * 100;

  /* UI RENDER */

  return (
    <div className="progress-tracker">

      {/* HEADER SECTION */}
      <div className="progress-header">

        <h3>📊 Productivity Tracker</h3>

        <span>
          {completedTasks} / {totalTasks} Completed
        </span>

      </div>

      {/* PROGRESS BAR */}
      <div className="progress-bar">

        <div
          className="progress"
          style={{ width: `${progress}%` }}
        ></div>

      </div>

      {/* PERCENTAGE TEXT */}
      <p className="progress-text">
        {progress.toFixed(0)}% Productivity Completed 
      </p>

    </div>
  );
}