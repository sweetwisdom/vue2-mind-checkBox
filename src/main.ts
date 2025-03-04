import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 
import mindCheckbox from 'mind-checkbox/dist/mindCheckbox.umd.min.js';
import 'mind-checkbox/dist/mindCheckbox.css';
// ts ignore
// @ts-ignore
Vue.use(mindCheckbox);
Vue.config.productionTip = false;

import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
Vue.use(Element, { size: 'small', zIndex: 3000 });
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
