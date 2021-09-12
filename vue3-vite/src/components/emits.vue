<!--  -->
<template>
  <div @click="$emit('click')">自定义事件</div>
  <div @click="$emit('my-click')">不重名的自定义事件</div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
interface DataProps {}
export default {
  name: "",
  //emits 选项被设置后 自定义的事件和原生事件即使同名了，事件也不会被触发两次的
  // 但是应该避免自定义事件和原生事件重名
  emits: ["click", "my-click"],
  setup() {
    console.log("1-开始创建组件-setup");
    const data: DataProps = reactive({});
    onBeforeMount(() => {
      console.log("2.组件挂载页面之前执行----onBeforeMount");
    });
    onMounted(() => {
      console.log("3.-组件挂载到页面之后执行-------onMounted");
    });
    const refData = toRefs(data);
    return {
      ...refData,
    };
  },
};
</script>
<style scoped></style>
