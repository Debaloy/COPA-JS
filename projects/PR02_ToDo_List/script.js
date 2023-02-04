const todo = document.getElementById('todo');
const todos = document.getElementById('todos');
let id = 0;

function addTodo() {
    if (todo.value === '') return alert("Todo is empty");

    id++;
    let html = `
        <div class="todo-container" id="todo-${id}">
            <div class="todo-text">
                ${todo.value}
            </div>
            <div class="todo-buttons">
                <input type="button" onclick="todoAction('todo-${id}', 0)" value="✔">
                <input type="button" onclick="todoAction('todo-${id}', 1)" value="❌">
            </div>
        </div>
    `;

    todos.innerHTML += html;
}

function todoAction(id, action) {
    let element = document.getElementById(id);
    switch (action) {
        case 0: {
            element.children[0].style.color = "green";
        } break;

        case 1: {
            element.remove();
        } break;
    }
}