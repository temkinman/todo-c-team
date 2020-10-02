const getId = (() => {
  let globalID = 0;
  return () => (globalID += 1);
})();

let state = {
  todos: [
    /*
    { id: getId(), title: "learning JS", isComplete: false },
    { id: getId(), title: "learning HTML", isComplete: true },
    { id: getId(), title: "learning CSS", isComplete: true },
    { id: getId(), title: "learning React", isComplete: false },*/
  ],
  todoEdited: null,
  history: {
    allStates: [],
    cursor: -1,
  },
  filter: "all",
};

//historyFlag означает если вы сетаете state из ф-ции redoHistory или undoHistory, то измененый state не будет ложится заново в history
const setState = (newStatePart, historyFlag = false) => {
  state = { ...state, ...newStatePart };

  if (!historyFlag && state.todoEdited === null) {
    state = {...state, history: {...state.history,
                                 allStates: addHistory(state),
                                 cursor: state.history.allStates.length - 1,
                                },
            };
  }
  renderWithFilter(state);
};

const renderWithFilter = (state) => {
  if (state.filter === "active" || state.filter === "completed") {
    const stateWithFilter = filterStatusTodos(state, state.filter);
    const newHtml = render(stateWithFilter);
    renderToDom(newHtml);
  } else {
    const newHtml = render(state);
    renderToDom(newHtml);
  }
};

const addHistory = ({ history, todos }) => [...history.allStates, todos];

const undoHistory = ({ history }) => {
  const historyFlag = true;

  if (history.cursor === 0) {
    history.cursor -= 1;
    setState({ todos: [] }, historyFlag);
  }

  if (history.cursor !== -1) {
    history.cursor -= 1;
    const newState = history.allStates[history.cursor];
    setState({ todos: newState }, historyFlag);
  }
};

const redoHistory = ({ history }) => {
  const historyFlag = true;

  if (history.cursor < history.allStates.length - 1) {
    history.cursor += 1;
    const newState = history.allStates[history.cursor];
    setState({ todos: newState }, historyFlag);
  }
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

const addTodo = (todos, newTodo) => [...todos, newTodo];

const updateTitle = (todos, todoId, title) =>
  todos.map((todo) => (todo.id === todoId ? { ...todo, title } : todo));

const updateStatus = (todos, todoId) =>
  todos.map((todo) =>
    todo.id === todoId ? { ...todo, isComplete: !todo.isComplete } : todo
  );

const removeTodo = (todoId) => state.todos.filter((todo) => todo.id !== todoId);

const onShowActiveTodos = () => {
  setFilter("active");
};

const onShowCompletedTodos = () => {
  setFilter("completed");
};

const onShowAllTodos = () => {
  setFilter("all");
};

const setFilter = (filter) => {
  setState({ filter }, true); //true it's for not to save in the history
};

const filterStatusTodos = ({ todos, filter }) => {
  if (filter === "all") return state;

  const isActive = filter === "active" ? false : true;

  const filteredTodos = todos.filter(
    ({ isComplete }) => isComplete === isActive
  );

  return (newTodos = { ...state, todos: filteredTodos });
};

const countActiveTodos = () => {
  const notFilteredState = getState();
  return notFilteredState.todos.filter(({ isComplete }) => isComplete === false)
    .length;
};

const renderToDom = (template) => {
  document.getElementById("app").innerHTML = template;
};

const render = (state) => {
  const { todos, history, todoEdited, filter } = { ...state };
  const activeTodos = countActiveTodos(todos);
  const activeFilter = filter === "active" ? "active" : "";
  const completedFilter = filter === "completed" ? "active" : "";
  const allFilter = filter === "all" ? "active" : "";
  const undoEnabled =
    history.allStates.length === 0 || todos.length === 0 ? "disabled" : "";
  const redoEnabled =
    history.allStates.length === 0 ||
    history.cursor === history.allStates.length - 1
      ? "disabled"
      : "";

  return `
  <div class="top-todo">
    <h1 class="name-app">Todo list</h1>
    <form class="add-todo" onsubmit="onAddNewTodo(this, event)">
      <div class="add-todo-block">  
        <input type="text"
             class="todo-input"
             placeholder="type todo"
             id="newTodo"
             minlength = 3
             name="title"
             />
        <div class="add-todo-status">
          <input type="checkbox"
                class="addStatus"
                name="isComplete"
          />
          <span class="addStatus">completed?</span>
        </div>     
      </div>  
      <button type="submit"
              class="button"
              id="add-todo">add
      </button>
      
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
                ${todo.isComplete ? "checked" : ""}/>
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
    <button class="button mr-5 ${activeFilter}"
            id="active"
            onclick="onShowActiveTodos()"
            >active
    </button>
    <button class="button mr-5 ${completedFilter}"
            id="complete"
            onclick="onShowCompletedTodos()"
            >completed
    </button>
    <button class="button mr-5 ${allFilter}"
            id="all"
            onclick="onShowAllTodos()"
            >all
    </button>
  </div>
  <div class="historyBtns">
    <button onclick="redoHistory(state)" ${redoEnabled} class="button mr-5"><img src="./images/redo.png" alt="" class="redo"></button>
    <button onclick="undoHistory(state)" ${undoEnabled} class="button"><img src="./images/undo.png" alt="" class="undo"></button>
  </div>
  <span class="active-todos">active todos: ${activeTodos}</span>
`;
};

const main = () => {
  document.getElementById("app").innerHTML = render(state);
};

main();
