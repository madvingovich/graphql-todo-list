import GetAllTodosQuery from '../../gql/GetAllTodos.query.gql';

export const updateTodoListOnCreate = (gqlCache, response) => {
  const cacheData = gqlCache.readQuery({ query: GetAllTodosQuery });
  gqlCache.writeQuery({
    query: GetAllTodosQuery,
    data: {
      getAllTodos: [...cacheData.getAllTodos, response.data?.createTodo],
    },
  });
};
