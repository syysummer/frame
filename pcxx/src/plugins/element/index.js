// 导入自己需要的组件
import {Button,Input,Message} from 'element-ui';

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DonMessage {
  success (options, single = true) {
    this[showMessage]('success', options, single)
  }
  warning (options, single = true) {
    this[showMessage]('warning', options, single)
  }
  info (options, single = true) {
    this[showMessage]('info', options, single)
  }
  error (options, single = true) {
    this[showMessage]('error', options, single)
  }

  [showMessage] (type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type]({...options, duration: 1500})
      }
    } else {
      Message[type]({...options, duration: 1500})
    }
  }
}

const element = {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Input)
    // 解决首次进入自动弹出的问题
    Vue.component(Message.name, Message)
    Vue.prototype.$message = new DonMessage()
  }
}
// message重复展示时可以通过一下代码关闭之前的message,只展示最后的;
// this.$message.closeAll();
export default element;