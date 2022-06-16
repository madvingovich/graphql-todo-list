import { gql, useMutation, useQuery } from '@apollo/client';
import './App.css';
import GetAllTodosQuery from './gql/GetAllTodos.query.gql';
import ToggleTodoMutation from './gql/ToggleTodo.mutation.gql';
import CreateTodoMutation from './gql/CreateTodo.mutation.gql';
import EditTodoMutation from './gql/EditTodo.mutation.gql';
import RemoveTodoMutation from './gql/RemoveTodo.mutation.gql';
import React from 'react';

function App() {
  const [title, setTitle] = React.useState('');

  const { data, loading, error } = useQuery(GetAllTodosQuery);

  const [toggleTodo] = useMutation(ToggleTodoMutation);

  const [createTodo] = useMutation(CreateTodoMutation, {
    optimisticResponse: {
      createTodo: {
        id: Math.random(),
        title: title,
        done: false,
        __typename: 'Todo',
      },
    },
    update(cache, { data }) {
      const cd = cache.readQuery({ query: GetAllTodosQuery });
      cache.writeQuery({
        query: GetAllTodosQuery,
        data: {
          getAllTodos: [...cd.getAllTodos, data?.createTodo],
        },
      });
    },
  });

  const [editTodo] = useMutation(EditTodoMutation);

  const [removeTodo] = useMutation(RemoveTodoMutation, {
    update(cache, { data }) {
      const cd = cache.readQuery({ query: GetAllTodosQuery });
      cache.writeQuery({
        query: GetAllTodosQuery,
        data: {
          getAllTodos: cd.getAllTodos.filter((t) => t.id !== data.removeTodo),
        },
      });
    },
  });

  const handleTodoCreate = () => {
    createTodo({ variables: { title } });
    // setTitle('');
  };

  const handleTodoEdit = (id, title) => () =>
    editTodo({
      variables: { id, title: `MODIFIED ${title}` },
      optimisticResponse: {
        editTodo: {
          __typename: 'Todo',
          id,
          title: `OPTIMISTIC ${title}`,
        },
      },
    });

  const handleTodoToggle = (id, done) => () =>
    toggleTodo({
      variables: { id },
      optimisticResponse: {
        toggleTodo: {
          __typename: 'Todo',
          id,
          done: !done,
        },
      },
    });

  const handleTodoRemove = (id) => () =>
    removeTodo({
      variables: { id },
      optimisticResponse: {
        removeTodo: id,
      },
    });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error.message}</p>;
  }

  return (
    <div className="App">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleTodoCreate}>Create</button>
      <ul>
        {data.getAllTodos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <input type="checkbox" checked={todo.done} onChange={handleTodoToggle(todo.id, todo.done)} />
            <button onClick={handleTodoEdit(todo.id, todo.title)}>Edit</button>
            <button onClick={handleTodoRemove(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
