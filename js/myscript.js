const getId = (() => {
  let globalID = 0;
  return () => (globalID += 1);
})();

let todoList = [
  { id: getId(), title: "learning JS", isComplete: false },
  { id: getId(), title: "learning HTML", isComplete: false },
  { id: getId(), title: "learning CSS", isComplete: false },
];

document.getElementById("add-todo").addEventListener("click", prepareTodo);
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

function prepareTodo(){
  const newTodoTitle = document.getElementById("newTodo").value;
  if (newTodoTitle === "") return;
  
  const todo = { id: getId(), title: newTodoTitle, isComplete: false };
  todoList = addTodo(todo, todoList);
}

function addTodo(todo, todoList) {
  todosContainer.appendChild(prepareForRenderTodo(todo));
  return [...todoList, todo];
}

function prepareForRenderTodo(todo) {
  const li = document.createElement("li");

  li.classList.add("todo-added");
  li.setAttribute("index", todo.id);
  li.innerHTML = `<input type="checkbox" class="complete" ${todo.isComplete ? "checked" : ""}/>
                    <span class="comp ${todo.isComplete ? "strikeout" : ""}">${todo.title}</span>
                    <img src="./images/trash-alt-solid.svg" alt="" class="delete" />`;
  return li;
}

function removeFromView(e) {
  const todoView = e.target.parentElement;
  const todoId = +todoView.getAttribute("index");
  todoView.remove();
  todoList = removeTodo(todoId, todoList);
}

function removeTodo(todoId, todoList) {
  return todoList.filter(todoItem => todoItem.id !== todoId);
}

function changeTodoStatusView(e) {
  const todoView = e.target.parentElement;
  const todoId = +todoView.getAttribute("index");
  const isComplete = e.target.checked;

  if (isComplete){
    e.target.nextElementSibling.classList.add("strikeout");
  }
  else {
    e.target.nextElementSibling.classList.remove("strikeout");
  }
    
  todoList = changeTodoStatus(todoId, isComplete, todoList);
}

function changeTodoStatus(todoId, isComplete, todoList) {
  return todoList.map(todoItem => todoItem.id === todoId ? {...todoItem, isComplete} : todoItem)
}

function showAllTodos() {
  clearAllTodos();
  todoList.forEach((todoItem) =>
    todosContainer.appendChild(prepareForRenderTodo(todoItem))
  );
}

function showActiveTodos() {
  clearAllTodos();
  todoList
    .filter((todoItem) => todoItem.isComplete == false)
    .forEach((todoItem) => todosContainer.appendChild(prepareForRenderTodo(todoItem)));
}

function showCompleteTodos() {
  clearAllTodos();
  todoList
    .filter((todoItem) => todoItem.isComplete == true)
    .forEach((todoItem) => todosContainer.appendChild(prepareForRenderTodo(todoItem)));
}

function clearAllTodos() {
  todosContainer.innerHTML = "";
}