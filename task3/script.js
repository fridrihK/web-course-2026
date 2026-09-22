let todos = [];
let currentFilter = 'all'; 


const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');


todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        render();
    });
});


function addTodo() {
    const text = todoInput.value.trim();

    
    if (text === '') {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    render();
}


function toggleTodo(id) {
    todos = todos.map(function (todo) {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    render();
}


function deleteTodo(id) {
    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });
    render();
}


function render() {
    
    todoList.innerHTML = '';

    
    todos.forEach(function (todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) {
            li.classList.add('completed');
        }

        
        if (
            (currentFilter === 'active' && todo.completed) ||
            (currentFilter === 'completed' && !todo.completed)
        ) {
            li.style.display = 'none';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', function () {
            toggleTodo(todo.id);
        });

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', function () {
            deleteTodo(todo.id);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

    
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;

    activeCountEl.textContent = activeCount;
    completedCountEl.textContent = completedCount;
}


render();