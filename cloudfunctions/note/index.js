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
    const { note } = event
    console.log('event',event)
    const res = await db.collection('notes').add({
        data:{
            note,
            date,
            time,
            openId:event.userInfo.openId,
        }
    })
    return true
}
  