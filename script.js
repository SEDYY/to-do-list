// инициализация данных
let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [
    { id: '1', column: 'to-do', text: 'Пример задачи 1' },
    { id: '2', column: 'doing', text: 'Пример задачи 2' },
    { id: '3', column: 'done', text: 'Пример задачи 3' }
];

// DOM элементы
const addButtons = document.querySelectorAll('[data-action="add-task"]');
const taskTemplate = document.getElementById('task-template');

// генерация ID
function generateId() {
    return Date.now().toString();
}

// рендер 1 задачи
function renderTask(task) {
    const taskElement = taskTemplate.content.cloneNode(true).querySelector('.task');
    taskElement.dataset.taskId = task.id;
    taskElement.querySelector('.task-text').textContent = task.text;
    
    // обработчик удаления
    taskElement.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    // Drag and Drop
    taskElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
    });

    return taskElement;
}

// рендер всех задач
function renderAllTasks() {
    document.querySelectorAll('.tasks-list').forEach(list => list.innerHTML = '');
    
    tasks.forEach(task => {
        const column = document.querySelector(`[data-column="${task.column}"] .tasks-list`);
        column.appendChild(renderTask(task));
    });
}

// добавление задачи
function addTask(column) {
    const text = prompt('Введите текст задачи:');
    if (!text) return;
    
    const newTask = {
        id: generateId(),
        column: column,
        text: text
    };
    
    tasks.push(newTask);
    saveTasks();
    renderAllTasks();
}

// удаление задачи
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderAllTasks();
}

// сохранение в localStorage
function saveTasks() {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

// Drag and Drop логика
function setupDragAndDrop() {
    document.querySelectorAll('.column').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        column.addEventListener('dragleave', () => {
            column.style.backgroundColor = '';
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.style.backgroundColor = '';
            const taskId = e.dataTransfer.getData('text/plain');
            const task = tasks.find(t => t.id === taskId);
            
            if (task) {
                task.column = column.dataset.column;
                saveTasks();
                renderAllTasks();
            }
        });
    });
}

// инициализация
document.addEventListener('DOMContentLoaded', () => {
    // обработчики кнопок добавления
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            addTask(button.dataset.column);
        });
    });
    
    setupDragAndDrop();
    renderAllTasks();
});