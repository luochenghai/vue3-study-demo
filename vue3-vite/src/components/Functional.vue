<!--  -->
<script>
import { h } from "vue";
// vue3 中函数式组件只能使用函数式声明
function Heading(props, context) {
  console.log(context);
  return h(`h${props.level}`, context.attrs, context.slots);
}

Heading.props = ["level"];
export default Heading;
</script>
