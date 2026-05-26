import { useState, useEffect, useRef } from "react";

import TaskForm from "./Components/Taskform";
import TaskList from "./Components/Tasklist";
import ProgressTracker from "./Components/Progresstracker";

import "./Style.css";

export default function App() {

  /* STATE */

  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [darkMode, setDarkMode] = useState(true);

  //  ACTIVE ALARM TASK (NEW)
  const [activeAlarmTask, setActiveAlarmTask] = useState(null);

  /*  AUDIO REFS */

  const audioRef = useRef(null);
  const stopTimerRef = useRef(null);

  /*  INIT AUDIO */

  useEffect(() => {
    audioRef.current = new Audio(
      import.meta.env.BASE_URL + "alarm.mp3"
    );

    audioRef.current.loop = true;
  }, []);

  /*  NOTIFICATIONS */

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /*  LOCAL STORAGE */

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /*  UNLOCK AUDIO */

  useEffect(() => {
    const unlockAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {});
    };

    document.addEventListener("click", unlockAudio, { once: true });
  }, []);

  /* ALARM FUNCTIONS */

  const playAlarmSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch(() => {});

    stopTimerRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 15000);
  };

  const stopAlarm = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
  };

  /* NEW ALARM SYSTEM */

  const triggerAlarm = (task) => {
    playAlarmSound();

    setActiveAlarmTask(task); // 👈 SHOW POPUP

    if (Notification.permission === "granted") {
      new Notification("⏰ Task Reminder", {
        body: `${task.taskName} is due now!`,
      });
    }
  };

  const snoozeAlarm = (task) => {
    stopAlarm();
    setActiveAlarmTask(null);

    setTimeout(() => {
      triggerAlarm(task);
    }, 5 * 60 * 1000);
  };

  /* SCHEDULE ALARM */

  const scheduleAlarm = (task) => {
    if (!task.date || !task.time) return;

    const taskDateTime = new Date(`${task.date}T${task.time}:00`);
    const now = new Date();

    const delay = taskDateTime - now;

    if (delay > 0) {
      setTimeout(() => {
        triggerAlarm(task);
      }, delay);
    }
  };

  /* TASK OPERATIONS */

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };

    setTasks((prev) => [...prev, newTask]);
    scheduleAlarm(newTask);
  };

  const updateTask = (updatedTask, index) => {
    const updated = [...tasks];
    updated[index] = updatedTask;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  /*  UI */

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>

      <div className="app-container">

        {/* ALARM POPUP (NEW UI) */}
        {activeAlarmTask && (
          <div className="alarm-popup">

            <h3>⏰ {activeAlarmTask.taskName}</h3>
            <p>Task is due now</p>

            <div className="alarm-buttons">

              <button
                className="stop-btn"
                onClick={() => {
                  stopAlarm();
                  setActiveAlarmTask(null);
                }}
              >
                ⛔ Stop
              </button>

              <button
                className="snooze-btn"
                onClick={() => snoozeAlarm(activeAlarmTask)}
              >
                😴 Snooze 5 min
              </button>

            </div>

          </div>
        )}

        {/* HEADER */}
        <header>
          <div className="header-top">

            <div>
              <h1>RemindMe</h1>
              <p>Manage Your Tasks Smarter 🚀</p>
            </div>

            <button
              className="theme-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

          </div>
        </header>

        {/* TASK FORM */}
        <TaskForm addTask={addTask} />

        {/* TASK LIST */}
        <TaskList
          tasks={tasks}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />

        {/* PROGRESS */}
        <ProgressTracker tasks={tasks} />

        {/* CLEAR */}
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearTasks}>
            Clear All Tasks
          </button>
        )}

      </div>
    </div>
  );
}