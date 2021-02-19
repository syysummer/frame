import Chimee from "chimee";
import flv from "chimee-kernel-flv";
import Vue from 'vue'

const _Chimee = {
  play: (config) => {
    const chimee = new Chimee({
      kernels: {
        flv
      }, ...config
    });
    chimee.play();
  }
}

_Chimee.install = function (Vue, options) {
  Vue.prototype.$Chimee = _Chimee
}
Vue.use(_Chimee)