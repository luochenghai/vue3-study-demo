<!--  -->
<template>
  <div :class="{ active: isActive }" @click="navigate">
    {{ route.name }}
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
import { RouterLink, useLink } from "vue-router";
export default {
  name: "",
  props: {
    ...RouterLink.props,
    inactiveClass: String,
  },
  setup(props) {
    //  获取RouterLink 内部属性和方法
    const { route, href, isActive, isExactActive, navigate } = useLink(props);
    console.log(route, href, isActive, isExactActive, navigate);
    return { route, isActive, navigate };
  },
};
</script>
<style scoped>
.active {
  background-color: aquamarine;
}
</style>
