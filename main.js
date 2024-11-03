const toggleBtn = document.querySelector('.todo-app .app-header .toggle');
const todoInput = document.querySelector('.todo-app .app-body .todo-input input')
const todoAddBtn = document.querySelector('.todo-app .app-body .todo-input .todo-add-btn')
const todoList = document.querySelector('.todo-app .app-body .todo-list')

console.log(todoAddBtn);


toggleBtn.addEventListener('click', toggleTheme)
todoInput.addEventListener('keydown', addTask)
todoAddBtn.addEventListener('click', addTask)

function addTask(e){
  if ((this.classList.contains('todo-add-btn') && todoInput.value) || (e.keyCode == "13" && todoInput.value)){
    const todo = createTodo(todoInput.value)
    todoList.insertAdjacentHTML('beforeend', todo);
    todoInput.value = null
  }
}


function createTodo(task){
  return `<div class="todo">
            <label class="state"><input type="checkbox"></label>
            <p>${task}</p>
            <img src="./images/icon-cross.svg" class="remove-icon" alt="">
          </div>`
}


function toggleTheme(){
  if (document.documentElement.classList.contains("light")) {
    localStorage.setItem("prefers-color-scheme", "dark")
  } else {
    localStorage.setItem("prefers-color-scheme", "light")
  }
  document.documentElement.classList.toggle('light')
  toggleBtn.classList.toggle('light')
  console.log(localStorage.getItem('prefers-color-scheme'));
}


function checkUserPreference() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light )')
  const preferedMode = localStorage.getItem('prefers-color-scheme') || 'dark';
  if (mediaQuery.matches || preferedMode == 'light') {
    document.documentElement.classList.add('light')
    toggleBtn.classList.add('light')
    console.log('light');
  } else {
    document.documentElement.classList.remove('light')
    toggleBtn.classList.remove('light')
    console.log('dark');
  }
}


checkUserPreference()