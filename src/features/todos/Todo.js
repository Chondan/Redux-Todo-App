import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, setFilter, selectFilter, toggleTodo, selectTodoById, selectTodoIds } from './todosSlice';
import styles from './todo.module.css';

const AddTodo = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const handleAddTodoClicked = () => {
    dispatch(addTodo(inputRef.current.value));
    inputRef.current.value = "";
    inputRef.current.focus();
  }
  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleAddTodoClicked}>Add Todo</button>
      <button onClick={() => dispatch(fetchTodos())}>Fetch Todos</button>
    </div>
  );
}

const Item = ({
  todoId, onClick
}) => {
  const todo = useSelector(state => selectTodoById(state, todoId));
  const currentFilter = useSelector(selectFilter);
  const isShow = (currentFilter) => {
    switch (currentFilter) {
      case "SHOW_ALL":
        return true;
      case "ACTIVE":
        return todo.completed ? false : true;
      case "COMPLETED":
        return todo.completed ? true : false;
      default:
        return true;
    }
  }
  if (!isShow(currentFilter)) {
    return false;
  }
  const todoStyles = {
    textDecoration: todo.completed ? "line-through" : "none",
    cursor: "pointer"
  };
  return (
    <li><span style={todoStyles} className={styles["todo-item"]} onClick={onClick}>{todo.title}</span></li>
  );
}

const TodoList = () => {
  const todoIds = useSelector(selectTodoIds);
  const dispatch = useDispatch();
  const handleToggleTodo = (todoId) => {
    dispatch(toggleTodo(todoId));
  };
  const renderedItem = todoIds.map(todoId => (
    <Item key={todoId} todoId={todoId} onClick={() => handleToggleTodo(todoId)} />
  ));
  return (
    <ul>
      {renderedItem}
    </ul>
  );
}

const FilterLink = ({
  children, onClick, isActive
}) => {
  const styles = {
    color: isActive() ? "black" : "blue",
    cursor: "pointer"
  }
  return (
    <span style={styles} onClick={onClick}>{children}</span>
  );
}

const FilterTodo = () => {
  const currentFilter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const isActive = (filter) => {
    return currentFilter === filter;
  }
  const setCurrentFilter = (filter) => {
    dispatch(setFilter({ filter }));
  }
  return (
    <div>
      Filter:{' '}
      <FilterLink onClick={() => setCurrentFilter("SHOW_ALL")} isActive={() => isActive("SHOW_ALL")}>Show All</FilterLink>{', '}
      <FilterLink onClick={() => setCurrentFilter("ACTIVE")} isActive={() => isActive("ACTIVE")}>Active</FilterLink>{', '}
      <FilterLink onClick={() => setCurrentFilter("COMPLETED")} isActive={() => isActive("COMPLETED")}>Completed</FilterLink>
    </div>
  );
}

const Todo = () => {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <FilterTodo />
    </div>
  );
}

export default Todo;