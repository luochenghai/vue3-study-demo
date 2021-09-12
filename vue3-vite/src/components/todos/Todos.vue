<!--  -->
<template>
  <div>
    <!-- 新增todo -->
    <EditTodo
      v-model:todo-title="newTodo"
      @keyup.enter="addTodo"
      autofocus
      placeholder="新增今日待办"
      autocomplete="off"
    ></EditTodo>

    <!-- todo列表 -->
    <ul>
      <TodoItem
        v-for="todo in filterTodos"
        :key="todo.id"
        :todo="todo"
        v-model:edited-todo="editedTodo"
        @remove-todo="removeTodo"
      >
      </TodoItem>
    </ul>
    <!-- 过滤 -->
    <Filter :items="filterItems" v-model="visibility"></Filter>
    <button @click="backToDash">backToDash-to</button>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, watch } from "vue";
import TodoItem from "./TodoItem.vue";
import Filter from "./Filter.vue";
import { useTodos } from "./useTodos.js";
import { useFilter } from "./useFilter.js";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
export default {
  name: "",
  components: {
    TodoItem,
    Filter,
  },
  setup() {
    const todoState = reactive({
      newTodo: "",
      editedTodo: null, //正在编辑的todo
    });
    const { todos, addTodo, removeTodo } = useTodos(todoState);
    const filterState = useFilter(todos);
    const refData = toRefs(filterState);

    // 获取路由器实例
    const router = useRouter();

    // route 是响应式的对象，可以监控其变化
    const route = useRoute();
    watch(
      () => route.query,
      (query) => {
        console.log(query);
      }
    );
    //  守卫
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm("你确定离开当前页面吗？");
      if (!answer) {
        return false;
      }
    });

    return {
      ...refData,
      ...toRefs(todoState),
      addTodo,
      removeTodo,
      backToDash() {
        router.push("/");
      },
    };
  },
};
</script>
<style scoped></style>
