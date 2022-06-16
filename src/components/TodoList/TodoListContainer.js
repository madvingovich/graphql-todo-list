import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { getTodoGraphqlInstance } from './utils/getTodoGraphqlInstance';
import { updateCachedTodoList } from './utils/updateCachedTodoList';

import CreateTodoMutation from '../../gql/CreateTodo.mutation.gql';
import EditTodoMutation from '../../gql/EditTodo.mutation.gql';
import GetAllTodosQuery from '../../gql/GetAllTodos.query.gql';
import RemoveTodoMutation from '../../gql/RemoveTodo.mutation.gql';
import ToggleTodoMutation from '../../gql/ToggleTodo.mutation.gql';

function TodoListContainer() {
  const [title, setTitle] = React.useState('');

  const { data, loading, error } = useQuery(GetAllTodosQuery);

  const updateTodoListOnRemove = updateCachedTodoList((todos, response) =>
    todos.filter((t) => t.id !== response.data.removeTodo),
  );

  const updateTodoListOnCreate = updateCachedTodoList((todos, response) => [...todos, response.data?.createTodo]);

  const [toggleTodo] = useMutation(ToggleTodoMutation);

  const [createTodo] = useMutation(CreateTodoMutation, {
    update: updateTodoListOnCreate,
  });

  const [editTodo] = useMutation(EditTodoMutation);

  const [removeTodo] = useMutation(RemoveTodoMutation, {
    update: updateTodoListOnRemove,
  });

  const handleTodoCreate = () => {
    createTodo({
      variables: { title },
      optimisticResponse: {
        createTodo: getTodoGraphqlInstance(Math.random(), `OPTIMISTIC ${title}`, false),
      },
    });
    setTitle('');
  };

  const handleTodoEdit =
    ({ id, title }) =>
    () =>
      editTodo({
        variables: { id, title: `MODIFIED ${title}` },
        optimisticResponse: {
          editTodo: getTodoGraphqlInstance(id, `OPTIMISTIC ${title}`),
        },
      });

  const handleTodoToggle =
    ({ id, title, done }) =>
    () =>
      toggleTodo({
        variables: { id },
        optimisticResponse: {
          toggleTodo: getTodoGraphqlInstance(id, title, !done),
        },
      });

  const handleTodoRemove =
    ({ id }) =>
    () =>
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
