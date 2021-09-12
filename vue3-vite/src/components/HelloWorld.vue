<template>
  <h1>{{ msg }}</h1>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <p>Hello vite!</p>
  <!-- 在差值表达式中我们是使用的 data. 这样很繁琐，可以使用 toRefs 进行转换下 -->
  <!-- <p>{{ data.counter }}</p>
  <p>{{ data.doubleCounter }}</p> -->

  <p>{{ counter }}</p>
  <p>{{ doubleCounter }}</p>
  <!-- 通过使用ref 来引用dom 元素 -->
  <p ref="desc"></p>

  <!-- teleport :ModelButton 传送门,将来是追加在body上的 -->
  <ModelButton> </ModelButton>

  <!-- emits选项 -->
  <Emits @my-click="onClick2"></Emits>

  <!-- 实例方法定义组件 -->
  <comp></comp>

  <!-- v-model使用 -->
  <!-- <VmodelTest v-model="counterNum"></VmodelTest> -->

  <VmodelTest v-model:counterNum="counterNum"></VmodelTest>
  <!-- 等效于下列写法 -->
  <!-- <VmodelTest :counterNum="counterNum" @update:counterNum="counterNum=$event"></VmodelTest> -->

  <!-- render api 发生了变化 -->
  <renderTest v-model:counterNum="counterNum">
    <!-- 插槽使用 -->
    <template v-slot:default>title</template>
    <template v-slot:content>content....</template>
  </renderTest>

  <!-- 函数式组件 -->
  <Functional level="3">这是一个动态h元素</Functional>

  <!-- 异步组件 -->
  <AsyncComp></AsyncComp>

  <!-- 自定义指令 -->
  <!-- 自定义指令API 和组件保持一致 
     vue3 中指令api 和组件保持一致，具体表现在：
     1. bind -> beforeMount
     2.inserted -> mounted
     3.beforeUpdate: new! 元素自身更新前使用，和组件生命周期钩子很像
     4.update -> removed！和updated 基本相同，因此被移除了。使用updated代替。
     5.componentUpdated -> updated 代替
     6.beforeUnmount new!和组件生命周期钩子相似，元素在被移除之前调用。
     7.unbind -> unmounted
  -->

  <p v-highlight="'green'">highlight this text !!!</p>

  <!--动画  -->
  <TransitionTest></TransitionTest>

  <!-- 编程的方式发送和监听事件 -->
  <button @click="sendMsg">emit event</button>
</template>
<script>
import {
  reactive,
  computed,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
  h,
  defineAsyncComponent,
} from "vue";
import ModelButton from "./ModelButton.vue";
import Emits from "./emits.vue";
import VmodelTest from "./VmodelTest.vue";
import Functional from "./Functional.vue";
import TransitionTest from "./TransitionTest.vue";

// 事件派发和监听
import mitt from "mitt";
export const emitter = mitt();

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      counterNum: 1,
    };
  },
  components: {
    ModelButton,
    Emits,
    VmodelTest,
    renderTest: {
      props: {
        counterNum: {
          type: Number,
          default: 0,
        },
      },
      render() {
        // this.$scopedSlots.content() vue2 获取作用域插槽内容的方式，现在已经废除了

        this.$slots.default(); //vue3 统一成了 slots  默认
        this.$slots.content(); //vue3 统一成了 slots  具名

        // 没把事件从抽离出去时由于this的指向问题，需要保存下，义工h 函数内部使用
        //const emit = this.$emit;
        //const counterNum = this.counterNum;
        return h("div", [
          h("div", { onClick: this.onClick }, [
            `I am RenderTest:${this.counterNum}`,
            this.$slots.default(),
            this.$slots.content(),
          ]),
        ]);
      },
      methods: {
        onClick() {
          this.$emit("update:counterNum", this.counterNum + 1);
        },
      },
    },
    //函数式组件
    Functional,
    AsyncComp: defineAsyncComponent(() => import("./NextPage.vue")), //vue3 中异步组价的加载 需要被 defineAsyncComponent 包裹，是为了和函数组件区分开来
    // 带配置的异步组件，loading 选项时以前的component,例如：
    // import errorComponent from "./errorComponent";
    // import loadingComponent from "./loadingComponent";
    //  const asyncPageWithOptions  = defineAsyncComponent({
    //   loading:()=>import('./NextPage.vue'),
    //   delay:200,
    //   timeout:3000,
    //   errorComponent: errorComponent,
    //   loadingComponent:loadingComponent
    // })
    TransitionTest,
  },
  methods: {
    onClick() {
      console.log("click me");
    },
    onClick2() {
      console.log("click me");
    },
    sendMsg() {
      emitter.emit("someEvent", "foooo");
    },
  },
  setup() {
    // counter 相关
    // const data = useCounter(); //没使用toRefs 展开前的写法
    const { counter, doubleCounter } = useCounter();

    // 其它
    //ref的用法：1. 单值响应式数据 2.引用界面中的dom 元素
    const msg2 = ref("some message");
    //return { data, msg2 };
    // 使用元素引用
    const desc = ref(null);
    // 侦听器的两种写法:
    // 如果监听对象中的某个属性，需要写成回调函数的形式
    // watch(
    //   () => data.counter,
    //   (val, oldVal) => {
    //     const p = desc.value; //p元素
    //     p.textContent = `counter change from ${oldVal} to ${val}`;
    //   }
    // );

    //需要监听的数据是响应式的，不用写成回调函数的形式
    watch(counter, (val, oldVal) => {
      const p = desc.value; //p元素
      p.textContent = `counter change from ${oldVal} to ${val}`;
    });
    return { counter, doubleCounter, msg2, desc };
  },
};

// 更好的操是 根据业务需求 可以将function 抽离到指定的文件中归类
function useCounter() {
  // counter 相关,可以写在setup 中，但这样数据一多 setup 会显得臃肿，可以将它抽离出去
  const data = reactive({
    counter: 1,
    //计算属性
    doubleCounter: computed(() => data.counter * 2),
  });
  let timer;
  //生命周期 (在setup 函数中是没有 beforeCreate 和created 钩子函数的，最早的的时间点是在 onMounted 中)
  //在挂载后 自增
  onMounted(() => {
    timer = setInterval(() => {
      data.counter++;
    }, 1000);
  });
  //卸载
  onUnmounted(() => {
    clearInterval(timer);
  });
  // 记得返回 data
  // return data;
  // 使用toRefs 展开后它就成单值响应式数据，如果不使用 toRefs 展开后就不再是响应式数据了
  return toRefs(data);
}
</script>
