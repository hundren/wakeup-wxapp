const app = getApp()
Page({
    data:{
      avatar:'',
      coupleAvatar:'',
      point:0,
      couplePoint:0,
      coupleOpenId:'',
      page:0,
      size:20,
      avatarObj:{},
      logs:[],
      imgs:[]
    },
    onLoad:function(){
        console.log('app',app.globalData)
        const db = wx.cloud.database()
        const that = this
        console.log('app.globalData.openId',app.globalData.openId)
        //hardCode
        // app.globalData.openId = 'oSu_70LQjmtXhWvppkre70f-__w4'
        db.collection('couples').where({
         openId:app.globalData.openId
        }).get({
          success(res) {
            console.log(res)
            // find couples
            if(res.data && res.data.length >0){
              that.setData({
                avatar:res.data[0].avatar,
                coupleOpenId: res.data[0].coupleOpenId,
                avatarObj:{
                  [app.globalData.openId]:res.data[0].avatar
                }
              })
              that.getPoints()
              db.collection('couples').where({
                openId: res.data[0].coupleOpenId,
              }).get({
                success(coupleRes) {
                  if(coupleRes.data && coupleRes.data.length >0){
                    that.setData({
                      coupleAvatar: coupleRes.data[0].avatar,
                      avatarObj:{
                        ...that.data.avatarObj,
                        [res.data[0].coupleOpenId]:coupleRes.data[0].avatar
                      }
                    })
                    that.getLogs()

                  }
                }
              })
            }
          }
        })
    },
    getPoints (){
      const db = wx.cloud.database()
      db.collection('logs').where({
        openId:app.globalData.openId,
        isEarlier:true
      }).count().then(res=>{
        this.setData({
          point:res.total
        })
      })
      db.collection('logs').where({
        openId:this.data.coupleOpenId,
        isEarlier:true
      }).count().then(res=>{
        this.setData({
          couplePoint:res.total
        })
      })
    },
    getLogs (){
      const that = this
      const db = wx.cloud.database()
      db.collection('logs')
      .orderBy('date', 'desc')
      .skip(that.data.page*that.data.size) 
      .limit(that.data.size).
      get({
        success: res => {
          let _logs = this.data.logs
          //todo 把相同日期的合并在一起
          console.log('res',res.data)
          const _data = []
          res.data.forEach(logItem => {
            const dateIndex = _logs.findIndex(item=>item.date === logItem.date)
            if(dateIndex > -1){
              if(logItem.isEarlier){
                logItem.imgs && this.setData({
                  imgs:this.data.imgs.concat(logItem.imgs)
                })
                _logs[dateIndex] = {
                  ..._logs[dateIndex],
                  question: logItem.text,
                  questionTime: logItem.time.split(' ')[1] ,
                  questionOpenId: logItem.openId,
                  questionAvatar: that.data.avatarObj[logItem.openId]
                }
              }else{
                logItem.imgs && this.setData({
                  imgs:this.data.imgs.concat(logItem.imgs)
                })
                _logs[dateIndex] = {
                  ..._logs[dateIndex],
                  answer: logItem.text,
                  answerTime: logItem.time.split(' ')[1] ,
                  answerOpenId: logItem.openId,
                  answerAvatar: that.data.avatarObj[logItem.openId]
                }
              }
            }else{
              logItem.imgs && this.setData({
                imgs:this.data.imgs.concat(logItem.imgs)
              })
              _logs.push({
                date: logItem.date,
                imgs: logItem.imgs,
                question: logItem.isEarlier ? logItem.text : '',
                questionTime: logItem.isEarlier ? logItem.time.split(' ')[1] : '',
                questionOpenId: logItem.isEarlier ? logItem.openId : '',
                questionAvatar: logItem.isEarlier ? that.data.avatarObj[logItem.openId] : '',
                answer: logItem.isEarlier ?  '' : logItem.text,
                answerTime: logItem.isEarlier ? '' : logItem.time.split(' ')[1],
                answerOpenId: logItem.isEarlier ? '' : logItem.openId,
                answerAvatar: logItem.isEarlier ? '' : that.data.avatarObj[logItem.openId],
              })
            }
          });
          console.log('_logs',_logs)
          this.setData({
            logs: _logs
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
    onReachBottom(){
      this.setData({
        page:this.data.page + 1
      })
      this.getLogs()
    },
    previewImg:function(e){
      const that = this
      wx.previewImage({
        current: e.target.dataset.img, 
        urls: that.data.imgs
      })
    }
})