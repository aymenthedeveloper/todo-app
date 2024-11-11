const toggleBtn = document.querySelector('.todo-app .app-header .toggle');
const todoInput = document.querySelector('.todo-app .app-body .todo-input input')
const todoAddBtn = document.querySelector('.todo-app .app-body .todo-input .todo-add-btn')
const todoList = document.querySelector('.todo-app .app-body .todo-list')
const todoFooter = document.querySelector('.todo-app .app-body .todo-footer')
const itemsLeftElement = document.querySelector('.todo-app .app-body .todo-footer .todo-count .count')
let itemsLeftNumber = 0;
let startTime, currentTime, lastId;
let currentDragElement;



let todos = [
  {
    id: 0,
    completed: true,
    text: 'Complete online JavaScript course'
  },
  {
    id: 1,
    completed: false,
    text: 'Jog around the park 3x'
  },
  {
    id: 2,
    completed: false,
    text: '10 minutes meditation'
  },
  {
    id: 3,
    completed: false,
    text: 'Read for 1 hour'
  },
  {
    id: 4,
    completed: false,
    text: 'Pick up groceries'
  },
  {
    id: 5,
    completed: false,
    text: 'Complete Todo App on Frontend Mentor'
  },
]

toggleBtn.addEventListener('click', toggleTheme)
todoInput.addEventListener('keydown', addTask)
todoAddBtn.addEventListener('click', addTask)
todoList.addEventListener('click', handleTodolistClicks)
todoList.addEventListener('dragover', handleDrag)
todoList.addEventListener('touchstart', getDragElement)
todoList.addEventListener('touchmove', handleDrag)
todoList.addEventListener('touchend', removeDragElement)
todoFooter.addEventListener('click', handleFooterClicks)


function handleDrag(e){
  e.preventDefault();
  if (!currentDragElement) return;
  currentTime = performance.now();
  const elapsedTime = currentTime - startTime;
  if (elapsedTime > 150){
    startTime = currentTime;
    if (!currentDragElement.classList.contains('dragging')) currentDragElement.classList.add('dragging')
    const y = e.type == 'dragover'? e.clientY: e.touches[0].clientY;
    const afterElement = getDragAfterElement(y);
    if (afterElement == null) {
        todoList.appendChild(currentDragElement);
    } else {
        todoList.insertBefore(currentDragElement, afterElement);
    }
  }
}

function getDragElement(e){
  if (e.target.classList.contains('todo')) {
    currentDragElement = e.target;
    startTime = performance.now();
  }

}
function removeDragElement(e){
  if (currentDragElement){
    currentDragElement.classList.remove('dragging')
    currentDragElement = null;
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



function handleFooterClicks(e){
  const target = e.target;
  if (target.classList.contains('clear-completed-btn')){
    const completedTodos = document.querySelectorAll('.todo-list .todo .state.completed')
    completedTodos.forEach(todo => {
      let todoObj = todo.parentNode;
      todoObj.remove()

    });
    todos = todos.filter(todo => !todo.completed)
    localStorage.setItem("db", JSON.stringify({allTodos: todos}))
  } else if (target.classList.contains('active')){
    ["all", 'completed'].forEach(filter => todoList.classList.remove(filter))
    todoList.classList.add("active")
  } else if (target.classList.contains('completed')){
    ["all", 'active'].forEach(filter => todoList.classList.remove(filter))
    todoList.classList.add("completed")
  } else if (target.classList.contains('all')){
    ["completed", 'active'].forEach(filter => todoList.classList.remove(filter))
    todoList.classList.add("all") 
  }
}
function removeTodo(todoObj){
  const stateObj = todoObj.firstElementChild;
  const todoId = +todoObj.dataset.id;
  todos = todos.filter(todo => todo.id != todoId)
  todoObj.remove()
  const completed = stateObj.classList.contains('completed');
  if (!completed) itemsLeftElement.textContent = --itemsLeftNumber
}
function ChangeTodoState(todoObj, stateObj){
  const todoId = +todoObj.dataset.id;
  const completed = stateObj.classList.contains('completed');
  if (completed){
    itemsLeftElement.textContent = ++itemsLeftNumber;
    checkTodo(todoId, false)
  } else {
    itemsLeftElement.textContent = --itemsLeftNumber;
    checkTodo(todoId, true)
  }
  stateObj.classList.toggle('completed');
}
function checkTodo(todoId, state){
  for (let i = 0, len = todos.length; i < len; i++) {
    if (todos[i].id == todoId) {
      todos[i].completed = state;
      
      return;
    }
  }
}

function handleTodolistClicks(e){  
  const target = e.target;
  if (target.classList.contains('remove-icon')){
    removeTodo(target.parentNode)
  } else if (target.classList.contains('state')){
    ChangeTodoState(target.parentNode, target) 
  }
  localStorage.setItem("db", JSON.stringify({allTodos: todos}))
}

function addTask(e){
  if ((this == todoAddBtn && todoInput.value) || (e.keyCode == "13" && todoInput.value)){
    const todo = {
      id: ++lastId,
      completed: false,
      text: todoInput.value
    }
    todos.push(todo)
    localStorage.setItem("db", JSON.stringify({allTodos: todos}))
    const todoObj = createTodo(todo)
    todoList.appendChild(todoObj);
    todoInput.value = null;
    itemsLeftElement.textContent = ++itemsLeftNumber
  }
}


function createTodo(todo){
  const {id, completed, text} = todo;
  todo = document.createElement('div');
  todo.classList.add('todo');
  todo.draggable = true;
  todo.setAttribute('data-id', id)
  todo.innerHTML =`<label class="state ${completed? 'completed': ''}"><input type="checkbox" ${completed? 'checked="true"': ''}></label>
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

function loadTodos(){
  let db = localStorage.getItem('db');
  if (db == null){
    todos.forEach(todo =>{
      todoList.insertAdjacentElement('beforeend', createTodo(todo))
      !todo.completed && itemsLeftNumber++
      lastId = todo.id;
    })
    localStorage.setItem("db", JSON.stringify({allTodos: todos}))
  } else {
    db = JSON.parse(db)
    todos = db.allTodos;
    todos.forEach(todo =>{
      todoList.insertAdjacentElement('beforeend', createTodo(todo))
      !todo.completed && itemsLeftNumber++
      lastId = todo.id;
    })
  }
  itemsLeftElement.textContent = itemsLeftNumber;
}




loadTodos()
checkUserPreference()