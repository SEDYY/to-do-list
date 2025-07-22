let tasks = [
    {id: '1', column: 'to-do', text: 'текст 1'},
    {id: '2', column: 'doing', text: 'текст 2'},
    {id: '3', column: 'done', text: 'текст 3'}
]

const addButtons = document.querySelectorAll('[data-action ="add-task"]');

function generatedId () {
    return Date.now().toString();
}

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const column = button.dataset.column;



        const newTask = {
            id: generatedId(),
            column: column,
            text: 'новая задача'

        }

        tasks.push(newTask);

        renderSingleTask(newTask);

        saveTasks();
    })
})

// Рендер одной задачи
function renderSingleTask(task) {
  const template = document.getElementById('task-template');
  const taskElement = template.content.cloneNode(true).querySelector('.task');
  
  taskElement.dataset.taskId = task.id;
  taskElement.querySelector('.task-text').textContent = task.text;
  
  // Вставляем в начало колонки (перед кнопкой добавления)
  const column = document.querySelector(`[data-column="${task.column}"]`);
  column.insertBefore(taskElement, column.querySelector('.add-task'));
}

// Сохранение в localStorage
function saveTasks() {
  localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}


function renderTasks() {
  // Очищаем колонки перед рендером (кроме кнопок)
  document.querySelectorAll('[data-column]').forEach(column => {
    const columnId = column.dataset.column;
    column.querySelectorAll('.task').forEach(task => {
      if (!task.id.includes('add')) task.remove();
    });
  });

  // Рендерим задачи из массива
  tasks.forEach(task => {
    const template = document.getElementById('task-template');
    const taskElement = template.content.cloneNode(true).querySelector('.task');
    
    taskElement.dataset.taskId = task.id;
    taskElement.querySelector('.task-text').textContent = task.text;
    
    document.querySelector(`[data-column="${task.column}"]`).prepend(taskElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});