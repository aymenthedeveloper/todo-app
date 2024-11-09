const toggleBtn = document.querySelector('.todo-app .app-header .toggle');
const todoInput = document.querySelector('.todo-app .app-body .todo-input input')
const todoAddBtn = document.querySelector('.todo-app .app-body .todo-input .todo-add-btn')
const todoList = document.querySelector('.todo-app .app-body .todo-list')
const todoFooter = document.querySelector('.todo-app .app-body .todo-footer')
const itemsLeftElement = document.querySelector('.todo-app .app-body .todo-footer .todo-count .count')
let itemsLeftNumber = 0;
let startTime, currentTime;
let currentDragElement;


const todos = [
  {
    completed: true,
    text: 'Complete online JavaScript course'
  },
  {
    completed: false,
    text: 'Jog around the park 3x'
  },
  {
    completed: false,
    text: '10 minutes meditation'
  },
  {
    completed: false,
    text: 'Read for 1 hour'
  },
  {
    completed: false,
    text: 'Pick up groceries'
  },
  {
    completed: false,
    text: 'Complete Todo App on Frontend Mentor'
  },
]

toggleBtn.addEventListener('click', toggleTheme)
todoInput.addEventListener('keydown', addTask)
todoAddBtn.addEventListener('click', addTask)
todoList.addEventListener('click', handleTodolistClicks)
todoList.addEventListener('dragover', handleDragOver)
todoFooter.addEventListener('click', handleFooterClicks)

function handleDragOver(e){
  e.preventDefault();
  currentTime = new Date().getTime();
  const time = currentTime - startTime;
  if (time > 150){
    startTime = new Date().getTime();
    const afterElement = getDragAfterElement(e.clientY);
    if (afterElement == null) {
        todoList.appendChild(currentDragElement);
    } else {
        todoList.insertBefore(currentDragElement, afterElement);
    }
  }
}

function getDragAfterElement(y) {
  const draggableElements = Array.from(todoList.querySelectorAll('.todo:not(.dragging)'));
  return draggableElements.reduce((closest, child, i) => {
      const box = child.getBoundingClientRect();
      const boxMidPointHeight = box.top + (box.height / 2)
      const offset = y - boxMidPointHeight
      if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
      } else {
          return closest;
      }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function getDragElement(e){
  currentDragElement = this;
  currentDragElement.classList.add('dragging')
  startTime = new Date().getTime();
}
function removeDragElement(e){
  currentDragElement.classList.remove('dragging')
  currentDragElement = null;
}


function handleFooterClicks(e){
  const target = e.target;
  if (target.classList.contains('claer-completed-btn')){
    const completedTodos = document.querySelectorAll('.todo-list .todo .state.completed')
    completedTodos.forEach(todo => todo.parentNode.remove());
  } else if (target.classList.contains('active')){
    const completedTodos = document.querySelectorAll('.todo-list .todo .state.completed')
    completedTodos.forEach(todo => todo.parentNode.style.display = "none");
    const activeTodos = document.querySelectorAll('.todo-list .todo .state:not(.completed)')
    activeTodos.forEach(todo => todo.parentNode.style.display = "grid");
    document.querySelector('.todo-footer .todo-filters button.selected').classList.remove('selected')
    target.classList.add('selected')
  } else if (target.classList.contains('completed')){
    const activeTodos = document.querySelectorAll('.todo-list .todo .state:not(.completed)')
    activeTodos.forEach(todo => todo.parentNode.style.display = "none");
    const completedTodos = document.querySelectorAll('.todo-list .todo .state.completed')
    completedTodos.forEach(todo => todo.parentNode.style.display = "grid");
    document.querySelector('.todo-footer .todo-filters button.selected').classList.remove('selected')
    target.classList.add('selected')
  } else if (target.classList.contains('all')){
    const allTodos = document.querySelectorAll('.todo-list .todo')
    document.querySelector('.todo-footer .todo-filters button.selected').classList.remove('selected')
    target.classList.add('selected')
    allTodos.forEach(todo => todo.style.display = "grid");    
  }
}

function handleTodolistClicks(e){  
  const target = e.target;
  
  if (target.classList.contains('remove-icon')){
    const todo = target.parentNode;
    const completed = todo.children[0].classList.contains('completed');
    todo.remove()
    if (!completed) itemsLeftElement.textContent = --itemsLeftNumber
  } else if (target.classList.contains('state')){
    const todo = target.parentNode;
    const completed = target.classList.contains('completed');
    if (completed){
      target.classList.remove('completed');
      itemsLeftElement.textContent = ++itemsLeftNumber
    } else {
      target.classList.add('completed')
      itemsLeftElement.textContent = --itemsLeftNumber
    }
  }
}

function addTask(e){
  if ((this == todoAddBtn && todoInput.value) || (e.keyCode == "13" && todoInput.value)){
    const todo = createTodo(false, todoInput.value)
    todoList.appendChild(todo);
    todoInput.value = null;
    itemsLeftElement.textContent = ++itemsLeftNumber
  }
}


function createTodo(state, text){
  const todo = document.createElement('div');
  todo.classList.add('todo');
  todo.draggable = true;
  todo.innerHTML =`<label class="state ${state? 'completed': ''}"><input type="checkbox" ${state? 'checked="true"': ''}></label>
                    <p>${text}</p>
                    <img src="./images/icon-cross.svg" class="remove-icon" alt="">`
  todo.addEventListener('dragstart', getDragElement)          
  todo.addEventListener('dragend', removeDragElement)          
  return todo;
}


function toggleTheme(){
  if (document.documentElement.classList.contains("light")) {
    localStorage.setItem("prefers-color-scheme", "dark")
  } else {
    localStorage.setItem("prefers-color-scheme", "light")
  }
  document.documentElement.classList.toggle('light')
  toggleBtn.classList.toggle('light')
}


function checkUserPreference() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light )')
  const preferedMode = localStorage.getItem('prefers-color-scheme') || 'dark';
  if (mediaQuery.matches || preferedMode == 'light') {
    document.documentElement.classList.add('light')
    toggleBtn.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
    toggleBtn.classList.remove('light')
  }
}



document.addEventListener('DOMContentLoaded', ()=>{
  checkUserPreference()
  todos.forEach(todo =>{
    todoList.insertAdjacentElement('beforeend', createTodo(todo.completed, todo.text))
    !todo.completed && itemsLeftNumber++
  })
  itemsLeftElement.textContent = itemsLeftNumber;
})