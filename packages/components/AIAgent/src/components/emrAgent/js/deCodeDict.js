const DECODE_DICT = [
  {
    deCode: 'DE04.01.119.00',
    name: '主诉'
  }

]

export const getDeCodeByName = (name) => {
  for (let i = 0 ; i < DECODE_DICT.length; i++) {
    if (DECODE_DICT[i].name === name) {
      return DECODE_DICT[i].deCode
    }
  }
  return null
}