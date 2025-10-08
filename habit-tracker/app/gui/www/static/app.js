
async function addTask() {
    const name = document.getElementById('taskInput').value;
    if (!name) return;
    const res = await fetch('/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
    });
    const data = await res.json();
    if (data.success) {
        const li = document.createElement('li');
        li.id = `task-${data.id}`;
        li.innerHTML = `
            <span>${name}</span>
            <button class="delete-btn" onclick="deleteTask(${data.id})">Delete</button>
        `;
        document.getElementById('taskList').appendChild(li);
        document.getElementById('taskInput').value = '';
    }
}

async function deleteTask(taskId) {
    const res = await fetch(`/delete/${taskId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
        const li = document.getElementById(`task-${taskId}`);
        if (li) li.remove();
    } else {
        alert("Failed to delete task: " + (data.error || ""));
    }
}