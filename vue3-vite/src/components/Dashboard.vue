<template>
  <ul>
    <li>
      <!-- <router-link to="/">Dashboard</router-link> -->
      <NavLink to="/"></NavLink>
    </li>
    <li>
      <!-- <router-link to="/todos">todos</router-link> -->
      <NavLink to="/todos"></NavLink>
    </li>
    <li>
      <!-- <router-link to="/about">about</router-link> -->
      <NavLink to="/about"></NavLink>
    </li>
  </ul>
</template>

<script>
import NavLink from "./NavLink.vue";
export default {
  components: {
    NavLink,
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style scoped></style>
