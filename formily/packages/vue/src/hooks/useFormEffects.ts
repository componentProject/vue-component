import { onBeforeUnmount, watchEffect } from 'vue'
import { Form } from '@moluoxixi/formily-core'
import { uid } from '@moluoxixi/formily-shared'
import { useForm } from './useForm'

export const useFormEffects = (effects?: (form: Form) => void): void => {
  const formRef = useForm()

  const stop = watchEffect((onCleanup) => {
    const id = uid()
    formRef.value.addEffects(id, effects)

    onCleanup(() => {
      formRef.value.removeEffects(id)
    })
  })

  onBeforeUnmount(() => stop())
}
