const socket = io();

socket.on('log', (data) => {
  const logContainer = document.getElementById('log-container');
  const logEntry = document.createElement('div');
  logEntry.textContent = data.data;
  logContainer.appendChild(logEntry);

  if (data.data.includes('failed')) {
    showToast(data.data);
  }
});

function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 3000);
}
