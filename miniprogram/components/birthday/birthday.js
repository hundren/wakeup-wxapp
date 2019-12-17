Component({
    data: {
        loaded: false,
      },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          const self = this
          wx.loadFontFace({
              family: 'Pacifico',
              source: 'url("https://sungd.github.io/Pacifico.ttf")',
              success(res) {
                console.log('6666',res.status)
                self.setData({ loaded: true })
              },
              fail: function(res) {
                console.log(res.status)
              },
              complete: function(res) {
                console.log(res.status)
              }
            });
            this.audioBirthdayCtx = wx.createInnerAudioContext()
            this.audioBirthdayCtx.src = 'cloud://wakeup-4d5136.7761-wakeup-4d5136-1253625034/Happy.mp3'
            // this.audioBirthdayCtx.src = 'cloud://wakeup-4d5136.7761-wakeup-4d5136/AJR - Bud Like You.mp3'
            setTimeout(() => {
            this.audioBirthdayCtx.play()
              
            }, 2000);
                    
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
          this.audioBirthdayCtx.stop()

        },
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