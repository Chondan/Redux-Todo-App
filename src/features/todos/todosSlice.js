import { createAsyncThunk, createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';

const todosAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.time - a.time
});
const initialState = todosAdapter.getInitialState({
  filter: "SHOW_ALL"
});

const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    let data = await response.json();
    data = data.map(d => {
      delete d.userId;
      return {
        ...d,
        time: Date.now(),
      };
    });
    return data;
  }  
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        todosAdapter.addOne(state, action.payload);
      },
      prepare: (title) => {
        return {
          payload: {
            id: nanoid(),
            time: Date.now(),
            completed: false,
            title
          }
        }
      }
    },
    toggleTodo: {
      reducer: (state, action) => {
        const { id } = action.payload;
        const isCompleted = state.entities[id].completed;
        state.entities[id].completed = !isCompleted;
      },
      prepare: (id) => {
        return {
          payload: {
            id
          }
        }
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload.filter;
    }
  },
  extraReducers: {
    [fetchTodos.fulfilled]: (state, action) => {
      todosAdapter.setAll(state, action.payload);
    }
  },
});

const { actions, reducer } = todosSlice;
export const { addTodo, toggleTodo, setFilter } = actions;
export default reducer;
export { fetchTodos };
export const {
  selectAll: selectAllTodo,
  selectById: selectTodoById,
  selectIds: selectTodoIds
} = todosAdapter.getSelectors(state => state.todos);
export const selectFilter = state => state.todos.filter;