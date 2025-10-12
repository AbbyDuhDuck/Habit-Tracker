function showToast(message, type='default', duration=3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Text span
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);

    // Close button
    const btn = document.createElement('button');
    btn.className = 'close-btn';
    btn.innerHTML = '&times;';
    btn.onclick = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    };
    toast.appendChild(btn);

    // Add to container
    container.prepend(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}
