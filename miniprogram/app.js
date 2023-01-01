const MPServerless = require('@alicloud/mpserverless-sdk');
// 授权阿里云
const mpServerless = new MPServerless(wx, {
    appId: 'wx83f5e3553fa2b924', // 小程序应用标识
    spaceId: 'mp-cc509efe-2b21-4982-981e-4d1df5122bcb', // 服务空间标识
    clientSecret: 'cFhamO71Ygug0lHpVSksYw==', // 服务空间 secret key
    endpoint: 'https://api.next.bspapp.com', // 服务空间地址，从小程序 serverless 控制台处获得
});
//app.js
App({
  mpServerless: mpServerless,
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:'wakeup-4d5136'
      })
    }
  mpServerless.init();
    this.globalData = {
      file: [{"Type":"jpg","GmtCreate":"2022-11-27T09:10:29Z","Size":66027,"GmtModified":"2022-11-27T09:10:29Z","Id":"4323949d-b279-43d7-bff8-827c6af384d1","Url":"https://mp-cc509efe-2b21-4982-981e-4d1df5122bcb.cdn.bspapp.com/cloudstorage/98fa3eba-2c11-43d0-83c2-765dff0c0a54.jpg","Name":"1569678274000.jpg"},{"Type":"jpg","GmtCreate":"2022-10-23T15:01:49Z","Size":62998,"GmtModified":"2022-10-23T15:01:49Z","Id":"cc71cc6a-cdac-44c2-9cf9-3cf673b2b1c6","Url":"https://mp-cc509efe-2b21-4982-981e-4d1df5122bcb.cdn.bspapp.com/cloudstorage/281e45b8-c1e8-4288-8a49-76c98ac0e540.jpg","Name":"1566091244000.jpg"},{"Type":"mp4","GmtCreate":"2022-11-27T09:10:43Z","Size":8455799,"GmtModified":"2022-11-27T09:10:43Z","Id":"d508bb19-1deb-451c-b03f-7f0069769bc9","Url":"https://mp-cc509efe-2b21-4982-981e-4d1df5122bcb.cdn.bspapp.com/cloudstorage/f03e9082-a828-46f0-8793-d7bad1a34552.mp4","Name":"1571211225000.mp4"}]
    }
  }
})
