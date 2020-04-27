const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log('event', event)
  try {
    const {result:date}  = await cloud.callFunction({
        name:'date'
    })
    const res = await db.collection('logs').where({
        date
      }).get()
    if(res.data && res.data.length > 0 ){
        const earlier = res.data.find(item=>item.isEarlier)
        const later = res.data.find(item=>item.isEarlier === false)

        for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            console.log('openId',element.openId)
            console.log('thing1',earlier.text)
            console.log('time2',earlier.time)
            console.log('thing4',later.text)
            console.log('thing3',later.time)

            const result = await cloud.openapi.subscribeMessage.send({
                touser: element.openId,
                page: '/pages/index/index',
                data: {
                  thing1: {
                    value: earlier.text ? earlier.text.substr(0,20) : ''
                  },
                  time2: {
                    value: earlier.time
                  },
                  thing4: {
                    value: later.text ? later.text.substr(0,20) : ''
                  },
                  thing3: {
                    value: later.time
                  }
                },
                templateId:'p5M4KiN61mirLpgXb79q5RCMoBta9-18JnccunfyAZQ',
                formId: element.formId,
              })
        }
    }
    console.log(result)
    return true
  } catch (err) {
    console.log(err)
    return err
  }
}