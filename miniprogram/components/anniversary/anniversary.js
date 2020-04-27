Component({
    data: {
        loaded: false,
        imgs:[],
        year: ''
      },
    lifetimes: {
        attached: async function() {
            // 在组件实例进入页面节点树时执行
            const self = this
            this.audioBirthdayCtx = wx.createInnerAudioContext()
            this.audioBirthdayCtx.src = 'cloud://wakeup-4d5136.7761-wakeup-4d5136-1253625034/fiveLove.mp3'
            this.audioBirthdayCtx.loop = true
            setTimeout(() => {
                this.audioBirthdayCtx.play()
            }, 2000);

            const {result:lists}  = await wx.cloud.callFunction({
                name:'getLists'
              })
            // 整合所有imgs
            if(lists && lists.length > 0){
                let imgs = []
                lists.forEach(element => {
                    imgs = imgs.concat(element.imgs)
                });
                imgs.sort(function() {
                    return .5 - Math.random();
                });
                this.setData({
                    imgs
                })
            }
            // 计算这是第几周年
            const {result:date}  = await wx.cloud.callFunction({
                name:'date'
              })
              console.log('date',date)
              // 取月日
              const year = date ? date.split('-')[0] : '2020'
              this.setData({
                  year: parseInt(year) - 2019
              })
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
          this.audioBirthdayCtx.stop()
        },
      },
    methods:{
        onTap:function(){
            console.log('999',)
          this.triggerEvent('wordTap',)
          this.audioBirthdayCtx.stop()
        }
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
        },
        hide: function() {
          // 页面被隐藏
        },
        resize: function(size) {
          // 页面尺寸变化
        }
      }
})