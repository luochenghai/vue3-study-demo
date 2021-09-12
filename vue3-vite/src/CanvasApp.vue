<!-- 自定义渲染器 customer render -->
<template>
  <piechart
    @click="handleClick"
    :data="data"
    :x="200"
    :y="200"
    :r="200"
  ></piechart>
</template>

<script lang="ts">
import { reactive, ref, toRefs, onBeforeMount, onMounted } from "vue";
//interface DataProps {}
export default {
  name: "",
  setup() {
    console.log("1-开始创建组件-setup");
    const state = reactive({
      data: [
        { name: "大专", count: 200, color: "brown" },
        { name: "本科", count: 300, color: "yellow" },
        { name: "硕士", count: 100, color: "pink" },
        { name: "博士", count: 50, color: "skyblue" },
      ],
    });
    onBeforeMount(() => {
      console.log("2.组件挂载页面之前执行----onBeforeMount");
    });
    onMounted(() => {
      console.log("3.-组件挂载到页面之后执行-------onMounted");
    });
    function handleClick() {
      state.data.push({ name: "其它", count: 30, color: "skyblue" });
    }
    const refData = toRefs(state);
    return {
      ...refData,
      handleClick,
    };
  },
};
</script>
<style scoped></style>
