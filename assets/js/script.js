//
//  Variables
//
let isSelecting = false;
let isDragging = false;
let startX, startY, endX, endY;
let offsetX, offsetY, activeElement;
var toastVisible = false;
const selectionRectangle = document.querySelector(".selection");
const time = document.getElementById('time');
const date = document.getElementById('date');
const taskbar = document.querySelector('.taskbar');
const taskbarMenu = document.getElementById('taskbar-menu');
const tmItem = document.getElementById('tm-item');
const startButton = document.getElementById('start-button');
const startMenu = document.querySelector('.start');
const startSearch = document.getElementById('start-search');
const widgetsButton = document.getElementById('widgets-button');
const widgetsPane = document.querySelector('.widgets-pane');
const windowElement = document.querySelectorAll('.window');
//
//  Taskbar
//
startButton.addEventListener('click', () => {
    startMenu.classList.toggle('show');
    startButton.classList.toggle('active');
});
document.querySelectorAll('[id$="-tile"]').forEach(function(tile) {
    tile.addEventListener('click', function() {
        startMenu.classList.toggle('show');
    });
});
document.addEventListener('click', (event) => {
    if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
        startMenu.classList.remove('show');
        startButton.classList.remove('active');
        startSearch.value = "";
    }
});
widgetsButton.addEventListener('click', () => {
    widgetsPane.classList.toggle('show');
    widgetsButton.classList.toggle('active');
});
document.addEventListener('click', (event) => {
    if (!widgetsButton.contains(event.target) && !widgetsPane.contains(event.target)) {
        widgetsPane.classList.remove('show');
        widgetsButton.classList.remove('active');
        startSearch.value = "";
    }
});
function updateDateTime() {
    const currentDateTime = new Date();
    let hours = currentDateTime.getHours();
    let minutes = currentDateTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    const day = currentDateTime.getDate();
    const month = currentDateTime.getMonth() + 1;
    const year = currentDateTime.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    time.innerText = formattedTime;
    date.innerText = formattedDate;
}
document.addEventListener('DOMContentLoaded', () => {
    taskbar.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        taskbarMenu.style.display = 'block';
        taskbarMenu.style.left = `${event.clientX}px`;
        taskbarMenu.style.top = `${event.clientY}px`;
    });
    document.addEventListener('click', (event) => {
        if (!taskbarMenu.contains(event.target)) {
            taskbarMenu.style.display = 'none';
        }
    });
});
taskbarMenu.addEventListener("click", () => {
    taskbarMenu.style.display = 'none';
});
//
//  Desktop
//
document.addEventListener('mousedown', (event) => {
    const targetElement = event.target;
    if (!targetElement || event.button !== 0) return;
    const isWindow = targetElement.classList.contains('window') || targetElement.closest('.window');
    const isTaskbar = targetElement.classList.contains('taskbar') || targetElement.closest('.taskbar');
    if (isWindow || isTaskbar) return;
    if (event.button === 0) {
        isSelecting = true;
        startX = event.clientX;
        startY = event.clientY;
        selectionRectangle.style.width = '0';
        selectionRectangle.style.height = '0';
        selectionRectangle.style.left = `${startX}px`;
        selectionRectangle.style.top = `${startY}px`;
        selectionRectangle.style.display = 'block';
    }
});
document.addEventListener('mousemove', (event) => {
    if (isSelecting) {
        endX = event.clientX;
        endY = event.clientY;
        const width = endX - startX;
        const height = endY - startY;
        selectionRectangle.style.width = `${width}px`;
        selectionRectangle.style.height = `${height}px`;
        selectionRectangle.style.left = `${width > 0 ? startX : endX}px`;
        selectionRectangle.style.top = `${height > 0 ? startY : endY}px`;
    }
});
document.addEventListener('mouseup', () => {
    if (isSelecting) {
        isSelecting = false;
        selectionRectangle.style.display = 'none';
    }
});
updateDateTime();
setInterval(updateDateTime, 1000);
//
// Lockscreen
//
window.addEventListener('load', function () {
    var lockscreen = document.querySelector('.lockscreen');
    lockscreen.style.display = 'none';
    lockscreen.remove();
});
//
// Window management
//
windowElement.forEach(element => {
    const titlebar = element.querySelector('.titlebar');
    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        activeElement = element;
    });
});
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        const maxX = window.innerWidth - activeElement.offsetWidth;
        const maxY = window.innerHeight - activeElement.offsetHeight;
        activeElement.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        activeElement.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
    activeElement = null;
});
//
// Toast
//
function toast(toastMessage) {
    toastVisible = true;
    var toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = toastMessage;
    document.body.appendChild(toast);
    setTimeout(function () {
        toast.classList.add("show")
    }, 100);
    setTimeout(function () {
        toast.classList.remove("show");
        setTimeout(function () {
            document.body.removeChild(toast);
            toastVisible = false;
        }, 300);
    }, 3000);
}