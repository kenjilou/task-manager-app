// Task Management App

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');

// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialization
function init() {
      renderTasks();
}

// Save to LocalStorage
function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
      taskList.innerHTML = '';

    if (tasks.length === 0) {
              emptyState.style.display = 'block';
    } else {
              emptyState.style.display = 'none';

          // Status priority definition
          const priority = {
                        'in-progress': 1,
                        'todo': 2,
                        'completed': 3
          };

          // Sort: Priority first, then creation date
          const sortedTasks = [...tasks].sort((a, b) => {
                        if (priority[a.status] !== priority[b.status]) {
                                          return priority[a.status] - priority[b.status];
                        }
                        return new Date(a.createdAt) - new Date(b.createdAt);
          });

          sortedTasks.forEach(task => {
                        const li = document.createElement('li');
                        li.className = task.status === 'completed' ? 'completed' : '';
                        li.innerHTML = `
                                        <div class="task-content">${escapeHTML(task.text)}</div>
                                                        <div class="task-actions">
                                                                            <select class="status-select" data-id="${task.id}">
                                                                                                    <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Todo</option>
                                                                                                                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                                                                                                                                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                                                                                                                                                                        </select>
                                                                                                                                                                                            <button class="delete-btn" data-id="${task.id}">&times;</button>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                        `;
                        taskList.appendChild(li);
          });
    }
}

// Add Task
function addTask() {
      const text = taskInput.value.trim();
      if (text === '') {
                alert('Please enter a task.');
                return;
      }

    const newTask = {
              id: Date.now(),
              text: text,
              status: 'todo',
              createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
      saveTasks();
      renderTasks();
      taskInput.value = '';
}

// Update Status
function updateStatus(id, newStatus) {
      tasks = tasks.map(task => 
                                task.id == id ? { ...task, status: newStatus } : task
                            );
      saveTasks();
      renderTasks();
}

// Delete Task
function deleteTask(id) {
      if (confirm('Delete this task?')) {
                tasks = tasks.filter(task => task.id != id);
                saveTasks();
                renderTasks();
      }
}

// Helper: Escape HTML
function escapeHTML(str) {
      const p = document.createElement('p');
      p.textContent = str;
      return p.innerHTML;
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
});

taskList.addEventListener('change', (e) => {
      if (e.target.classList.contains('status-select')) {
                updateStatus(e.target.dataset.id, e.target.value);
      }
});

taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
                deleteTask(e.target.dataset.id);
      }
});

// Start App
init();
