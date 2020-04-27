Page({
    onReady: async function (e) {
      // 使用 wx.createAudioContext 获取 audio 上下文 context
      this.audioCtx = wx.createInnerAudioContext()
      this.audioCtx.src = 'cloud://wakeup-4d5136.7761-wakeup-4d5136/AJR - Bud Like You.mp3'
      const {result:date}  = await wx.cloud.callFunction({
        name:'date'
      })
      console.log('date',date)
      // 取月日
      const monthDay = date ? date.split('-')[1] + '-' + date.split('-')[2] : ''
      if(monthDay === '12-18'){
        this.setData({
          isBirthday:true
        })
        setTimeout(() => {
          this.setData({
            isBirthday:false
          })
        }, 55000);
      }
      if(monthDay === '02-08'){
        this.setData({
          isAnniversary:true
        })
      }
    },
   
    data: {
      isSubmitting:false,
      isBirthday:false,
      isAnniversary:false
    },
    sign:async function(e){

        this.setData({
            isSubmitting:true
        })
        console.log('aaa',e)
        console.log('text',e.detail.value)
        //todo判断是早起还是晚起
       const {result:status} = await wx.cloud.callFunction({
           name:'status',
       })
       const that = this
       console.log('status',status)
       if(status.code === 0){
        wx.showModal({
            title:'有❤️的提示',
            content:status.msg,
            success:(res)=>{
                if (res.confirm) {
                    console.log('用户点击确定')
                    if(!e.detail.value.text){
                        wx.showToast({
                            title: '请睁大眼睛醒一醒，打些字哦喵～',
                            icon: 'none',
                            duration: 2000
                          })
                          that.setData({
                            isSubmitting:false
                          })
                         return false
                    }
                    console.log('9999',)
                    // 截取前20个字符串
                    wx.cloud.callFunction({
                        name: 'sign',
                        data: {
                            formId:e.detail.formId,
                            text:e.detail.value.text,
                            isEarlier:status.isEarlier
                        },
                        success: res => {
                          wx.showToast({
                            title: '打卡成功了喵～',
                            icon: 'none',
                            duration: 2000
                          })
                          that.audioCtx.play()
                          that.setData({
                            isSubmitting:false
                          })
                          //晚的发起消息
                          if(status.isEarlier === false){
                            wx.cloud.callFunction({
                              name:'message'
                            })
                          }
                        },
                        fail: err => {
                          console.error('[云函数] [sign] 调用失败', err)
                        }
                      })
                  }else if (res.cancel) {
                    console.log('用户点击取消')
                    that.setData({
                        isSubmitting:false
                      })
                  }
            }
        })
       }else if(status.code === 1){
          wx.showToast({
            title: status.msg,
            icon: 'none',
            duration: 2000
          })
        this.setData({
            isSubmitting:false
        })
       }
   
   },
   handleCloseAnniversary: function(){
     this.setData({
      isAnniversary:false
     })
   }
})