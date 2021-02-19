import { Base64 } from "./base64"

export const tgwImgHandle = imgPath => {
  const BaseURL = "http://m.tgw360.com"
  const b64 = new Base64();
  if (imgPath == null || imgPath == "") {
    return "";
  }
  if (imgPath.indexOf("http://") >= 0 || imgPath.indexOf("https://") >= 0) {
    return imgPath;
  }
  return BaseURL + "/res/image/" + b64.encode(imgPath);
};

export const base64_encode = (str) => {
  if (str == undefined || str.trim() == "") {
    return "";
  }
  else {
    const b64 = new Base64();
    return b64.encode(str);
  }
}

export const base64_decode = (str) => {
  if (str == undefined || str.trim() == "") {
    return "";
  }
  else {
    const b64 = new Base64();
    return b64.decode(str);
  }
}



// 解析怪异时间戳
export const analysisStrangeTimeFormat = (str, mask) => {
  if (str == undefined) return "";
  var time = str.toString();
  return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
    switch ($0) {
      case 'dd':
        return time.slice(6, 8);
      case 'MM':
        return time.slice(4, 6);
      case 'yy':
        return time.slice(2, 4);
        ;
      case 'yyyy':
        return time.slice(0, 4);
      case 'HH':
        return time.slice(8, 10);
      case 'mm':
        return time.slice(10, 12);
      case 'ss':
        return time.slice(12, 14);
    }
  });
}

// 时间戳转换成怪异时间戳
export const getStrangeTimeFormat = (t) => {
  let _t = t ? new Date(t) : new Date()
  let supplyZero = n => n >= 10 ? n : '0' + n
  return `${_t.getFullYear()}${supplyZero(_t.getMonth() + 1)
    }${supplyZero(_t.getDate())
    }${supplyZero(_t.getHours())
    }${supplyZero(_t.getMinutes())
    }${supplyZero(_t.getSeconds())
    }`
}

export const formatDateTime = (str, type) => {
  if (!str) { return '' }
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hour = str.slice(8, 10);
  const minute = str.slice(10, 12);
  // const second = str.slice(12);
  // return year+'-'+month+'-'+day+"  "+hour+':'+minute;
  const timeMap = {
    yyr: year + '-' + month + '-' + day,
    yyrhm: year + '-' + month + '-' + day + "  " + hour + ':' + minute,
    yrhm: month + '-' + day + "  " + hour + ':' + minute
  }
  return timeMap[type];
}
