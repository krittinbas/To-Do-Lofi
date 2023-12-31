// Variables
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const unCompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audiox = new Audio('Sound/soundx.mp4');
const audiobg = new Audio('Sound/soundbg.mp3');
const audioen = new Audio('Sound/soundenter.mp4');
const audiotick = new Audio('Sound/soundtick.mp4');
const audiountick = new Audio('Sound/sound.mp3');

// Get to-do list on first boot
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }
    if (typeof audiobg.loop == 'boolean') {
        audiobg.loop = true;
    }
    else {
        audiobg.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    audiobg.play();

    render()
}

// Get the content typed into the input
todoInput.onkeyup = (e) => {
    let value = e.target.value.replace(/^\s+/, "");
    if (value && e.keyCode == 13) { // Enter
        addTodo(value)
        todoInput.value = ''
        todoInput.focus()
    }
};

// Add todo
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })
    audioen.play();
    saveAndRender()
}

// Remove todo
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
    audiox.play();
}

// Mark as completed
function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
            todo.completed = true
        }

        return todo
    })

    audiotick.play(); 

    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
            todo.completed = false
        }

        return todo
    })

    audiountick.play();
    
    saveAndRender()
}

// Save in localstorage
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
    let unCompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    unCompletedTodosDiv.innerHTML = ''

    if (unCompletedTodos.length > 0) {
        unCompletedTodos.forEach(todo => {
            unCompletedTodosDiv.append(createTodoElement(todo))
        })
    } else {
        unCompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted missions</div>`
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length} / ${todoItems.length})</div>`

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo))
        })
    }
}

// Save and render
function saveAndRender() {
    save()
    render()
}

// Create todo list item
function createTodoElement(todo) {
    // Create todo list container
    const todoDiv = document.createElement("DIV");
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = "todo-item";

    // Create todo item text
    const todoTextDiv = document.createElement("SPAN");
    todoTextDiv.innerHTML = todo.text;

    // Checkbox for list
    const todoInputCheckbox = document.createElement("INPUT");
    todoInputCheckbox.type = "checkbox";
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    // Delete button for list
    const todoRemoveBtn = document.createElement("A");
    todoRemoveBtn.href = "#";
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    };

    todoTextDiv.prepend(todoInputCheckbox);
    todoDiv.appendChild(todoTextDiv);
    todoDiv.appendChild(todoRemoveBtn);

    return todoDiv
}