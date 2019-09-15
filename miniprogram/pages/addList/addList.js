
Page({
  data: {
    log:'',
    date: '',
    imgs:[]
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

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        console.log('filePath', filePath)
        console.log('res', res)

        // 上传图片
        const time =   Date.parse( new Date());
        const cloudPath = time + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            // app.globalData.fileID = res.fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath
            // wx.navigateTo({
            //   url: '../storageConsole/storageConsole'
            // })
            let imgs = JSON.parse(JSON.stringify(that.data.imgs))
            imgs.push(res.fileID)
            that.setData({
              imgs
            })
            console.log('imgUrl',this.data.imgUrl)
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
      fail: e => {
        console.error(e)
      }
    })
  },
  saveList:function(){
    const {log,imgs,date} = this.data
    const db = wx.cloud.database()
    db.collection('lists').add({
      data: {
        log,
        imgs:imgs,
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
  previewImg:function(){
    const that = this
    console.log('that',that.data.imgUrl)
    wx.previewImage({
      current: that.data.imgUrl, 
      urls: [that.data.imgUrl] 
    })
  }
})

