// 时间戳转换成怪异时间戳
export const getStrangeTimeFormat = (t) => {
  let _t = t ? new Date(t) : new Date()
  let supplyZero = n => n >= 10 ? n : '0' + n
  return `${_t.getFullYear()}${
    supplyZero(_t.getMonth() + 1)
  }${
    supplyZero(_t.getDate())
  }${
    supplyZero(_t.getHours())
  }${
    supplyZero(_t.getMinutes())
  }${
    supplyZero(_t.getSeconds())
  }`
}
// 光标处插入内容

export const insertAtCursor = (myField, myValue) => {
  if (document.selection) {
    //IE support
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
    sel.select();
  } else if (myField.selectionStart || myField.selectionStart == "0") {
    //MOZILLA/NETSCAPE support
    let startPos = myField.selectionStart;
    let endPos = myField.selectionEnd;
    let beforeValue = myField.value.substring(0, startPos);
    let afterValue = myField.value.substring(
      endPos,
      myField.value.length
    );

    myField.value = beforeValue + myValue + afterValue;

    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
    myField.focus();
  } else {
    myField.value += myValue;
    myField.focus();
  }

}

// 获取cookie的值
export const getCookie = (cookie = '', name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
