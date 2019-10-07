const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log('event', event)
  try {
    // const res = await db.collection('formIds').orderBy('date', 'desc').limit(1).get()
    // console.log(res)
    const result = await cloud.openapi.templateMessage.send({
      touser: 'oSu_70KZOKN-Ip9YcgazXkiYxnY0',
      page: '/pages/index/index',
      data: {
        keyword1: {
          value: 'Dear，早睡早起'
        },
        keyword2: {
          value: 'test'
        }
      },
      templateId:'3k-0557cS4NMNJP71yCpJfs0Ddr5tLJOELf4BMXsCW4',
      formId: '7ab9c2b1ae6a4e62964dced6b3f1f56e',
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}