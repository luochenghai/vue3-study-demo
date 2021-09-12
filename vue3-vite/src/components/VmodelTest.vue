<!--  -->
<template>
  <!-- <div @click="$emit('update:modelValue', modelValue + 1)">
    counter:{{ modelValue }}
  </div> -->
  <!-- 等效写法 -->
  <div @click="$emit('update:counterNum', counterNum + 1)">
    counter:{{ counterNum }}
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
interface DataProps {}
export default {
  name: "",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    counterNum: {
      type: Number,
      default: 0,
    },
  },
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
