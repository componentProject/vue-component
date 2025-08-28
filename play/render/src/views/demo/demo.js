import moment from 'moment'
export const demo1 = () => {
  console.log('测试1', moment(new Date()).format('YYYY-MM-DD'))
}

export const demo2 = () => {
  console.log('测试2', moment(new Date()).format('YYYY-MM-DD'))
}
