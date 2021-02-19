import Vue from 'vue';
import axios from '@/api/index';
import config from '@/plugins/config/index';
const api = config.api;
const tapi = config.tapi;

export default {
  // 根据工作室Id展示工作室相关信息 /live-service/live/liveRoomList/getRoomLiveByRid
  getSingleRoomLive ({
    commit
  }, {
    roomId,
    userId
  }) {
    return axios({
      method: 'get',
      url: `${tapi}/live-service/live/liveRoomList/getRoomLiveByRid`,
      params: {
        roomId,
        userId
      }
    })
  },
  // 根据用户状态获取直播间roomId /live-service/live/getByUid/{uid}
  reqLiveRoomId ({
    commit
  }, {
    userId
  }) {
    return axios({
      method: 'get',
      url: `${tapi}/live-service/live/getRoomIdByUid/${userId}`,
    })
  },
  // 获取直播间历史消息
  // http://tapi.tgw99.cn/live-service/doc.html#/default/live-room-controller/getLiveMessageListUsingPOST
  getLiveHistoryMsg ({
    commit
  }, {
    page, count, liveTopicId,
    publishTypeList, serviceId, userType, userId
  }) {
    const data = {
      beginIndex: (page - 1) * count,
      recordCount: count,
      liveTopicId,
      publishTypeList: publishTypeList.split(','),
      serviceId,
      userType,
      userId
    }
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/live-service/live/messageList/get`,
      data: data
    })
  },
  // 直播间发送消息
  // http://tapi.tgw99.cn/live-service/live/liveMessage/broadCast
  getSubmitLiveMsg ({
    commit
  }, {
    content,
    liveTopicId, // 直播间id
    messageType,
    publishType,//发布类型,1-直播，2-提问，3-回答，4-评论，5-打赏，6-聊天 ，7-分享 ,8-新的打赏, 9-老师答复,10-系统消息,11-专享服务,12=调仓,13=至尊粉权限消息,14=首次进入推消息
    serviceId, // 直播老师id
    userType, // 1用户，2老师，3游客，4系统，5助理
    sponsorUserId,// 发送人id
  }) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/live-service/live/liveMessage/broadCast`,
      data: {
        liveTopicId, content, messageType,
        publishType, serviceId, userType,
        sponsorUserId
      }
    })
  },
  // 获取直播公告/tgwapi/myapp/Notice/SelectConsultnotice
  getNotice ({
    commit
  }, {
    serviceId
  }) {
    return axios({
      method: 'get',
      url: `${tapi}/live-service/live/consult/getNoticeList`,
      params: {
        serviceId: Number(serviceId),
        noticetype: 1, //直播公告
        noticestate: 1,
        beginIndex: 0,
        recordCount: 1,
      }
    })
  },
  // 获取课程列表
  // http://tapi.tgw99.cn/consult-service/doc.html#/default/consult-lessons-controller/getLessonsListUsingGET
  getLessonsList ({
    commit
  }, params) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/getLessonsList`,
      params: params
    })
  },
  // 获取栏目配置
  getColumnList ({
    commit
  }, params) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/getColumnList`,
      params: params
    })
  },
  // 检测是否点赞
  getIsLike ({
    commit
  }, params) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/likes-service/likes/getLike`,
      data: params
    })
  },
  // 赞和取消赞
  likeOrCancel ({
    commit
  }, { kid, likeType, userId }) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/likes-service/likes/like`,
      data: {
        kid, likeType, userId
      }
    })
  },
  // 踩和取消踩
  unlikeOrCancel ({
    commit
  }, { kid, likeType, userId }) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/likes-service/likes/unLike`,
      data: {
        kid, likeType, userId
      }
    })
  },
  // 提交关注
  appraiseProduct ({
    commit
  }, { assessType, kid, likeType, userId }) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/likes-service/likes/assess`,
      data: {
        assessType, kid, likeType, userId
      }
    })
  },
  // 获取投顾老师执业证号 /live-service/live/cno
  getTeacherCNO ({
    commit
  }, {
    serviceId,
    userId
  }) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/live-service/live/cno`,
      data: {
        platform: 6, //1 淘股王 6 华讯股票
        serviceId,
        userId
      }
    })
  },
  //获取华讯股票栏目列表
  gethxColumnList ({
    commit
  }, params) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/hxColumnList`,
      params: params
    })
  },
  // 获取粉丝数和是否关注
  getFollowUserState ({
    commit
  }, params) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/live-service/live/followUser/getFollowUserState`,
      data: params
    })
  },
  // 提交关注
  followUserhandle ({
    commit
  }, params) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/live-service/live/followUser/handle`,
      data: params
    })
  },
  // 获取观点、锦囊列表数据
  getViewKits ({
    commit
  }, params) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/getViewKits`,
      params: params
    })
  },
   // 获取自选股列表 /consult-service/consult/getSelfStockList
   getSelfStockListOnlyStock({
    commit
  }, {
    userId
  }) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/getSelfStockList`,
      params: {
        isIncludePlate: 0,
        userId
      }
    })
  },
  // 获取news列表
  getNewsListsResDate({
    commit
  }, {newsType, page = 1, count = 15, newsStocks, columnID, fromTime, toTime, from}) {
    let data = {
      beginindex: (page - 1) * count,
      recordcount: count, newsType,
      fromTime, toTime, from
    }
    if (newsType == 1) {
      data.columnID = newsStocks ? newsStocks.length ? undefined : columnID : undefined
    }
    data = data;
    if (newsStocks) {
      let strStock = []
      newsStocks.forEach(e => {
        strStock.push(e)
      })
      data.newsStocks = strStock
    }
    return axios({
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      url: `${tapi}/service-news/news/findByCondition`,
      data
    })
  },
  // 获取news详情
  getArticleResDetail({
    commit
  }, {newsid}) {
    return axios({
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      url: `${tapi}/service-news/news/findAllById`,
      data: [newsid]
    })
  },
  // 获取推荐文章
  getRecommenderNews({
    commit
  }, {page = 1, count = 20, userId, hotNum}) {
    let data = {
      "app": 6, //1淘股王 6华讯股票
      "appVersion": "string",
      "backVersion": 0,
      "fields": [],
      "from": 0,
      "hotNum": hotNum,
      "itemSetBias": 0,
      "num": count,
      "openLive": false,
      "openVP": false,
      "platform": 2,
      "user": userId
    }
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/recommender/news`,
      data: data
    })
  },
  // 推荐文章获取历史
  getRecommenderHistoryNews({
    commit
  }, {newsId, userId}) {
    let data = {
      "app": 6,
      "appVersion": "string",
      "backVersion": 0,
      "fields": [],
      "from": 0,
      "itemSetBias": 0,
      "num": 15,
      "openLive": false,
      "openVP": false,
      "platform": 2,
      "user": userId,
      "newsId": newsId
    }
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      method: 'post',
      url: `${tapi}/recommender/history`,
      data: data
    })
  },
  // 获取板块相关股票
  getAllBlockStockList({
    commit
  }, {
    blockindex
  }) {
    return axios({
      method: 'get',
      url: `${tapi}/plate-service-v3/block/allBlockStockList`,
      params: {
        blockindex:blockindex
      }
    })
  },
  //获取名师专栏右侧 10条最热门观点
  postTop10Views ({
    commit
  }, data) {
    return axios({
      headers: {
        "Content-Type": "application/json"
      },
      url: `${tapi}/consult-service/consult/topView`,///consult-service/consult/topView
      data: data
    })
  },
  //获取单个热门观点详情
  ///consult-service/consult/getIvestmentsAndViews
  getTopDetail ({
    commit
  }, params) {
    return axios({
      method: 'get',
      url: `${tapi}/consult-service/consult/getIvestmentsAndViews`,
      params: params
    })
  },
}
