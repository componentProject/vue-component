import { createForm } from '@moluoxixi/formily-core'
import { markRaw } from 'vue'

const createRawForm = (...args: Parameters<typeof createForm>) => {
  const form = createForm(...args)
  return markRaw(form)
}

export { createRawForm as createForm }
