const modules = import.meta.glob('./componentData/*.(tsx|ts)', { eager: true, import: 'default' })
const data = Object.keys(modules).reduce((p, c) => {
  const key = c.split('/').at(-1).split('.')[0]
  p[key] = modules[c]
  return p
}, {})
export default data
