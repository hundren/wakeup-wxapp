const dayjs = require('dayjs')
exports.main = (event, context) => {
    const date = new Date()
    if(event.showTime){
        return dayjs().add(8,'hour').format('YYYY-MM-DD HH:mm:ss')
    }else{
        return dayjs().add(8,'hour').format('YYYY-MM-DD') 
    }
 }
  