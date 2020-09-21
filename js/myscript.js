"use strict";
let globalID = 3;

const todoList = [
  { id: 1, title: "learning JS", isComplete: false },
  { id: 2, title: "learning HTML", isComplete: true },
  { id: 3, title: "learning CSS", isComplete: false },
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

function getId() {
  return ++globalID;
}

function addTodo() {
  const newTodo = document.getElementById("newTodo").value;
  const todo = { id: getId(), title: newTodo, isComplete: false };

  todoList.push(todo);
  todosContainer.appendChild(prepareForRenderTodo(todo));
}

function prepareForRenderTodo(todo) {
  const li = document.createElement("li");

  li.classList.add("todo-added");
  li.setAttribute("index", todo.id);
  li.innerHTML = `<input type="checkbox" class="complete" ${
    todo.isComplete ? "checked" : ""
  } />
                    <span class="comp ${todo.isComplete ? "strikeout" : ""}">${
    todo.title
  }</span>
                    <img src="./images/trash-alt-solid.svg" alt="" class="delete" />`;
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
    .filter((todo) => todo.isComplete == false)
    .forEach((todo) => todosContainer.appendChild(prepareForRenderTodo(todo)));
}

function showCompleteTodos() {
  clearAllTodos();
  todoList
    .filter((todo) => todo.isComplete == true)
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
  const index = todoList.findIndex((todo) => todo.id === todoId);
  if (index == -1) {
    throw new Error("Id not found");
  }
  todoList.splice(index, 1);
}

function changeTodoTitle(todoId, newTitle) {
  arr[todoId].title = newTitle;
  const index = todoList.findIndex((todo) => todo.id === todoId);
  if (index == -1) {
    throw new Error("Id not found");
  }
  todoList[index].title = newTitle;
}

function changeTodoStatusView(e) {
  const todo = e.target.parentElement;
  const todoId = +todo.getAttribute("index");
  const isComplete = e.target.checked;
  isComplete ? e.target.nextElementSibling.classList.add('strikeout'):
                e.target.nextElementSibling.classList.remove('strikeout');
  changeTodoStatus(todoId, isComplete);
}

function changeTodoStatus(todoId, isComplete) {
  const index = todoList.findIndex((todo) => todo.id === todoId);
  if (index === -1) {
    throw new Error("Id not found");
  }
  todoList[index].isComplete = isComplete;
}
