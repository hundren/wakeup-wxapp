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
            const result = await cloud.openapi.templateMessage.send({
                touser: element.openId,
                page: '/pages/index/index',
                data: {
                  keyword1: {
                    value: earlier.text
                  },
                  keyword2: {
                    value: earlier.time
                  },
                  keyword3: {
                    value: later.text
                  },
                  keyword4: {
                    value: later.time
                  }
                },
                templateId:'-2qdDocWp3kIKS2HeLO7TKJaRIdpiuEZm1p-PyWbjcQ',
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