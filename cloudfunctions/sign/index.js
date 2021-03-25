const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    console.log(event)
    console.log(context)
    const {result:date}  = await cloud.callFunction({
        name:'date'
    })
    const {result:time} = await cloud.callFunction({
        name: 'date',
        data:{
          showTime:true
        }
    })
    const { text,formId,isEarlier,imgs } = event
    //todo先设置point为1
    const res = await db.collection('logs').add({
        data:{
            text,
            formId,
            date,
            imgs,
            time,
            point:1,
            openId:event.userInfo.openId,
            isEarlier
        }
    })
    return true
}
  