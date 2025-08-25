import { defineComponent, computed } from 'vue'

export function withModifiedProps(OriginalComponent, propName, modifier = (v) => v) {
  return defineComponent({
    name: OriginalComponent.name,
    setup(props, { attrs, slots }) {
      const appendToBody = (attrs['append-to-body'] ?? false) !== false
      const modifiedProps = computed(() => ({
        ...attrs,
        [propName]: appendToBody ? modifier(attrs[propName]) : 'body'
      }))
      return () => <OriginalComponent {...modifiedProps.value} v-slots={slots} />
    }
  })
}

export function modifyComponents(app, components, propName, modifier) {
  components.forEach((component) => {
    const newComponent = withModifiedProps(component, propName, modifier)
    app.component(newComponent.name, newComponent)
  })
}
