import { createApp, createRenderer, h } from "vue";
import App from "./App.vue";
import "./index.css";
import CanvasApp from "./CanvasApp.vue";
import EditTodo from "./components/todos/EditTodo.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Todos from "./components/todos/Todos.vue";
import Dashboard from "./components/Dashboard.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/todos", name: "todos", component: Todos },
  ],
});

// 动态路由的添加
router.addRoute({
  path: "/about",
  name: "about",
  component: () => import("./components/About.vue"),
});

router.addRoute("about", {
  path: "/about/info",
  name: "info",
  component: {
    render() {
      return h("div", "info page");
    },
  },
});

// composition

createApp(App)
  .use(router)
  .component("comp", {
    render() {
      // 一定要加return 将创建的元素返回
      return h("div", "I am comp");
    },
  })
  .component("EditTodo", EditTodo)
  .directive("highlight", {
    beforeMount(el, binding, vnode) {
      el.style.background = binding.value;
    },
  })
  .mount("#app");

// 自定义渲染器
const nodeOps = {
  insert: (child, parent, anchor) => {
    // 处理元素插入逻辑
    // 1.如果是子元素，不是真实的 dom ，此时只需要将数据保存到前面虚拟对象上即可
    child.parent = parent; //孩子中保存老爹

    if (!parent.childs) {
      parent.childs = [child]; //首次渲染时不存在，需要初始化下
    } else {
      parent.childs.push(child); //以后来就追加即可
    }
    // 2.如果传入的是真实dom 元素,在这里会是canvas,需要绘制
    //  nodeType == 1 元素节点
    if (parent.nodeType == 1) {
      draw(child);

      // 事件处理
      if (child.onClick) {
        ctx.canvas.addEventListener("click", () => {
          child.onClick();
          setTimeout(() => {
            draw(child);
          }, 0);
        });
      }
    }
  },
  remove: (child) => {},
  createElement: (tag, isSVG, is) => {
    // 创建元素时由于需要创建dom 元素，只需要返回当前元素数据对象
    return { tag };
  },
  createText: (text) => {},
  createComment: (text) => {},
  setText: (node, text) => {},
  setElementText: (el, text) => {},
  parentNode: (node) => {},
  nextSibling: (node) => {},
  querySelector: (selector) => {},
  setScopeId(el, id) {},
  cloneNode(el) {},
  insertStaticContent(content, parent, anchor, isSVG) {},
  patchProp(el, key, prevValue, nextValue) {
    // 属性更新，此方法的执行时间在 insert 之前，属性更新好之后，在insert 中执行绘制
    el[key] = nextValue; //保存更新的值
  },
};
const renderer = createRenderer(nodeOps); //返回的是一个渲染器

// 绘制方法：el就是子元素
const draw = (el, noClear) => {
  if (!noClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (el.tag == "piechart") {
    let { data, r, x, y } = el;
    let total = data.reduce((memo, current) => memo + current.count, 0);
    let start = 0,
      end = 0;
    data.forEach((item) => {
      end += (item.count / total) * 360;
      drawPieChart(start, end, item.color, x, y, r);
      drawPieChartText(item.name, (start + end) / 2, x, y, r);
      start = end;
    });
  }
  el.childs && el.childs.forEach((child) => draw(child, true));
};

const d2a = (n) => {
  return (n * Math.PI) / 180;
};

const drawPieChart = (start, end, color, cx, cy, r) => {
  let x = cx + Math.cos(d2a(start)) * r;
  let y = cy + Math.sin(d2a(start)) * r;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.arc(cx, cy, r, d2a(start), d2a(end), false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
const drawPieChartText = (val, position, cx, cy, r) => {
  ctx.beginPath();
  let x = cx + (Math.cos(d2a(position)) * r) / 1.25 - 20;
  let y = cy + (Math.sin(d2a(position)) * r) / 1.25;
  ctx.fillStyle = "#000";
  ctx.font = "20px 微软雅黑";
  ctx.fillText(val, x, y);
  ctx.closePath();
};
let ctx, canvas;
// 扩展mount：首先创建一个画布元素
function createCanvasApp(App) {
  const app = renderer.createApp(App);
  const mount = app.mount; //保存原来的mount 方法
  // 覆盖
  app.mount = function (selector) {
    // 创建并插入画布
    canvas = document.createElement("canvas");
    // 设置画布基础属性
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // selector 是传进来的宿主
    document.querySelector(selector).appendChild(canvas);
    ctx = canvas.getContext("2d");
    //执行默认的 mount
    mount(canvas);
  };

  return app;
}

//createCanvasApp(CanvasApp).mount("#demo");
