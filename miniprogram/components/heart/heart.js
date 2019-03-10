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
    addList:function(){
      wx.navigateTo({
        url: '/pages/addList/addList'
      })
    }
    
  }

})