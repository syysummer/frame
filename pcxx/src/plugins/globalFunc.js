import Vue from "vue";
import config from '../plugins/config/index';
let globalFunc = {
  isTGWBrowser: () => {
    const isHummer = navigator.userAgent.match(/hummer/i);
    if(isHummer){
      return true
    }else{
      return false
    }
  },
  openwebview: (url)=> {
    //js命令： open.web (open.webview) 两个命令都可以 	参数：url title	popuptype	 
    const isHummer = navigator.userAgent.match(/hummer/i);
    var tgwR = /^http:\/\/|^https:\/\//g;
    var preUrl = url.match(tgwR) ? '' : config.webBaseUrl;
    if(isHummer){
      upNativeComm.exec('open.web', { url: `${preUrl}${url}` , title:'' , popuptype:0});
    }else{
      window.location.href = `${preUrl}${url}`;
    }
  },
  login: ({ userID, pwd, loginType = '0'}) => {
    upNativeComm.exec('open.loginframe', {userID, pwd, loginType});
  },
  openSingleStock({code,setcode='1',type='个股'}){ //打开个股图
    //js命令：web_user_login 参数： setcode:0深圳,1上海  code	type：f10 打开f10 ,其他值则打开个股 ， 	可选参数 ldtype（指定联动方式） ：geguld 指定副屏联动，其他则在主屏打开个股
		upNativeComm.exec('open.stock', {setcode, code, type});
  },
  popupWeb:({url, title})=>{
    var tgwR = /^http:\/\/|^https:\/\//g;
    var preUrl = url.match(tgwR) ? '' : config.webBaseUrl;
    //js命令： popup.webwnd 参数：url title	         可选参数 type	 
    upNativeComm.exec('popup.webwnd', {url: `${preUrl}${url}` , title:title , type:0});
  },
  autoLogin:({userID, pwd})=>{
    // 注册成功点击立即登录
    upNativeComm.exec('web_user_login', {userID:userID, pwd:pwd , loginType:"auto"});
  },
  closeWindow:() => {
    // 关闭window
    upNativeComm.exec('close.thiswindow');
  },
  goTo:(cmd)=>{
    //js命令： cmd_goto 参数：func_guid	 该参数需要客户端提供具体数值        
    upNativeComm.exec('cmd_goto', {func_guid:cmd});
  }
}
globalFunc.install = function (Vue, options) {
  Vue.prototype.isTGWBrowser = globalFunc.isTGWBrowser;
  Vue.prototype.$openwebview = globalFunc.openwebview;
  Vue.prototype.$login = globalFunc.login;
  Vue.prototype.$openSingleStock = globalFunc.openSingleStock;
  Vue.prototype.$popupWeb = globalFunc.popupWeb;
  Vue.prototype.$autoLogin = globalFunc.autoLogin;
  Vue.prototype.$closeWindow = globalFunc.closeWindow;
  Vue.prototype.$goTo = globalFunc.goTo;
}
Vue.use(globalFunc)