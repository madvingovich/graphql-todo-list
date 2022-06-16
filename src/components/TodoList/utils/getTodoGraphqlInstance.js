export const getTodoGraphqlInstance = (id, title = '', done = false) => ({
  id,
  title,
  done,
  __typename: 'Todo',
});
