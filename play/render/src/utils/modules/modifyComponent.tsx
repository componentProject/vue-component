import type { ComponentInstance } from 'vue'
import { computed, defineComponent } from 'vue'

function withModifiedProps(
  OriginalComponent: ComponentInstance<any>,
  modifier = (v: any) => v,
) {
  return defineComponent({
    name: OriginalComponent.name,
    setup(_: any, { attrs, slots }) {
      const modifiedProps = computed(() => modifier(attrs))
      return () => <OriginalComponent {...modifiedProps.value} v-slots={slots} />
    },
  })
}

export function modifyComponents(
  app: any,
  components: ComponentInstance<any>[],
  modifier = (v: any) => v,
) {
  components.forEach((component) => {
    const newComponent = withModifiedProps(component, modifier)
    app.component(newComponent.name, newComponent)
  })
}
