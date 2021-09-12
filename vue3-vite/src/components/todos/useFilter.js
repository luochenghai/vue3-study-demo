import { reactive, computed } from "vue";
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter((todo) => !todo.completed);
  },
  completed(todos) {
    return todos.filter((todo) => todo.completed);
  },
};
export function useFilter(todos) {
  const filterState = reactive({
    newTodo: "",
    //todos: [],
    // todos: todoStorage.fetch(),
    editedTodo: null, //正在编辑的todo
    // beforeEditedCache: "", //缓存正在编辑的 title
    filterItems: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Completed", value: "completed" },
    ],
    visibility: "all",
    filterTodos: computed(() => {
      // return filters[state.visibility](state.todos);
      return filters[filterState.visibility](todos.value);
    }),
  });
  return filterState;
}
