import excelTotal from '@/components/excelTotal/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
const meta: Meta<any> = {
  title: 'excelTotal',
  component: excelTotal,
  args: {},
  argTypes: {},
}
export default meta
export const excelTotalDemo: StoryFn = (args: any) => ({
  template: `
    <div>
      <excelTotal />
    </div>
  `,
  components: { excelTotal },
  setup() {
    return {
      ...args,
    }
  },
})
const props = {}
excelTotalDemo.args = props
