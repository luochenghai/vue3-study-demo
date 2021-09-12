<!--  -->
<template>
  <div>this is NextPage</div>
</template>

<script>
import { emitter } from "./HelloWorld.vue";
export default {
  mounted() {
    //挂载之后 监听 someEvent 事件
    emitter.on("someEvent", (msg) => {
      console.log(msg);
    });
  },
};
</script>
<style scoped></style>
