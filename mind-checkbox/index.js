// vue 组件注册

import mindCheckbox from './src/componment/svgChart.vue';
import Contextmenu from "vue-contextmenujs"
const install = function (Vue) {
  if (install.installed) return;
  Vue.use(Contextmenu);
  Vue.component('mindCheckbox', mindCheckbox);
};

export default {
  install,
};
