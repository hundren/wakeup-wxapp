Component({
    data: {
        loaded: false,
      },
    created(){
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
    }
})