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
                <input type="button" onclick="todoAction('todo-${id}', 0)" style="width: 30px; border-radius: 50%; outline: none; border: none; background-color: green;">
                <input type="button" onclick="todoAction('todo-${id}', 1)" style="width: 30px; border-radius: 50%; outline: none; border: none; background-color: red;">
            </div>
        </div>
    `;

    todos.innerHTML += html;
}

function todoAction(id, action) {
    let element = document.getElementById(id);
    switch (action) {
        case 0: {
            element.children[0].style.textDecoration = "line-through";
            element.style.border = "2px solid green";
            element.children[1].children[0].style.backgroundColor = "yellow";
            element.children[1].children[0].setAttribute("onClick", `todoAction('${id}', 2)`);
        } break;
        
        case 1: {
            element.remove();
        } break;
        
        case 2: {
            element.children[0].style.textDecoration = "none";
            element.style.border = "2px solid white";
            element.children[1].children[0].style.backgroundColor = "green";
            element.children[1].children[0].setAttribute("onClick", `todoAction('${id}', 0)`);
        }
    }
}