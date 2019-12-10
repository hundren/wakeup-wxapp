const app = getApp()
Page({
    data:{
      avatar:'',
      coupleAvatar:''
    },
    onLoad:function(){
        console.log('app',app.globalData)
        const db = wx.cloud.database()
        const that = this
        db.collection('couples').where({
         openId:app.globalData.openId
        }).get({
          success(res) {
            console.log(res)
          }
        })
    }
})