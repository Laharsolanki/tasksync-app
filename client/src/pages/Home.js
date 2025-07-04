import TaskList from "../components/TaskList";
import React, { useState, useEffect } from "react";
import "../App.css";

function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from server
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Add task to DB
  const addTask = () => {
    if (task.trim() === "") return;
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTask("");
      })
      .catch((err) => console.error(err));
  };

  // Delete task from DB
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(tasks.filter((t) => t._id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>TaskSync – ToDo App</h1>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <TaskList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
}

export default Home;
