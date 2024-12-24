// Base URL for API requests
const API_URL = "http://localhost:3000/tasks";

// Fetch tasks from backend
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Render tasks to the UI
function renderTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear previous tasks

  tasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.classList.add(task.completed ? "completed" : "");
    taskItem.textContent = task.name;

    // Add buttons for delete, complete, edit
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.onclick = () => markTaskAsCompleted(task.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(task.id);

    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
}

// Add new task
async function addTask(taskName) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: taskName }),
    });

    if (response.ok) {
      fetchTasks(); // Refresh task list
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

// Delete task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchTasks(); // Refresh task list
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

// Mark task as completed
async function markTaskAsCompleted(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}/completed`, {
      method: "PATCH",
    });

    if (response.ok) {
      fetchTasks(); // Refresh task list
    }
  } catch (error) {
    console.error("Error marking task as completed:", error);
  }
}

// Add event listener for form submission
document.getElementById("add-task-form").addEventListener("submit", event => {
  event.preventDefault();
  const taskNameInput = document.getElementById("task-name");
  const taskName = taskNameInput.value.trim();

  if (taskName) {
    addTask(taskName);
    taskNameInput.value = ""; // Clear input field
  }
});

// Initial fetch of tasks
fetchTasks();
