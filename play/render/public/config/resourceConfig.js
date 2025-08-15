const sessionObj = {
  appId: 'S0100501',
  hisSignatureKey: '4a2d86a28f1cbecd94ba7c3436f4f0226765c710',
}
Object.keys(sessionObj).forEach((key) => {
  sessionStorage.setItem(key, sessionObj[key])
})
