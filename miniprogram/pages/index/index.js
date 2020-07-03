//index.js
const app = getApp()
const createRecycleContext = require('miniprogram-recycle-view')
var ctx
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    openId: '',
    logged: false,
    takeSession: false,
    batchSetRecycleData:true,
    requestResult: '',
    lists:[],
    page:0,
    size:10,
    percent:0,
    ctx:null
  },
  loading:false,
  onLoad: function() {
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
    ctx.drawImage('cloud://wakeup-4d5136.7761-wakeup-4d5136-1253625034/1589075195000.jpg', 0, 0, 100, 100)
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
  console.log('qqqqq',this.data.page)
  const db = wx.cloud.database()
  const that = this
  // 查询当前用户所有的 counters
  wx.showLoading({
    title: '加载中',
  })
  this.loading = true
  db.collection('lists')
  .orderBy('date', 'desc')
  .skip(that.data.page*that.data.size) 
  .limit(that.data.size).
  get({
    success: res => {
      let _lists = this.data.lists
      
      _lists = _lists.concat(res.data)
      let downloadPromise = []
      _lists.forEach((item,mainIndex)=>{
        if(item.imgs.length > 0){
          const download = new Promise((resolve, reject) => {
            wx.cloud.getTempFileURL({
              fileList: item.imgs, // 文件 ID
              success: res => {
                // 返回临时文件路径
                console.log(res.fileList)
                res.fileList = res.fileList.map(file=>{
                  return {
                    ...file,
                    tempFileURL:file.tempFileURL + '?imageMogr2/quality/6'
                  }
                })
                resolve({mainIndex,imgs:res.fileList});
              },
              fail: error=>{
                console.log('error',error)
                resolve(null)
              }
            })
          });
          console.log('download',download)
          downloadPromise.push(download)
        }
      })
      console.log('downloadPromise',downloadPromise)
    

   
      console.log('downloadPromise',downloadPromise)
      Promise.all(downloadPromise).then(res=>{
        console.log('=======res========',res)
        res.forEach(element => {
          if(element){
            const {mainIndex,imgs} = element
            _lists[mainIndex].imgs = imgs
          }
        });
        console.log('_lists',_lists)

        this.setData({
          lists: _lists
        })
        wx.hideLoading()
        this.loading =false
      })
     
      console.log('[数据库] [查询记录] 成功:111 ', res)

      ctx.append(res.data,()=>{
        console.log('---------------------',)
      })
      console.log('[数据库] [查询记录] 成功: ', res)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
},
onCount:function(){
  const db = wx.cloud.database()
  const that = this
  db.collection('lists').count({
    success(res) {
      console.log(res.total)
      that.setData({
        percent: res.total/100
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
    // 扁平化当前所有imgs
    let imgs = []
    that.data.lists.forEach(list => {
      imgs = imgs.concat(list.imgs.map(item=>{return item.fileID}))
    });
    wx.previewImage({
      current: e.target.dataset.img, 
      urls: imgs
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
