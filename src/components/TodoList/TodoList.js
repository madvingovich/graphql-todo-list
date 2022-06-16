function TodoList({ todos, onToggle, onEdit, onRemove }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title}
          <input type="checkbox" checked={todo.done} onChange={onToggle(todo)} />
          <button onClick={onEdit(todo)}>Edit</button>
          <button onClick={onRemove(todo)}>X</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
