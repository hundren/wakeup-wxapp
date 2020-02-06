const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    const res = await db.collection('lists').limit(999999).get()
    return res.data
  } catch (err) {
    console.log(err)
    return err
  }
}