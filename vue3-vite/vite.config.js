// 配置白名单

module.exports = {
  vueCompilerOptions: {
    isCustomElement: (tag) => tag === "piechart", //报的解析失败的提示被忽略掉了
  },
};
