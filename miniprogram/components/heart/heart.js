const computedBehavior = require('miniprogram-computed')
Component({

  behaviors: [computedBehavior],

  properties: {
    percent:{
      type:Number,
      value:0
    }
  },
  data: {
    hearts:[]
  }, // 私有数据，可用于模版渲染
  computed: {
    percentComputed(data) {
      return data.percent % 1
    },
    percentInt(data) {
      return parseInt(data.percent)
    },
  },
  lifetimes: {
    attached: function() {
      // 增加动画特效
        const type = ['1','2','3','4']
        let hearts = []
        for (let index = 0; index < 3; index++) {
          hearts.push({
            'y':type[Math.floor(Math.random()*type.length)],
            'x':type[Math.floor(Math.random()*type.length)],
            's':type[Math.floor(Math.random()*type.length)],
            'delay':index*1.2
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