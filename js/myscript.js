let globalID = 0;

function getId() {
  return ++globalID;
}

let todoList = [
  { id: getId(), title: "learning JS", isComplete: false },
  { id: getId(), title: "learning HTML", isComplete: true },
  { id: getId(), title: "learning CSS", isComplete: false },
];

document.getElementById("add-todo").addEventListener("click", addTodo);
document.getElementById("active").addEventListener("click", showActiveTodos);
document
  .getElementById("complete")
  .addEventListener("click", showCompleteTodos);
document.getElementById("all").addEventListener("click", showAllTodos);
document.addEventListener("DOMContentLoaded", showAllTodos);
const todosContainer = document.getElementById("todos-list");

document.body.addEventListener(
  "click",
  function (e) {
    if (e.target.className === "delete") {
      removeFromView(e);
    }
    if (e.target.className === "complete") {
      changeTodoStatusView(e);
    }
  },
  false
);

function addTodo() {
  const newTodoTitle = document.getElementById("newTodo").value;
  const todo = { id: getId(), title: newTodoTitle, isComplete: false };
  todoList = [...todoList, todo];
  todosContainer.appendChild(prepareForRenderTodo(todo));
}

function prepareForRenderTodo(todo) {
  const li = document.createElement("li");

  li.classList.add("todo-added");
  li.setAttribute("index", todo.id);
  li.innerHTML = `
    <input type="checkbox" class="complete" ${
      todo.isComplete ? "checked" : ""
    } />
    <span class="comp ${todo.isComplete ? "strikeout" : ""}">
      ${todo.title}
    </span>
    <img src="./images/trash-alt-solid.svg" alt="" class="delete" />
  `;
  return li;
}

function showAllTodos() {
  clearAllTodos();
  todoList.forEach((todo) =>
    todosContainer.appendChild(prepareForRenderTodo(todo))
  );
}

function showActiveTodos() {
  clearAllTodos();
  todoList
    .filter((todo) => todo.isComplete === false)
    .forEach((todo) => todosContainer.appendChild(prepareForRenderTodo(todo)));
}

function showCompleteTodos() {
  clearAllTodos();
  todoList
    .filter((todo) => todo.isComplete === true)
    .forEach((todo) => todosContainer.appendChild(prepareForRenderTodo(todo)));
}

function clearAllTodos() {
  todosContainer.innerHTML = "";
}

function removeFromView(e) {
  const todo = e.target.parentElement;
  const todoId = +todo.getAttribute("index");
  todo.remove();
  removeTodo(todoId);
}

function removeTodo(todoId) {
  todoList = todoList.filter(({ id }) => id !== todoId);
}

function changeTodoTitle(todoId, newTitle) {
  todoList = todoList.map((todo) =>
    todo.id === todoId ? { ...todo, title: newTitle } : todo
  );
}

function changeTodoStatusView(e) {
  const todo = e.target.parentElement;
  const todoId = +todo.getAttribute("index");
  const isComplete = e.target.checked;
  if (isComplete) {
    e.target.nextElementSibling.classList.add("strikeout");
  } else {
    e.target.nextElementSibling.classList.remove("strikeout");
  }
  changeTodoStatus(todoId, isComplete);
}

function changeTodoStatus(todoId, isComplete) {
  todoList = todoList.map((todo) =>
    todo.id === todoId ? { ...todo, isComplete } : todo
  );
}
