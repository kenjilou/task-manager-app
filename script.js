/**
 * Task Management App - Main Script
 * (Japanese comments replaced with English due to tool limitations)
 */

document.addEventListener('DOMContentLoaded', () => {
          // Get DOM elements
                              const taskInput = document.getElementById('taskInput');
          const addBtn = document.getElementById('addBtn');
          const taskList = document.getElementById('taskList');
          const emptyState = document.getElementById('emptyState');

                              // State management
                              let tasks = [];

                              /**
           * Initialization
           */
                              const init = () => {
                                            try {
                                                              const savedTasks = localStorage.getItem('taskflow_tasks');
                                                              if (savedTasks) {
                                                                                    tasks = JSON.parse(savedTasks);
                                                              }
                                                              renderTasks();
                                            } catch (error) {
                                                              console.error('\u30c7\u30fc\u30bf\u306e\u8aad\u307f\u8fbc\u307f\u4e2d\u306b\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f:', error);
                                                              showError();
                                            }
                              };

                              /**
           * Save to LocalStorage
           */
                              const saveTasks = () => {
                                            try {
                                                              localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
                                            } catch (error) {
                                                              console.error('\u30c7\u30fc\u30bf\u306e\u4fdd\u5b58\u4e2d\u306b\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f:', error);
                                            }
                              };

                              /**
           * Render task list
           */
                              const renderTasks = () => {
                                            taskList.innerHTML = '';

                                            if (tasks.length === 0) {
                                                              emptyState.classList.remove('hidden');
                                                              return;
                                            }

                                            emptyState.classList.add('hidden');

                                            // Status priority
                                            const priority = {
                                                              'in-progress': 1,
                                                              'pending': 2,
                                                              'completed': 3
                                            };

                                            // Sort
                                            const sortedTasks = [...tasks].sort((a, b) => {
                                                              if (priority[a.status] !== priority[b.status]) {
                                                                                    return priority[a.status] - priority[b.status];
                                                              }
                                                              return a.id - b.id;
                                            });

                                            sortedTasks.forEach(task => {
                                                              const li = document.createElement('li');
                                                              li.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
                                                              li.setAttribute('data-id', task.id);

                                                                            li.innerHTML = `
                                                                                            <span class="task-content">${escapeHTML(task.text)}</span>
                                                                                                            <div class="task-actions">
                                                                                                                                <select class="status-select" data-action="update-status" data-id="${task.id}">
                                                                                                                                                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>\u672a\u5b8c\u4e86</option>
                                                                                                                                                                                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>\u9032\u884c\u4e2d</option>
                                                                                                                                                                                                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>\u5b8c\u4e86</option>
                                                                                                                                                                                                                            </select>
                                                                                                                                                                                                                                                <button class="delete-btn" data-action="delete-task" data-id="${task.id}" aria-label="\u524a\u9664">
                                                                                                                                                                                                                                                                        &times;
                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                        `;
                                                              taskList.appendChild(li);
                                            });
                              };

                              /**
           * Add task
           */
                              const addTask = () => {
                                            const text = taskInput.value.trim();

                                            if (!text) {
                                                              alert('\u30bf\u30b9\u30af\u5185\u5bb9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002');
                                                              return;
                                            }

                                            const newTask = {
                                                              id: Date.now(),
                                                              text: text,
                                                              status: 'pending'
                                            };

                                            tasks.push(newTask);
                                            taskInput.value = '';
                                            saveTasks();
                                            renderTasks();
                              };

                              /**
           * Update status
           */
                              const updateTaskStatus = (id, newStatus) => {
                                            tasks = tasks.map(task => 
                                                                          task.id === id ? { ...task, status: newStatus } : task
                                                                      );
                                            saveTasks();
                                            renderTasks();
                              };

                              /**
           * Delete task
           */
                              const deleteTask = (id) => {
                                            if (!confirm('\u3053\u306e\u30bf\u30b9\u30af\u3092\u524a\u9664\u3057\u3066\u3082\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f')) return;

                                            tasks = tasks.filter(task => task.id !== id);
                                            saveTasks();
                                            renderTasks();
                              };

                              /**
           * Escape HTML
           */
                              const escapeHTML = (str) => {
                                            const p = document.createElement('p');
                                            p.textContent = str;
                                            return p.innerHTML;
                              };

                              /**
           * Show error
           */
                              const showError = () => {
                                            document.getElementById('errorState').classList.remove('hidden');
                              };

                              // Event Listeners
                              addBtn.addEventListener('click', addTask);
          taskInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') addTask();
          });

                              taskList.addEventListener('click', (e) => {
                                            const target = e.target;
                                            const btn = target.closest('[data-action="delete-task"]');
                                            if (btn) {
                                                              const id = parseInt(btn.getAttribute('data-id'), 10);
                                                              deleteTask(id);
                                            }
                              });

                              taskList.addEventListener('change', (e) => {
                                            const target = e.target;
                                            if (target.getAttribute('data-action') === 'update-status') {
                                                              const id = parseInt(target.getAttribute('data-id'), 10);
                                                              updateTaskStatus(id, target.value);
                                            }
                              });

                              init();
});
