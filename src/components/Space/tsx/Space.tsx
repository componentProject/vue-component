import './Space.scss'
import { useSlots } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { SizeType } from '../types/Space.ts'
import classNames from 'classnames'
import { booleanType, filterEmpty, PropTypes, tuple } from '../../_utils'

export const spaceProps = () => ({})
export default defineComponent({
  name: 'Space',
  props: {
    /**
     * 你好
     */
    className: String,
    style: Object as PropType<CSSProperties>,
    size: {
      type: [String, Number, Array] as PropType<SizeType | [SizeType, SizeType]>,
    },
    direction: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
    align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline')),
    wrap: booleanType(),
  },
  setup(props) {
    // const props = withDefaults(defineProps<SpaceProps>(), {
    //   size: 'small',
    //   direction: 'horizontal',
    //   align: 'start',
    //   wrap: false
    // })
    const classes = computed(() => {
      const { align, direction, className } = props
      const mergedAlign = direction === 'horizontal' && align === undefined ? 'center' : align

      return classNames(
        'space',
        `space-${direction}`,
        {
          [`space-align-${mergedAlign}`]: mergedAlign,
        },
        className,
      )
    })

    const spaceSize = {
      small: 8,
      middle: 16,
      large: 24,
    }

    function getNumberSize(size: SizeType) {
      return +size ? size : spaceSize[size] || 0
    }

    const styles = computed(() => {
      const { size, wrap } = props
      const [horizontalSize, verticalSize] = (
        (Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]
      ).map((item) => getNumberSize(item))
      const otherStyles: CSSProperties = {}
      otherStyles.columnGap = horizontalSize + 'px'
      otherStyles.rowGap = verticalSize + 'px'

      if (wrap) {
        otherStyles.flexWrap = 'wrap'
      }
      return { ...otherStyles, ...props.style }
    })

    const slots = useSlots()

    const items = filterEmpty(slots.default())
    const split = slots.split?.() || (
      <div style={{ height: '100%', width: '1px', background: '' }}></div>
    )

    const render = () => {
      return [
        <div class={classes.value} style={styles.value}>
          {items.map((item, i) => {
            return [
              <div class="space-item">{item}</div>,
              i < items.length && split && (
                <span
                  class={`${props.className}-split`}
                  style={{ height: '100%', ...styles.value }}
                >
                  {split}
                </span>
              ),
            ]
          })}
        </div>,
      ]
    }
    return render
  },
})
