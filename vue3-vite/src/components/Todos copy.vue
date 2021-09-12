<!--  -->
<template>
  <div>
    <!-- 新增todo -->
    <input
      type="text"
      v-model="newTodo"
      @keyup.enter="addTodo"
      autofocus
      placeholder="新增今日待办"
      autocomplete="off"
    />
    <!-- todo列表 -->
    <ul>
      <Li
        v-for="todo in filterTodos"
        :key="todo.id"
        :class="{ completed: todo.completed, editing: todo === editedTodo }"
      >
        <!-- 绑定完成状态 -->
        <div class="view">
          <input type="checkbox" v-model="todo.completed" />
          <label @click="editTodo(todo)">{{ todo.title }}</label>
          <button @click="removeTodo(todo)">X</button>
        </div>
        <!-- 编辑待办 -->
        <input
          type="text"
          class="edit"
          v-model="todo.title"
          v-todo-focus="todo === editedTodo"
          @blur="doneEdit(todo)"
          @keyup.enter="doneEdit(todo)"
          @keyup.escape="cancelEdit(todo)"
        />
      </Li>
    </ul>
    <!-- 过滤 -->
    <p class="filters">
      <span
        @click="visibility = 'all'"
        :class="{ selected: visibility === 'all' }"
        >All</span
      >
      <span
        @click="visibility = 'active'"
        :class="{ selected: visibility === 'active' }"
        >Active</span
      >
      <span
        @click="visibility = 'completed'"
        :class="{ selected: visibility === 'completed' }"
        >Completed</span
      >
    </p>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, computed, watchEffect } from "vue";
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
export default {
  name: "",
  setup() {
    console.log("1-开始创建组件-setup");
    const state = reactive({
      newTodo: "",
      //todos: [],
      todos: todoStorage.fetch(),
      editedTodo: null, //正在编辑的todo
      beforeEditedCache: "", //缓存正在编辑的 title
      visibility: "all",
      filterTodos: computed(() => {
        return filters[state.visibility](state.todos);
      }),
    });

    // 待办的添加操作
    function addTodo() {
      state.todos.push({
        id: state.todos.length + 1,
        title: state.newTodo,
        completed: false,
      });
      state.newTodo = "";
    }
    function removeTodo(todo) {
      state.todos.splice(state.todos.indexOf(todo), 1);
    }

    //正在编进的 todo
    function editTodo(todo) {
      state.beforeEditedCache = todo.title; //缓存，为了退出时的还原
      state.editedTodo = todo;
    }

    function cancelEdit(todo) {
      todo.title = state.beforeEditedCache;
      state.editedTodo = null;
    }
    function doneEdit(todo) {
      state.editedTodo = null;
    }
    // 副作用
    watchEffect(() => {
      todoStorage.save(state.todos);
    });
    const refData = toRefs(state);
    return {
      ...refData,
      addTodo,
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

.filters > span {
  padding: 2px 4px;
  margin-right: 4px;
  border: 1px solid transparent;
}

.filters > span.selected {
  border-color: rgba(173, 47, 47, 0.2);
}
</style>
