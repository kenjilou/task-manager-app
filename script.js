document.addEventListener('DOMContentLoaded', () => {
          const taskInput = document.getElementById('taskInput');
          const addBtn = document.getElementById('addBtn');
          const taskList = document.getElementById('taskList');
          const emptyState = document.getElementById('emptyState');
          let tasks = [];
          const init = () => {
                    const saved = localStorage.getItem('taskflow_tasks');
                    if (saved) tasks = JSON.parse(saved);
                    renderTasks();
          };
          const saveTasks = () => {
                    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
          };
          const renderTasks = () => {
                    taskList.innerHTML = '';
                    if (tasks.length === 0) {
                              emptyState.classList.remove('hidden');
                              return;
                    }
                    emptyState.classList.add('hidden');
                    const prio = { 'in-progress': 1, 'pending': 2, 'completed': 3 };
                    const sorted = [...tasks].sort((a, b) => {
                              if (prio[a.status] !== prio[b.status]) return prio[a.status] - prio[b.status];
                              return a.id - b.id;
                    });
                    sorted.forEach(t => {
                              const li = document.createElement('li');
                              li.className = `task-item ${t.status === 'completed' ? 'completed' : ''}`;
                              li.setAttribute('data-id', t.id);
                              li.innerHTML = `<span class="task-content">${escapeHTML(t.text)}</span>
                              <div class="task-actions">
                              <select class="status-select" data-id="${t.id}">
                              <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>\u672a\u5b8c\u4e86</option>
                              <option value="in-progress" ${t.status === 'in-progress' ? 'selected' : ''}>\u9032\u884c\u4e2d</option>
                              <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>\u5b8c\u4e86</option>
                              </select>
                              <button class="delete-btn" data-id="${t.id}">&times;</button>
                              </div>`;
                              taskList.appendChild(li);
                    });
          };
          const addTask = () => {
                    const text = taskInput.value.trim();
                    if (!text) {
                              alert('\u30bf\u30b9\u30af\u5185\u5bb9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002');
                              return;
                    }
                    tasks.push({ id: Date.now(), text, status: 'pending' });
                    taskInput.value = '';
                    saveTasks();
                    renderTasks();
          };
          const updateStatus = (id, s) => {
                    tasks = tasks.map(t => t.id === id ? { ...t, status: s } : t);
                    saveTasks();
                    renderTasks();
          };
          const deleteTask = (id) => {
                    if (!confirm('\u3053\u306e\u30bf\u30b9\u30af\u3092\u524a\u9664\u3057\u3066\u3082\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f')) return;
                    tasks = tasks.filter(t => t.id !== id);
                    saveTasks();
                    renderTasks();
          };
          const escapeHTML = (s) => {
                    const p = document.createElement('p');
                    p.textContent = s;
                    return p.innerHTML;
          };
          addBtn.onclick = addTask;
          taskInput.onkeypress = (e) => { if (e.key === 'Enter') addTask(); };
          taskList.onclick = (e) => {
                    const btn = e.target.closest('.delete-btn');
                    if (btn) deleteTask(parseInt(btn.dataset.id));
          };
          taskList.onchange = (e) => {
                    if (e.target.classList.contains('status-select')) {
                              updateStatus(parseInt(e.target.dataset.id), e.target.value);
                    }
          };
          init();
});
