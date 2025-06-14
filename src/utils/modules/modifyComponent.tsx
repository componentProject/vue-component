import { defineComponent, computed } from 'vue'
import type { ComponentInstance } from 'vue'

export function withModifiedProps(
  OriginalComponent: ComponentInstance<any>,
  propName: string,
  modifier = (v: any) => v,
) {
  return defineComponent({
    name: OriginalComponent.name,
    setup(_: any, { attrs, slots }) {
      const appendToBody = (attrs['append-to-body'] ?? false) !== false
      const modifiedProps = computed(() => ({
        ...attrs,
        [propName]: appendToBody ? modifier(attrs[propName]) : 'body',
      }))
      return () => <OriginalComponent {...modifiedProps.value} v-slots={slots} />
    },
  })
}

export function modifyComponents(
  app: any,
  components: ComponentInstance<any>[],
  propName: string,
  modifier = (v: any) => v,
) {
  components.forEach((component) => {
    const newComponent = withModifiedProps(component, propName, modifier)
    app.component(newComponent.name, newComponent)
  })
}
