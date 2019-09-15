//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    openid: '',
    logged: false,
    takeSession: false,
    requestResult: '',
    lists:[],
    page:0,
    size:10,
    percent:0
  },

  onLoad: function() {
    let that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

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
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    this.onGetOpenid()

    wx.showShareMenu({
      withShareTicket: true
    })
    this.onQuery()
    this.onCount()
  },
//  查询数据库
onQuery: function() {
  const db = wx.cloud.database()
  const that = this
  // 查询当前用户所有的 counters
  db.collection('lists')
  .orderBy('date', 'desc')
  .skip(that.data.page*that.data.size) 
  .limit(that.data.size).
  get({
    success: res => {
      let _lists = this.data.lists
      _lists = _lists.concat(res.data)
      this.setData({
        lists: _lists
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
  db.collection('lists').count({
    success(res) {
      console.log(res.total)
      this.setData({
        percent:res.total/100
      })
    }
  })
},

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid:res.result.openid
        })
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
    console.log('that',e.target.dataset.img)
    wx.previewImage({
      current: e.target.dataset.img, 
      urls: [e.target.dataset.img] 
    })
  },
  onReachBottom(){
    console.log('g',)
    this.setData({
      page:this.data.page + 1
    })
    this.onQuery()
  }
 
})
