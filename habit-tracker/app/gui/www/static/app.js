
async function addTask() {
    const name = document.getElementById('taskInput').value;
    if (!name) return;
    // -=-=- //
    fetch('/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
    }).then(async response => {
        const data = await response.json();
        if (data.success && data.html) {
            document.getElementById('taskList')
                .insertAdjacentHTML('beforeend', data.html);
            document.getElementById('taskInput').value = '';
        } else if (data.success) {
            location.reload(true);
        } else showToast("Failed to add task: " + (data.error || ""), "error");
    });
}

async function deleteTask(taskId) {
    fetch(`/delete/${taskId}`, {
        method: 'DELETE'
    }).then(async response => {
        const data = await response.json();
        if (data.success) {
            const li = document.getElementById(`task-${taskId}`);
            if (li) li.remove();
        } else showToast("Failed to delete task: " + (data.error || ""), "error");
    }).catch(error => {
        showToast("Failed to delete task: " + (error || ""));
    });
}

async function setActive(taskId, isActive) {
    function revertCheckbox() {
        const checkbox = document.getElementById(`task-${taskId}-active`);
        if (checkbox) { checkbox.checked = !isActive }
    }
    // -=-=- //
    const li = document.getElementById(`task-${taskId}`);
    fetch(`/set_active/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: isActive })
    }).then(async response => {
        if (!li) { return; }
        const data = await response.json();
        if (data.success) {
            if (isActive) li.classList.remove('inactive');
            else li.classList.add('inactive');
        } else revertCheckbox();
    }).catch(error => revertCheckbox());
}