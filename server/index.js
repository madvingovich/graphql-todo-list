const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema');
const { getTodos, createTodo, toggleTodo, editTodo, removeTodo } = require('./todolist');

const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));

const delayedResponse = (onDone) => sleep().then(onDone);

// The root provides a resolver function for each API endpoint
const root = {
  getAllTodos: () => getTodos(),
  createTodo: ({ input }) => delayedResponse(() => createTodo(input)),
  toggleTodo: ({ input }) => delayedResponse(() => toggleTodo(input)),
  editTodo: ({ input }) => delayedResponse(() => editTodo(input)),
  removeTodo: ({ input }) => delayedResponse(() => removeTodo(input)),
};

const app = express();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000, () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
