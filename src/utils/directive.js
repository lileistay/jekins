
import { startDrag } from './drageable'
const lilei = (el, binding) => {
    startDrag(el.querySelector('.el-dialog__header'), el.querySelector('.el-dialog'), binding.value);
};
 
const directives = {
    lilei,
};
export default {
  install(Vue) {
      Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};