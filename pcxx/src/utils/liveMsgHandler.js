import initTime from '@/utils/initTime';
const Base64 = () => {
  // private property
  let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // public method for encoding
  const encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding
  const decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding
  const _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  // private method for UTF-8 decoding
  const _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
  return {
    encode,
    decode
  }
}
const checkToday = (str, mask) => {
  var today = initTime().format('M-D')
  if (getTimeFormat(str, 'MM-dd') === today) {
    return getTimeFormat(str, mask)
  } else {
    return getTimeFormat(str, 'MM-dd ' + mask)
  }
}
const getTimeFormat = (str, mask) => {
  var time = str.toString();
  return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
    switch ($0) {
      case 'dd':
        return time.slice(6, 8);
      case 'MM':
        return time.slice(4, 6);
      case 'yy':
        return time.slice(2, 4);
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
const handleTextContent = contentStr => {
      // 展示股票并过滤广告相关信息
      // 股票格式： [tgw://new_stock?market=65537&code=600624]$复旦复华(600624)$[/tgw]
      // 广告格式： [tgw://web?url=http://www.baidu.com]$百度新闻$[/tgw]
      var tgwR = /\[tgw[\s\S]{0,}?\[\/tgw\]/;
      function handleMutiLink(stockMsg, contentStr){
        var stockStr = stockMsg && stockMsg.match(/\][\s\S]{0,}\[\//g) && stockMsg.match(/\][\s\S]{0,}\[\//g)[0];
            stockStr = stockStr && stockStr && stockStr.replace(/\]/g, '');
            stockStr = stockStr && stockStr && stockStr.replace(/\[\//g, '');
        var stockText = stockStr;
        if(stockMsg && stockMsg.match(/^\[tgw:\/\/new_stock\?/g)){
          var stockPre = stockMsg.split(stockStr)[0];
          var stockSrcList = stockPre.split('&');
          var secucode = stockSrcList[1] && stockSrcList[1].split('=')[1];
          var market = stockSrcList[0] && stockSrcList[0].split('=')[1];
          contentStr = contentStr && contentStr.replace(stockMsg, '<a href="javascript:;" data-market="'+market+'" data-code="'+secucode+'" class="goStockDetail" style="cursor: pointer;text-decoration:none;color:#398FFF;">'+stockText+'</a>');
        }else if(stockMsg && stockMsg.match(/^\[tgw:\/\/stock\?/g)){
          var stockPre = stockMsg.split(stockStr)[0];
          var stockSrcList = stockPre.split('&');
          var secucode = stockSrcList[1] && stockSrcList[1].split('=')[1];
          var market = stockSrcList[0] && stockSrcList[0].split('=')[1];
          contentStr = contentStr && contentStr.replace(stockMsg, '<a href="javascript:;" data-market="'+market+'" data-code="'+secucode+'" class="goStockDetail" style="cursor: pointer;text-decoration:none;color:#fff;">'+stockText+'</a>');
        }else if(stockMsg && stockMsg.match(/^\[tgw:\/\/web\?/g)){
          var hrefPre = stockMsg.split(']')[0];
          var hrefSrc = hrefPre.split('web?url=')[1];
          var innerHref = hrefSrc.match(/^HXGP{1}/g);
          console.log(hrefPre,hrefSrc,stockText,"跳转链接")
          if(innerHref){
            hrefSrc = hrefSrc.slice(5);
            contentStr = contentStr && contentStr.replace(stockMsg, '<a href="javascript:;" dataHref="'+hrefSrc+'" class="goClientLink" style="color:#398FFF;">'+stockText+', 点击了解详情>></a>');
          }else if(hrefSrc.match(/^http{1}/g)){
            contentStr = contentStr && contentStr.replace(stockMsg, '<a href="javascript:;" class="goLinkDetail" dataHref="'+hrefSrc+'" style="color:#398FFF;cursot:pointer;">'+stockText+', 点击了解详情>></a>');
          }else{
            contentStr = contentStr && contentStr.replace(stockMsg, '<div dataHref="'+hrefSrc+'" style="color:#FFF;cursot:pointer;">'+stockText+'</div>');
          }
        }else{
          contentStr = contentStr && contentStr.replace(stockMsg, '');
        }
        stockMsg = contentStr && contentStr.match(tgwR) && contentStr.match(tgwR)[0];
        return {
          stockMsg,
          contentStr
        }
      }
      var stockMsg = contentStr && contentStr.match(tgwR) && contentStr.match(tgwR)[0];
      while (stockMsg) {
        var current = handleMutiLink(stockMsg,contentStr);
        contentStr = current.contentStr;
        stockMsg = current.stockMsg
      }
      return contentStr;
}
const handlereplyContent = (msg, contentMsg) => {
  let nowContent = JSON.parse(msg.replayContent).now.Content;
  let nowMsgType = JSON.parse(msg.replayContent).now.MsgType;
  let nikName = JSON.parse(msg.replayContent).replay.NikName;
  let replayContent = JSON.parse(msg.replayContent).replay.ReplayContent;
  let replay = JSON.parse(msg.replayContent).replay;
  let replayMsgType = replay.ReplayMsgType;
  let ReplayPublishType = replay.ReplayPublishType;
  if(ReplayPublishType == 7){
    let type = JSON.parse(replayContent).type;
    let contentMsgHtml = '';
    if(type == 1){
      const labelMap = {
        "1": "观点",
      }
      const content = JSON.parse(replayContent);
      contentMsgHtml = `<div class="live-content-msg goViewDetail" data-view="${'/view/'+content["viewId"]}">
        <img class="label-img" src="${content["imagePath"]}" alt=""/>
        <div class="live-content">
          <div class="msg-title">${content["title"]}</div>
          <div class="label-like">
            <span>${labelMap[content["type"]]}</span>
            <span>${content["likeCount"]}人观看</span>
          </div>
        </div>
      </div>`
    }else if(type == 17){
      contentMsgHtml = `<div class="quick-news"><p style="font-weight: bold;">【快讯】<span class="news-content">${JSON.parse(replayContent)["title"]}<span></p><p style="margin-top:4px;">${JSON.parse(replayContent)["titlesub"] ? JSON.parse(replayContent)["titlesub"] : ''}</p></div>`
    }
    contentMsg = `<div>
    <div class="now" style="">${getMsgContent(parseInt(nowMsgType), nowContent)}</div>
    <div class="line" style="width: 100%;height:1px; background:#141A1F; margin:5px 0;"></div>
    <div class="replay" style="color:#A9AEB8;">@${nikName}: ${contentMsgHtml}</div>
  </div>`
  }else{
    contentMsg = `<div>
    <div class="now" style="">${getMsgContent(parseInt(nowMsgType), nowContent)}</div>
    <div class="line" style="width: 100%;height:1px; background:#141A1F; margin:5px 0;"></div>
    <div class="replay" style="color:#A9AEB8;">@${nikName}: ${getMsgContent(parseInt(replayMsgType), replayContent)}</div>
  </div>`
  }
  return contentMsg;
}
const getMsgContent = (type, content) => {
  content = content ? content : ''
  var contentStr = '';
  switch (type) {
    case 1://文字
      var r = /\[face[1-9][0-9]?\]/g;
      contentStr = content;
      contentStr.replace(r, function (a) {
        var num = a.replace("[face", "").replace("]", "");
        if (parseInt(num) > 75) {
          return;
        }
        var face = a.replace("[", "").replace("]", "");
        contentStr = contentStr.replace(a, "<img src=\"/img/face/" + face + "\.png\" style=\"width:22px;height: 22px; vertical-align: top;\" />");
      });
      // contentStr += '[tgw://web?url=http://www.baidu.com]百度新闻[/tgw][tgw://web?url=HXGP://Web_Function?url=http://web.tgw360.com/nuggets/ai/1392&opentype=1]AI金手指[/tgw]';
      contentStr = handleTextContent(contentStr);
      break;
    case 2://图片
      var contentDao = JSON.parse(content);
      var imgListStr = '<div class="imgWrap">';
      for (var i = 0; i < contentDao['image'].length; i++) {
        imgListStr += '<img  src="' + ImgHandle(contentDao['image'][i].path) + '" />'
      }
      imgListStr += '</div>';
      contentStr = imgListStr;
      break;
    case 3://语音
      var contentDao = JSON.parse(content);
      contentStr = '<a target="_blank" href="https://www.tgw360.com/res/download">语音消息，点击下载</a>';
      break;
    case 4://动画
      break;
    default:
      break;
  }
  return contentStr;
}
const ImgHandle = imgPath => {
  const BaseURL = "http://m.tgw360.com"
  const b64 = new Base64();
  if (imgPath == null || imgPath == "") {
    return "https://m.tgw360.com/img/face_default.png";
  }
  if (imgPath.indexOf("http://") >= 0 || imgPath.indexOf("https://") >= 0) {
    return imgPath;
  }
  return BaseURL + "/res/image/" + b64.encode(imgPath);
};

const handleLable = userType => {
  // 用户类型,1.用户 2.老师,3.游客,4.系统,5.助理,6=马甲主持人,7=马甲助理,8=马甲嘉宾,9=股神精灵
  switch (userType){
    case 2: 
      return '<span class="user-label">播主</span>'
    case 6:
      return '<span style="display:inline-block;color:#FFF;background:#E38900;height:16px;line-height:14px;font-size:12px;padding: 0 3px;margin-right:10px;">主持人</span>'
    case 7:
      return '<span style="display:inline-block;color:#FFF;background:#E38900;height:16px;line-height:14px;padding:0 3px;font-size:12px;margin-right:10px;">助理</span>'
    case 8:
      return '<span style="display:inline-block;color:#FFF;background:#E38900;height:16px;line-height:14px;padding:0 3px;font-size:12px;margin-right:10px;">嘉宾</span>'  
  }
  return ''
}

const msgHandle = function ({ServiceID, msg, selfName, selfAvatar}, userId, needRight) {
  msg = {
    headAddress: msg.headAddress ? msg.headAddress : msg.PublisherHeadAddress ? msg.PublisherHeadAddress : selfAvatar ? selfAvatar : "https://m.tgw360.com/img/face_default.png",
    publishId: msg.publishId ? msg.publishId : msg.PublisherID,
    publishType: msg.publishType ? msg.publishType : msg.PublishType,
    messageTime: msg.messageTime ? msg.messageTime : msg.SendTime,
    nickName: msg.nickName ? msg.nickName : msg.PublisherName ? msg.PublisherName : selfName,
    messageType: msg.messageType ? msg.messageType : msg.MessageType,
    content: msg.content ? msg.content : msg.Content,
    isNewReply: msg.isNewReply ? msg.isNewReply : msg.isNewReply,
    isReply: msg.isReply ? msg.isReply : msg.isReply,
    replayContent: msg.replayContent ? msg.replayContent : {},
    userType: msg.userType ? msg.userType : msg.userType,
    publishLabel: msg.publishLabel ? msg.publishLabel :'',
  }
  var wrapClassName = userId == msg.publishId ? 'self_wrap' : "user_wrap";
  var publishLabel = msg.publishLabel;
  var className = userId == msg.publishId ? 'self' : "user";
  var contentClassName = 'user-content'
  if (ServiceID == msg.publishId || msg["userType"] == 5 || msg["userType"] == 2) {
    wrapClassName = "teacher-wrap";
    className = "teacher";
    contentClassName = 'teacher-content';
  }
  var contentHtml = "";
  if (msg.publishType == 1) {
    let contentMsg = ''; //判断是否是回复的消息
    if(msg.isNewReply == 1 && msg.replayContent.length){
      contentMsg = handlereplyContent(msg, contentMsg);
    }else{
      contentMsg= `${getMsgContent(parseInt(msg.messageType), msg.content)}`
    }
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
        <div class="message-box ${contentClassName}" ><span style="color:#FFBF3C;">${publishLabel ? '【'+ publishLabel+'】' :''}</span> ${contentMsg}</div>
      </div>`
    return contentHtml;
  } else if (msg.publishType == 5) { 
    var content = JSON.parse(msg.content);
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          <span class="nickname ${className}">${msg.nickName}</span>
          ${msg.userType == 2 ? '<span class="user-label">播主</span>' : ''}
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
        <div class="message-box ${contentClassName} ">打赏了主播<span class="color-red">¥ ${(parseFloat(content.Amount)).toFixed(2)} </span>
          <img class="hongbao" src="../img/livePC/hongbao1.png" alt="">
        </div>
      </div>`
    return contentHtml;
  } else if (msg.publishType == 6) {
    let contentMsg = '';
    if(msg.isNewReply == 1 && msg.replayContent.length){
      contentMsg = handlereplyContent(msg, contentMsg);
    }else{
      contentMsg= `${getMsgContent(parseInt(msg.messageType), msg.content)}`
    }
    if (className === 'self' && needRight) {
      contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
        </div>
        <div class="self_content">
          <div class="message-box ${contentClassName} ">${contentMsg}</div>
        </div>
      </div>
      `
    } else {
      contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}'/ onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';">
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
        <div class="message-box ${contentClassName}" ><span style="color:#FFBF3C;">${publishLabel ? '【'+ publishLabel+'】' :''}</span> ${contentMsg}</div>
      </div>`
    }
    return contentHtml;
  } else if (msg.publishType == 7) {
    var content = JSON.parse(msg.content);
    var productId = content.productId; //锦囊 大赛视频 课程
    var viewId = content.viewId; //观点 大赛动态
    var contentMsgHtml = '';
    if(content["type"] == 1){ //观点
      const labelMap = {
        "1": "观点",
      }
      contentMsgHtml = `<div class="live-content-msg goViewDetail" data-view="${'/view/'+viewId}">
        <img class="label-img" src="${content["imagePath"]}" alt=""/>
        <div class="live-content">
          <div class="msg-title">${content["title"]}</div>
          <div class="label-like">
            <span>${labelMap[content["type"]]}</span>
            <span>${content["likeCount"]}人观看</span>
          </div>
        </div>
      </div>`
    }else if(content["type"] == 17){ //快讯
      contentMsgHtml = `<div class="quick-news"><p style="font-weight: bold;">【快讯】<span class="news-content">${content["title"]}<span></p><p style="margin-top:4px;">${content["titlesub"] ? content["titlesub"] : ''}</p></div>`
    }else{ // 不处理分享
      return ''
    }
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
        <div class="message-box ${contentClassName}">${contentMsgHtml}</div>
      </div>`
    return contentHtml;
  } else if (msg.publishType == 8) {
    var content = JSON.parse(msg.content);
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        <div>
        <div class="message-box ${contentClassName} ">打赏了主播<img style="width:30px" src="${content.giftPath}" alt=""><span style="color:red">X ${content.giftCount} </span></div>
      </div>`
    return contentHtml;
  }else if (msg.publishType == 15) {
    let contentMsg = ''; //判断是否是回复的消息
    if(msg.isNewReply == 1 && msg.replayContent.length){
      contentMsg = handlereplyContent(msg, contentMsg);
    }else{
      contentMsg= `${getMsgContent(parseInt(msg.messageType), msg.content)}`
    }
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
        <div class="message-box ${contentClassName}" ><span style="color:#FFBF3C;">${publishLabel ? '【'+ publishLabel+'】' :''} </span> ${contentMsg}</div>
      </div>`
    return contentHtml;
  } else if (msg.publishType == 16){
    contentHtml += `
    <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
    <div class="user-info ${wrapClassName}">
      <div class="header-wrap">
        ${handleLable(msg.userType)}
        <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
        <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
      </div>
      <div class="message-box ${contentClassName}"><span style="color:#FFBF3C;">${publishLabel ? '【'+ publishLabel+'】' :''} </span> ${getMsgContent(parseInt(msg.messageType), msg.content)}</div>
    </div>`
    return contentHtml;
  }
  if (msg.publishType == 11 || msg.publishType == 12 || msg.publishType == 13) {
    contentHtml += `
      <img class="avatar" src='${ImgHandle(msg.headAddress)}' onerror="javascript:this.src='https://m.tgw360.com/img/face_default.png';"/>
      <div class="user-info ${wrapClassName}">
        <div class="header-wrap">
          ${handleLable(msg.userType)}
          <span class="nickname ${className}">${msg.nickName ? msg.nickName : ''}</span>
          <span class="watched">${checkToday(msg.messageTime, 'HH:mm')}</span>
        </div>
      </div>
      <div class="shareHref message-box" sharetype="0"><a href='https://www.tgw360.com/res/download'>【至尊粉专享内容，请下载哈哈哈APP查看】 </a></div>`
    return contentHtml;
  }
  return "";
};

export default msgHandle
