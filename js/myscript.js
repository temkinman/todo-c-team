const getId = (() => {
  let globalID = 0;
  return () => (globalID += 1);
})();

let state = {
  todos: [
    { id: getId(), title: "learning JS", isComplete: false },
    { id: getId(), title: "learning HTML", isComplete: true },
    { id: getId(), title: "learning CSS", isComplete: true },
    { id: getId(), title: "learning React", isComplete: false },
  ],
  todoEdited: null,
};

const setState = (newStatePart) => {
  state = { ...state, ...newStatePart };
  const newHtml = render(state);
  renderToDom(newHtml);
};

const getState = () => {
  return state;
};

const onSaveTitle = (formElement, event, todoId) => {
  event.preventDefault();
  const formData = getFormData(formElement);

  setState({
    todos: updateTitle(state.todos, todoId, formData.title),
    todoEdited: null,
  });
};

const getFormData = (formElement) => {
  const formData = new FormData(formElement);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  console.log(data);
  return data;
};

const onAddNewTodo = (formElement, event) => {
  event.preventDefault();
  const formData = getFormData(formElement);
  const newTodo = {
    id: getId(),
    title: formData.title,
    isComplete: formData.isComplete === "on",
  };
  setState({
    todos: addTodo(state.todos, newTodo),
  });
};

const onRemoveTodo = (todoId) => {
  setState({ todos: removeTodo(todoId) });
};

const onEdit = (todoId) => {
  setState({ todoEdited: todoId });
};

const onChangeStatus = (todoId) => {
  setState({
    todos: updateStatus(state.todos, todoId),
  });
};

const addTodo = (todos, newTodo) => {
  return [...todos, newTodo];
};

const updateTitle = (todos, todoId, title) =>
  todos.map((todo) => (todo.id === todoId ? { ...todo, title } : todo));

const updateStatus = (todos, todoId) =>
  todos.map((todo) =>
    todo.id === todoId ? { ...todo, isComplete: !todo.isComplete } : todo
  );

const removeTodo = (todoId) => state.todos.filter((todo) => todo.id !== todoId);

const showActiveTodos = () => {
  renderToDom('');
  const activeTodos = filterStatusTodos(state.todos, false);
  setState({todos: activeTodos});
}

const showCompletedTodos = () => {
  renderToDom('');
  const completedTodos = filterStatusTodos(state.todos, true);
  setState({todos: completedTodos});
}

const showAllTodos = () => {

}

const filterStatusTodos = (todos, status) => todos.filter(({isComplete}) => isComplete === status);

const renderToDom = (template) => {
  document.getElementById("app").innerHTML = template;
};

const render = ({ todos, todoEdited }) =>
  `
  <div class="top-todo">
    <h1 class="name-app">Todo list</h1>
    <form class="add-todo" onsubmit="onAddNewTodo(this, event)">
      <input type="text"
             class="todo-input"
             placeholder="type todo"
             id="newTodo"
             minlength = 3
             name="title"
             />
      <input type="checkbox"
            class="complete"
            name="isComplete"
      />
      <span>status</span>
      <button type="submit" class="add-button" id="add-todo">add</button>
    </form>
  </div>
  <div class="todos">
    <ul id="todos-list" class="todos-list">
      ${todos
        .map((todo) =>
          todo.id == todoEdited
            ? `
        <li class="todo-added" id="${todo.id}">
          <form onsubmit="onSaveTitle(this, event, ${todo.id})">  
            <input type="checkbox" 
                class="complete" ${todo.isComplete ? "checked" : ""}
                name="isComplete"
            />
            <input type="text"
                   value="${todo.title}"
                   name="title"
                   class=${todo.isComplete ? "strikeout" : ""}
            />
            <button type="submit">save</button>
          </form>  
          <img src="./images/trash-alt-solid.svg" alt="" class="delete" onclick="onRemoveTodo(${
            todo.id
          })"/>
        
        </li>
        `
            : `
        <li class="todo-added" id="${todo.id}">
          <input type="checkbox"
                onchange="onChangeStatus(${todo.id})"      
                style = "color:red"/  ${todo.isComplete ? "checked" : ""}>
          <span class="complete ${todo.isComplete ? "strikeout" : ""}">${
                todo.title
              }</span>
          <button onclick="onEdit(${todo.id})">edit</button>
          <img src="./images/trash-alt-solid.svg" alt="" class="delete" onclick="onRemoveTodo(${
            todo.id
          })"/>
        </li>
        `
        )
        .join("")}
    </ul>
  </div>
  <div class="show-diff-todos">
    <button class="add-button mr-5" id="active" onclick="showActiveTodos()">active</button>
    <button class="add-button mr-5" id="complete" onclick="showCompletedTodos()">completed</button>
    <button class="add-button mr-5" id="all">all</button>
  </div>
`;

const main = () => {
  document.getElementById("app").innerHTML = render(state);
};

main();
