const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    console.log(event)
    console.log(context)
    const {result:time}  = await cloud.callFunction({
      name:'date',
      data:{
        showTime:true
      }
    })
    // if(dayjs(time).isBefore(dayjs(`${date} 05:00:00`))){
    //   return {
    //     code:1,
    //     msg:'还可以再睡哦，喵'
    //   }
    // }
    const {result:date}  = await cloud.callFunction({
      name:'date'
    })
    const res = await db.collection('logs').where({
      date
    }).get()
    console.log('res',res)
    if(res.data && res.data.length > 0 ){
     const index = res.data.findIndex(item=>item.openId === event.userInfo.openId)
     console.log('index',index)
     if(index > -1){
       return {
        code:1,
        msg:'你已经打过卡了哦，喵'
      }
     }else{
      return {
        code:0,
        isEarlier:false,
        msg:'你今天是"晚"起的喵哦~'
      }
     }
    }else{
      return {
        code:0,
        isEarlier:true,
        msg:'你今天是"早"起的喵哦~'
      }
    }
  }
  