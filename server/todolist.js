let todos = [
  {
    id: 1,
    title: 'Make todo list',
    done: false,
  },
];

const createTodo = (input) => {
  const newTodo = {
    id: Date.now(),
    done: false,
    ...input,
  };
  todos.push(newTodo);
  return newTodo;
};

const toggleTodo = ({ id }) => {
  todos = todos.map((t) => {
    if (String(t.id) === String(id)) {
      return {
        ...t,
        done: !t.done,
      };
    } else {
      return t;
    }
  });
  return todos.find((t) => String(t.id) === String(id));
};

const editTodo = ({ id, title }) => {
  todos = todos.map((t) => {
    if (String(t.id) === String(id)) {
      return {
        ...t,
        title,
      };
    } else {
      return t;
    }
  });
  return todos.find((t) => String(t.id) === String(id));
};

const removeTodo = ({ id }) => {
  todos = todos.filter((t) => String(t.id) !== String(id));
  return id;
};

const getTodos = () => todos;

module.exports = {
  todos,
  getTodos,
  createTodo,
  toggleTodo,
  editTodo,
  removeTodo,
};
