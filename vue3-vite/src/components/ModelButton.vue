<!--  -->
<template>
  <div>
    <button @click="modelOpen = true">弹出一个模态框</button>
    <!-- teleport 是系统内置组件直接使用即可 -->
    <!-- to 是指明要去的地方 -->
    <teleport to="body">
      <div v-if="modelOpen" class="model">
        <div>
          我是弹窗,我的父元素是body
          <button @click="modelOpen = false">关闭</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
interface DataProps {}
export default {
  name: "",
  data() {
    return {
      modelOpen: true,
    };
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
<style scoped>
.model {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.model div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: red;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>
