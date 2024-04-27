import React, { useState } from "react";

const TodoList = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setTodos([]); // Clear todos when selecting a new date
  };

  const handleAddTodo = () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
    if (inputValue.trim() !== "") {
      setTodos([...todos, { id: Date.now(), date: selectedDate, text: inputValue }]);
      setInputValue("");
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleUpdateTodo = (id, newText) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />
      {selectedDate && (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.text}
                <button onClick={() => handleUpdateTodo(todo.id, prompt("Enter new text:"))}>Update</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoList;
