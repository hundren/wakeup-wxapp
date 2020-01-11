Component({

  behaviors: [],

  properties: {
    percent:{
      type:Number,
      value:0
    }
  },
  data: {
  
  }, // 私有数据，可用于模版渲染


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