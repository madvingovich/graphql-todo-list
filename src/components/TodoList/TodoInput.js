function TodoInput({ value, onTitleChange, onCreate }) {
  return (
    <>
      <input type="text" value={value} onChange={(e) => onTitleChange(e.target.value)} />
      <button onClick={onCreate}>Create</button>
    </>
  );
}

export default TodoInput;
