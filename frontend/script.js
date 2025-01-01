// Base URL for API endpoints
const API_URL = "http://localhost:3000/tasks";

// Fetch tasks from backend
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Render all tasks to the DOM
function renderTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear current tasks
    tasks.forEach((task) => appendTask(task));
}

// Append a single task to the task list
function appendTask(task) {
    const taskList = document.getElementById("task-list");
    const taskItem = document.createElement("li");
    
    // Set completed class if task is done
    taskItem.className = task.completed ? "completed" : "";
    
    // Create task HTML structure
    taskItem.innerHTML = `
        <span id="task-name-${task.id}">${task.name}</span>
        <div class="task-buttons">
            <button class="edit">Edit</button>
            <button class="complete">Complete</button>
            <button class="delete">Delete</button>
        </div>
    `;

    // Add event listeners using proper event handling
    const editBtn = taskItem.querySelector('.edit');
    const completeBtn = taskItem.querySelector('.complete');
    const deleteBtn = taskItem.querySelector('.delete');

    editBtn.addEventListener('click', () => editTask(task.id));
    completeBtn.addEventListener('click', () => markTaskAsCompleted(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(taskItem);
}

// Handle editing of a task
function editTask(taskId) {
    console.log("Editing task with ID:", taskId);
    const taskNameSpan = document.getElementById(`task-name-${taskId}`);
    const currentName = taskNameSpan.textContent;

    // Create input field and save button
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = `edit-input-${taskId}`;
    inputField.value = currentName;
    inputField.maxLength = 50;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "save-btn";

    // Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-btn";

    // Add cancel functionality
    cancelButton.addEventListener("click", () => {
        // Re-render the original task name
        taskNameSpan.innerHTML = currentName;
    });

    // Clear and update the span content
    taskNameSpan.innerHTML = "";
    taskNameSpan.appendChild(inputField);
    taskNameSpan.appendChild(saveButton);
    taskNameSpan.appendChild(cancelButton);

    // Add event listener to save button
    saveButton.addEventListener("click", () => saveTask(taskId));
}


// Save edited task
async function saveTask(taskId) {
    const inputField = document.getElementById(`edit-input-${taskId}`);
    const newName = inputField.value.trim();

    if (!newName) {
        alert("Task name cannot be empty!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                throw new Error("Unexpected server response (HTML instead of JSON)");
            }
            throw new Error(`Failed to update task. Status: ${response.status}`);
        }

        const data = await response.json();
        await fetchTasks();
        alert("Task updated successfully!");
    } catch (error) {
        console.error("Error updating task:", error);
        alert(error.message);
    }
}


// Add new task
async function addTask(taskName) {
    if (!taskName) {
        alert("Task name cannot be empty!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: taskName }),
        });

        if (!response.ok) throw new Error("Failed to add task");
        document.getElementById("task-name").value = ""; // Clear input field
        await fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete task");
        await fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
    }
}

// Mark task as completed
async function markTaskAsCompleted(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}/completed`, { // Fix: Endpoint updated
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to mark task as completed");
        }

        await fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error("Error marking task as completed:", error.message); // Fix: Show proper error message
        alert(error.message || "Failed to mark task as completed. Please try again.");
    }
}

// Handle form submission
document.getElementById("add-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = document.getElementById("task-name").value.trim();
    addTask(taskName);
});

// Initialize the application
fetchTasks();