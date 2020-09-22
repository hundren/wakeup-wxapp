Page({
  data: {
    notes:[],
    inputValue:'',
    loading:false
  },
  onLoad:function(){
    this.getNotes()
  },
  getNotes (){
    const that = this
    const db = wx.cloud.database()
    db.collection('notes')
    .orderBy('date', 'desc').get({
      success: res => {
        console.log('res',res)
        this.setData({
          notes: res.data || []
        })
        wx.hideLoading({})
        this.setData({
          loading:false
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
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  note:async function(e){
    console.log('ee',e.detail.value)
    wx.showLoading({
      title: '加载中',
    })  
    this.setData({
      loading:true
    })
    wx.cloud.callFunction({
      name: 'note',
      data: {
          note:e.detail.value.note,
      },
      success: res => {
        if(res){
          this.setData({
            inputValue:'',
            loading:false
          })
        
          this.getNotes()
        }
      },
      fail: err => {
        console.error('[云函数] [note] 调用失败', err)
        wx.hideLoading({})
      }
    })
  }
})