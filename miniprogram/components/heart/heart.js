Component({

  behaviors: [],

  properties: {
    percent:{
      type:Number,
      value:0
    }
  },
  data: {
    hearts:[]
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    attached: function() {
      // 增加动画特效
        const type = ['1','2','3','4']
        let hearts = []
        for (let index = 0; index < 7; index++) {
          hearts.push({
            'y':type[Math.floor(Math.random()*type.length)],
            'x':type[Math.floor(Math.random()*type.length)],
            's':type[Math.floor(Math.random()*type.length)],
            'delay':index*0.7
          })
        }
        this.setData({
          hearts
        })
     
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    sign:function(){
      wx.requestSubscribeMessage({
        tmplIds: ['p5M4KiN61mirLpgXb79q5RCMoBta9-18JnccunfyAZQ'],
        success (res) { 
          wx.navigateTo({
            url: '/pages/sign/sign'
          })
         },
        fail (res) { console.log('fail',res)}
      })
    },
    addList:function(){
      wx.navigateTo({
        url: '/pages/addList/addList'
      })
    }
  }

})