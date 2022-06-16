import GetAllTodosQuery from '../../../gql/GetAllTodos.query.gql';

export const updateCachedTodoList = (onUpdate) => (gqlCache, response) => {
  const cacheData = gqlCache.readQuery({ query: GetAllTodosQuery });
  gqlCache.writeQuery({
    query: GetAllTodosQuery,
    data: {
      getAllTodos: onUpdate(cacheData.getAllTodos, response),
    },
  });
};

export const updateTodoListOnRemove = updateCachedTodoList((todos, response) =>
  todos.filter((t) => t.id !== response.data.removeTodo),
);

export const updateTodoListOnCreate = updateCachedTodoList((todos, response) => [...todos, response.data?.createTodo]);
