const getId = (() => {
  let globalID = 0;
  return () => (globalID += 1);
})();

let state = {
  todos: [/*
    { id: getId(), title: "learning JS", isComplete: false },
    { id: getId(), title: "learning HTML", isComplete: true },
    { id: getId(), title: "learning CSS", isComplete: true },
    { id: getId(), title: "learning React", isComplete: false },*/
  ],
  todoEdited: null,
};

let history = {
  allStates: [],
  cursor: -1,
}

//historyFlag означает если вы сетаете state из ф-ции redoHistory или undoHistory, то измененый state не будет ложится заново в history 
const setState = (newStatePart, historyFlag = false) => {
  state = { ...state, ...newStatePart };
  if (!historyFlag)addToHistory(state);
  
  const newHtml = render(state);
  renderToDom(newHtml);
};

const addToHistory = (newState) => {
  if (state.todoEdited === null) {
    history.allStates.splice(history.cursor + 1);
    history.allStates.push(newState);
    history.cursor = history.allStates.length - 1;
  }
}

const undoHistory = () => {
  const historyFlag = true;
  let newState = null;

  if(history.cursor === 0) {
    history.cursor -= 1;
    setState({todos:[]}, historyFlag);
  }

  if(history.cursor !== -1){
    history.cursor -= 1;
    newState = history.allStates[history.cursor];
    setState(newState, historyFlag);
  }
}

const redoHistory = () => {
  const historyFlag = true;
  let newState = null;
  if(history.cursor < history.allStates.length - 1) {
    history.cursor += 1;
    newState = history.allStates[history.cursor];
    setState(newState, historyFlag);
  }
}

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
  return data;
};

const onAddNewTodo = (formElement, event) => {
  event.preventDefault();
  const formData = getFormData(formElement);
  if (formData.title.length === 0) return;
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

const onShowActiveTodos = () => {
  const activeTodosHtml = render({
    todos: filterStatusTodos(state.todos, false),
  });
  renderToDom(activeTodosHtml);
  document.getElementById("active").classList.add("active");
};

const onShowCompletedTodos = () => {
  const completedTodosHtml = render({
    todos: filterStatusTodos(state.todos, true),
  });
  renderToDom(completedTodosHtml);
  document.getElementById("complete").classList.add("active");
};

const onShowAllTodos = () => {
  const allTodosHtml = render(state);
  renderToDom(allTodosHtml);
  document.getElementById("all").classList.add("active");
};

const filterStatusTodos = (todos, status) =>
  todos.filter(({ isComplete }) => isComplete === status);

const countActiveTodos = (todos) => {
  return filterStatusTodos(todos, false).length;
};

const renderToDom = (template) => {
  document.getElementById("app").innerHTML = template;
};

const render = ({ todos, todoEdited = null }) => {
  const activeTodos = countActiveTodos(state.todos);
  const undoEnabled = ( history.allStates.length === 0 || todos.length === 0 ) ? 'disabled' : '';
  const redoEnabled = ( history.allStates.length === 0 || history.cursor === history.allStates.length - 1 ) ? 'disabled' : '';

  return  `
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
            class="addStatus"
            name="isComplete"
      />
      <span class="addStatus">isComplete</span>
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
          <form onsubmit="onSaveTitle(this, event, ${
            todo.id
          })" class="formEdit">  
            <input type="checkbox" 
                class="complete" ${todo.isComplete ? "checked" : ""}
                name="isComplete"
            />
            <input type="text"
                   value="${todo.title}"
                   name="title"
                   class=formEdit-title ${todo.isComplete ? "strikeout" : ""}
            />
            <button type="submit" class="saveBtn"><img src="./images/save.png" alt="" class="save edit"></button>
            
          </form> 
          <div class="icons">
            <img src="./images/trash-alt-solid.svg" alt="" class="delete" onclick="onRemoveTodo(${
              todo.id
            })"/>
          </div>
        
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
          <div class="icons">
            <img src="./images/pencil.png" alt="" class="edit" onclick="onEdit(${
              todo.id
            })">
            <img src="./images/trash-alt-solid.svg" alt="" class="delete" onclick="onRemoveTodo(${
              todo.id
            })"/>
          </div>
        </li>
        `
        )
        .join("")}
    </ul>
  </div>
  <div class="show-diff-todos">
    <button class="add-button mr-5" id="active" onclick="onShowActiveTodos()">active</button>
    <button class="add-button mr-5" id="complete" onclick="onShowCompletedTodos()">completed</button>
    <button class="add-button mr-5" id="all" onclick="onShowAllTodos()">all</button>
  </div>
  <div class="historyBtns">
    <button onclick="redoHistory()" ${redoEnabled} class="mr-5">redo</button>
    <button onclick="undoHistory()" ${undoEnabled}>undo</button>
  </div>
  <span class="active-todos">active todos: ${activeTodos}</span>
`;
};

const main = () => {
  document.getElementById("app").innerHTML = render(state);
};

main();
