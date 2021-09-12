<!--  -->
<template>
  <input
    type="text"
    :value="todoTitle"
    @input="onInputChange"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: "",
  props: {
    // modelValue: {
    //   type: String,
    //   default: "",
    // },
    todoTitle: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInputChange(e) {
      this.$emit("update:todoTitle", e.target.value);
    },
  },
};
</script>
<style scoped></style>
