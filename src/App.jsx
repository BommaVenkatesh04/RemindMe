import { useState, useEffect, useRef } from "react";

import TaskForm from "./Components/Taskform";
import TaskList from "./Components/Tasklist";
import ProgressTracker from "./Components/Progresstracker";

import "./Style.css";

export default function App() {

  /* =========================
      STATE MANAGEMENT
  ========================= */

  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [darkMode, setDarkMode] = useState(true);

  /* =========================
      REFS (AUDIO HANDLING)
  ========================= */

  const audioRef = useRef(null);
  const stopTimerRef = useRef(null);

  /* =========================
      INITIAL SETUP (EFFECTS)
  ========================= */

  // Initialize alarm audio
  useEffect(() => {
    audioRef.current = new Audio(
      import.meta.env.BASE_URL + "alarm.mp3"
    );

    audioRef.current.loop = true;
  }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Unlock audio for browser autoplay policies
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

  /* =========================
      ALARM FUNCTIONS
  ========================= */

  // Play alarm sound
  const playAlarmSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch((err) => {
      console.log("Audio blocked:", err);
    });

    stopTimerRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 15000);
  };

  // Stop alarm
  const stopAlarm = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
  };

  // Snooze alarm
  const snoozeAlarm = (task) => {
    stopAlarm();

    setTimeout(() => {
      triggerAlarm(task);
    }, 5 * 60 * 1000);
  };

  // Trigger alarm
  const triggerAlarm = (task) => {

    playAlarmSound();

    if (Notification.permission === "granted") {
      new Notification("⏰ Task Reminder", {
        body: `${task.taskName} is due now!`,
      });
    }

    const userChoice = window.confirm(
      `⏰ ${task.taskName} is due now!\n\nOK = STOP\nCancel = SNOOZE 5 MIN`
    );

    if (userChoice) {
      stopAlarm();
    } else {
      snoozeAlarm(task);
    }
  };

  // Schedule alarm
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

  /* =========================
      TASK OPERATIONS
  ========================= */

  // Add task
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };

    setTasks((prev) => [...prev, newTask]);
    scheduleAlarm(newTask);
  };

  // Update task
  const updateTask = (updatedTask, index) => {
    const updated = [...tasks];
    updated[index] = updatedTask;
    setTasks(updated);
  };

  // Delete task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Clear all tasks
  const clearTasks = () => {
    setTasks([]);
  };

  /* =========================
      UI RENDER
  ========================= */

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>

      <div className="app-container">

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

        {/* PROGRESS TRACKER */}
        <ProgressTracker tasks={tasks} />

        {/* CLEAR BUTTON */}
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearTasks}>
            Clear All Tasks
          </button>
        )}

      </div>
    </div>
  );
}