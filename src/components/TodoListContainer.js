import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import TodoInput from './TodoInput';

import CreateTodoMutation from '../gql/CreateTodo.mutation.gql';
import EditTodoMutation from '../gql/EditTodo.mutation.gql';
import GetAllTodosQuery from '../gql/GetAllTodos.query.gql';
import RemoveTodoMutation from '../gql/RemoveTodo.mutation.gql';
import ToggleTodoMutation from '../gql/ToggleTodo.mutation.gql';
import TodoList from './TodoList';

function TodoListContainer() {
  const [title, setTitle] = React.useState('');

  const { data, loading, error } = useQuery(GetAllTodosQuery);

  const [toggleTodo] = useMutation(ToggleTodoMutation);

  const [createTodo] = useMutation(CreateTodoMutation, {
    optimisticResponse: {
      createTodo: {
        id: Math.random(),
        title,
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
      <TodoInput value={title} onCreate={handleTodoCreate} onTitleChange={setTitle} />
      <TodoList
        todos={data.getAllTodos}
        onToggle={handleTodoToggle}
        onEdit={handleTodoEdit}
        onRemove={handleTodoRemove}
      />
    </div>
  );
}

export default TodoListContainer;
