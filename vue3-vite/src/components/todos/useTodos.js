import { ref, watchEffect } from "vue";
//缓存
const todoStorage = {
  fetch() {
    let todos = JSON.parse(localStorage.getItem("vue3-todos") || "[]");
    todos.forEach((todo, index) => {
      todo.id = index + 1;
    });
    return todos;
  },
  //todos 发生变化就开始缓存  这是典型的副作用
  save(todos) {
    localStorage.setItem("vue3-todos", JSON.stringify(todos));
  },
};

export function useTodos(state) {
  const todos = ref(todoStorage.fetch());
  // 待办的添加操作
  function addTodo() {
    todos.value.push({
      id: todos.value.length + 1,
      title: state.newTodo,
      completed: false,
    });
    state.newTodo = "";
  }

  function removeTodo(todo) {
    todos.value.splice(todos.value.indexOf(todo), 1);
  }

  // 副作用
  watchEffect(() => {
    todoStorage.save(todos.value);
  });

  return { todos, addTodo, removeTodo };
}
