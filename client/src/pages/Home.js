import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import "../App.css";

function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hadTasksBefore, setHadTasksBefore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://adaptable-gentleness-production.up.railway.app/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        if (data.length > 0) setHadTasksBefore(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;

    fetch("https://adaptable-gentleness-production.up.railway.app/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setTask("");
        setHadTasksBefore(true);
      })
      .catch((err) => console.error(err));
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    if (!taskToDelete || !taskToDelete._id) return;

    fetch(`https://adaptable-gentleness-production.up.railway.app/api/tasks/${taskToDelete._id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

  const toggleTaskCompletion = (index) => {
    const task = tasks[index];
    if (!task || !task._id) return;

    const updatedCompletion = !task.completed;

    fetch(`https://adaptable-gentleness-production.up.railway.app/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: updatedCompletion }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        const updatedTasks = tasks.map((t, i) =>
          i === index ? { ...t, completed: updatedTask.completed } : t
        );
        setTasks(updatedTasks);
      })
      .catch((err) => console.error(err));
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="app-container">
      <h1>TaskSync – ToDo App</h1>

      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button onClick={addTask}>Add Task</button>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        hadTasksBefore ? (
          <div className="hurray-banner">🎉 Hurray! All tasks completed! 🎉</div>
        ) : (
          <div className="start-message">
            🌞 Let's start your day by adding some tasks!
          </div>
        )
      ) : (
        <>
          {incompleteTasks.length > 0 && (
            <>
              <h2>📝 Tasks To Do</h2>
              <TaskList
                tasks={incompleteTasks}
                deleteTask={deleteTask}
                toggleTaskCompletion={toggleTaskCompletion}
              />
            </>
          )}

          {completedTasks.length > 0 && (
            <>
              <h2>✅ Completed Tasks</h2>
              <TaskList
                tasks={completedTasks}
                deleteTask={deleteTask}
                toggleTaskCompletion={toggleTaskCompletion}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;