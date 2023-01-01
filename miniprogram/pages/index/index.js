//index.js
const app = getApp()
const createRecycleContext = require('miniprogram-recycle-view')
const { mpServerless } = getApp();
var ctx
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    openId: '',
    listId:'',
    listIndex:0,
    submitIng:false,
    logged: false,
    takeSession: false,
    batchSetRecycleData:true,
    requestResult: '',
    commentShow:false,
    lists:[],
    page:0,
    size:10,
    percent:0,
    ctx:null,
    commentValue:''
  },
  loading:false,
  onLoad: async function() {
    console.log('mpServerless',mpServerless)
    ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize:{
        width: 400,
        height: 500,
      }
    })
    let that = this
   

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.setData({
            logged:true
          })
          wx.getUserInfo({
            success: res => {
              console.log('res',res)
              // that.onGetUserInfo()
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              // 先查找判断couples是否存在用户信息
             this.setUserInfoDb(res.userInfo.avatarUrl,res.userInfo)
            }
          })
        }
      }
    })
    var ctx = wx.createCanvasContext('canvas')
   
    ctx.draw(false, setTimeout(function(){
         wx.canvasToTempFilePath({
             canvasId: 'canvas',
             destWidth: 100,
             destHeight: 100,
             success: function (resImg) {
                 console.log(resImg.tempFilePath)//最终图片路径
             },
             fail: function (resImg) {
                 console.log(resImg.errMsg)
            }
        })
    },100))
    this.onGetOpenid()

    wx.showShareMenu({
      withShareTicket: true
    })
    this.onQuery()
    this.onCount()
  },
  itemSizeFunc: function (item, idx) {
    let height = ctx.transformRpx(item.videos.length*400) + (item.imgs.length === 1  ?ctx.transformRpx(360): ctx.transformRpx(Math.ceil(item.imgs.length/3) *200) )+ ctx.transformRpx(136);
    return {
        width: ctx.transformRpx(375),
        height: height
    }
},
// 获取accesstoken
//  查询数据库
onQuery: function() {
  const db = wx.cloud.database()
  const that = this
  // 查询当前用户所有的 counters
  wx.showLoading({
    title: '加载中',
  })
  this.loading = true
  

  mpServerless.db.collection('lists').find({},{skip:that.data.page*that.data.size,limit:that.data.size,sort:{date:-1}}).then((res)=>{
    console.log('aliyunlist',res)
    let _lists = this.data.lists
    let aliyunList = (res.result || []).map(item=>{
      return {
        ...item,
        imgs:item.imgs.map(imgItem=>`${imgItem}?x-oss-process=image/quality,q_10`)
      }
    })
    _lists = _lists.concat(aliyunList)
    this.setData({
      lists: _lists
    })
    wx.hideLoading()
    this.loading =false
  })
  
},
onCount:function(){
  const db = wx.cloud.database()
  const that = this
  mpServerless.db.collection('lists').find().then(res=>{
    console.log('total',res)
    if(res){
      that.setData({
        percent: res.result.length/100
      })
    }
  })
},

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setUserInfoDb(e.detail.userInfo.avatarUrl,e.detail.userInfo)
    }
  },
  setUserInfoDb: function (avatarUrl,userInfo) {
    const that = this
    if(this.data.openId){
      that.addCouples(this.data.openId,avatarUrl,userInfo)
    }else{
      that.onGetOpenid((openId)=>{
        that.addCouples(openId,avatarUrl,userInfo)
      })
    }
   
  },
  addCouples:function(openId,avatarUrl,userInfo){
    const db = wx.cloud.database()
    db.collection('couples').where({
      openId
    }).get({
      success:res=>{
        if(res.data && res.data.length <= 0){
          db.collection('couples').add({
            data: {
              openId,
              avatar:avatarUrl,
              nickName:userInfo.nickName,
              userInfo
            },
          })
        }
      }
    })
  },
  onGetOpenid: function(cb) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openId = res.result.openid
        this.setData({
          openId:res.result.openid
        })
        typeof cb === 'function' && cb(res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  addList:function(){
    wx.navigateTo({
      url: '/pages/addList/addList'
    })
  },  
  
  previewImg:function(e){
    const that = this
    // 扁平化当前所有imgs,并去掉压缩
    let imgs = []
    that.data.lists.forEach(list => {
      imgs = imgs.concat(list.imgs.map(item=>{return item.split('?')[0]}))
    });
    wx.previewImage({
      current: e.target.dataset.img.split('?')[0], 
      urls: imgs
    })
  },
  handleShowComment(e){
    console.log('e',e)
    this.setData({
      commentShow: true,
      listId: e.target.dataset.id,
      listIndex: e.target.dataset.index
    })
  },
  handleCloseComment(){
    this.setData({
      commentShow: false
    })
  },
  handleToComment:async function (){
    const db = wx.cloud.database()
    console.log('userInfo',this.data.userInfo)
    this.setData({
      submitIng:true
    })
    try {
    const result = await db.collection('lists').where({
      _id: this.data.listId
    }).get()
    if(result && result.data && result.data.length > 0){
      let commentList = result.data[0].comments || []
      commentList.push({
        openId:this.data.openId,
        ...this.data.userInfo,
        text:this.data.commentValue
      })
      db.collection('lists').where({
        _id: this.data.listId
      })
      .update({
        data: {
          comments: commentList
        },
      }).then(res=>{
        // wx.showToast({
        //   title: '评论成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        // fire and run
        const _list = this.data.lists
        console.log('_list',_list)
        if(!_list[this.data.listIndex].comments){
          _list[this.data.listIndex].comments = []
        }
        _list[this.data.listIndex].comments.push({
          openId:this.data.openId,
          ...this.data.userInfo,
          text:this.data.commentValue
        })
        this.setData({
          lists: _list,
          commentValue:'',
          submitIng:false
        })
      })
    }
    }catch(e) {
      console.error(e)
    }
  },
  bindKeyInput(e){
    this.setData({
      commentValue: e.detail.value
    })
  },
  onReachBottom(){
    if(this.loading) return false
    this.setData({
      page:this.data.page + 1
    })
    this.onQuery()
  },
  handleScrollToLower(){
    // this.setData({
    //   page:this.data.page + 1
    // })
    // this.onQuery()
  }
 
})
