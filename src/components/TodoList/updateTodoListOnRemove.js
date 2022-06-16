import GetAllTodosQuery from '../../gql/GetAllTodos.query.gql';

export const updateTodoListOnRemove = (gqlCache, response) => {
  const cd = gqlCache.readQuery({ query: GetAllTodosQuery });
  gqlCache.writeQuery({
    query: GetAllTodosQuery,
    data: {
      getAllTodos: cd.getAllTodos.filter((t) => t.id !== response.data.removeTodo),
    },
  });
};
