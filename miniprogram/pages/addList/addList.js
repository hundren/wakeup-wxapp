
Page({
  data: {
    log:'',
    date: '',
    imgs:[],
    videos:[]
  },

  onLoad: function (options) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }

    this.setData({
      date: [year, month, day].map(formatNumber).join('-')
    })
  },
 

  bindLogChange:function(e){
    console.log('e',e)
    this.setData({
      log:e.detail.value
    })
  },
  bindDateChange:function(e){
    console.log('e',e)
    this.setData({
      date:e.detail.value
    })
  },
  // 上传图片
  doUpload: function () {
    const that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const filePath = res.tempFilePaths[0]
        that.uploadFile(filePath,(fileRes)=>{
          let imgs = JSON.parse(JSON.stringify(that.data.imgs))
          imgs.push(fileRes.fileID)
          that.setData({
            imgs
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  doUploadVideo:function(e){
    const that = this
    // 选择图片
    wx.chooseVideo({
      success: function (res) {
        console.log('res',res)
        const filePath = res.tempFilePath
        that.uploadFile(filePath,(fileRes)=>{
          let videos = JSON.parse(JSON.stringify(that.data.videos))
          videos.push(fileRes.fileID)
          that.setData({
            videos
          })
          console.log('videos',this.data.videos)
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  uploadFile:function(filePath,cb){
    wx.showLoading({
      title: '上传中',
    })
    const time =   Date.parse( new Date());
    const cloudPath = time + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        typeof cb === 'function' && cb(res)
    
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  saveList:function(e){
    console.log('e',e)
    const db = wx.cloud.database()
    const {log,imgs,date,videos} = this.data
    console.log('imgs',imgs)
    if((imgs.length<=0 && videos.length<=0) || !log || !date){
      wx.showToast({
        title: '所填数据不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    db.collection('lists').add({
      data: {
        log,
        imgs:imgs,
        videos,
        date
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.reLaunch({
          url:'/pages/index/index'
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  previewImg:function(e){
    const that = this
    wx.previewImage({
      current: e.target.dataset.img, 
      urls: that.data.imgs
    })
  }
})

