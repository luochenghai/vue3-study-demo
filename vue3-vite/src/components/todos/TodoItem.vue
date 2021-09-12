<!--  -->
<template>
  <li :class="{ completed: todo.completed, editing: todo === editedTodo }">
    <!-- 绑定完成状态 -->
    <div class="view">
      <input type="checkbox" v-model="todo.completed" />
      <label @click="editTodo(todo)">{{ todo.title }}</label>
      <button @click="removeTodo(todo)">X</button>
    </div>
    <!-- 编辑待办 -->
    <EditTodo
      class="edit"
      v-model:todo-title="todo.title"
      v-todo-focus="todo === editedTodo"
      @blur="doneEdit(todo)"
      @keyup.enter="doneEdit(todo)"
      @keyup.escape="cancelEdit(todo)"
    ></EditTodo>
  </li>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
export default {
  name: "",
  props: {
    // 待办列表
    todo: {
      type: Object,
      required: true,
    },
    editedTodo: Object, //待编辑的
  },
  emits: ["remove-todo", "update:edited-todo"],
  setup(props, { emit }) {
    const state = reactive({
      beforeEditedCache: "", //缓存正在编辑的 title
    });
    const refData = toRefs(state);

    function removeTodo(todo) {
      //由于setup 中没有this，需要在 setup 中结构 props 和 emit
      //state.todos.splice(state.todos.indexOf(todo), 1);
      emit("remove-todo", todo);
    }
    //正在编进的 todo
    function editTodo(todo) {
      state.beforeEditedCache = todo.title; //缓存，为了退出时的还原
      // state.editedTodo = todo;
      emit("update:edited-todo", todo);
    }

    function cancelEdit(todo) {
      todo.title = state.beforeEditedCache;
      //state.editedTodo = null;
      emit("update:edited-todo", null);
    }
    function doneEdit(todo) {
      //state.editedTodo = null;
      emit("update:edited-todo", null);
    }
    return {
      ...refData,
      removeTodo,
      editTodo,
      cancelEdit,
      doneEdit,
    };
  },

  //自定义指令，获取焦点
  directives: {
    "todo-focus": (el, { value }) => {
      if (value) {
        el.focus();
      }
    },
  },
};
</script>
<style scoped>
.completed label {
  text-decoration: line-through;
}

.edit,
.editing .view {
  display: none;
}

.view,
.editing .edit {
  display: block;
}
</style>
