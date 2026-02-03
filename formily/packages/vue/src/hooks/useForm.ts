import { inject, Ref, ref } from 'vue'
import { Form } from '@moluoxixi/formily-core'
import { FormSymbol } from '../shared/context'

export const useForm = (): Ref<Form> => {
  const form = inject(FormSymbol, ref())
  return form
}
