const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema');

let todos = [
  {
    id: 1,
    title: 'Make todo list',
    done: false,
  },
];

const createTodo = (input) => ({
  id: Date.now(),
  ...input,
});

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
  return true;
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
  return true;
};

const removeTodo = ({ id }) => {
  todos = todos.filter((t) => String(t.id) !== String(id));
  return true;
};

// The root provides a resolver function for each API endpoint
const root = {
  getAllTodos: () => todos,
  createTodo: ({ input }) => {
    const todo = createTodo(input);
    todos.push(todo);
    return todo;
  },
  toggleTodo: ({ input }) => toggleTodo(input),
  editTodo: ({ input }) => editTodo(input),
  removeTodo: ({ input }) => removeTodo(input),
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000, () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
