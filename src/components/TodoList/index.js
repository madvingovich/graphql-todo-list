function TodoList({ todos, onToggle, onEdit, onRemove }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title}
          <input type="checkbox" checked={todo.done} onChange={onToggle(todo.id, todo.done)} />
          <button onClick={onEdit(todo.id, todo.title)}>Edit</button>
          <button onClick={onRemove(todo.id)}>X</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
