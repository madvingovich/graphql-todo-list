const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    getAllTodos: [Todo]
  }

  type Mutation {
    createTodo(input: TodoInput): Todo
    toggleTodo(input: IdInput): Todo
    editTodo(input: TodoInput): Todo
    removeTodo(input: IdInput): ID
  }

  type Todo {
    id: ID
    title: String
    done: Boolean
  }


  input TodoInput {
    id: ID
    title: String!
    done: Boolean
  }

  input IdInput {
    id: ID!
  }
`);

module.exports = { schema };
