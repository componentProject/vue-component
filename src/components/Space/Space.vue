<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import type { SizeType, SpaceProps } from './types/Space'
import classNames from 'classnames'


const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'small',
  direction: 'horizontal',
  align: 'start',
  wrap: false
})

const classes = computed(() => {
  const { align, direction, className } = props
  const mergedAlign = direction === 'horizontal' && align === undefined ? 'center' : align

  return classNames('space',
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign
    },
    className
  )
})


const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
}

function getNumberSize(size: SizeType) {
  return +size ? size : spaceSize[size] || 0
}


const styles = computed(() => {
  const { size, wrap } = props
  const [horizontalSize, verticalSize] = ((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map(item =>
    getNumberSize(item)
  )
  const otherStyles: CSSProperties = {}
  otherStyles['column-gap'] = horizontalSize + 'px'
  otherStyles.rowGap = verticalSize + 'px'


  if (wrap) {
    otherStyles.flexWrap = 'wrap'
  }
  return { ...otherStyles, ...props.style }

})

</script>

<style scoped lang="scss">
.space {
  display: inline-flex;

  &-vertical {
    flex-direction: column;
  }

  &-align {
    &-center {
      align-items: center;
    }

    &-start {
      align-items: flex-start;
    }

    &-end {
      align-items: flex-end;
    }

    &-baseline {
      align-items: baseline;
    }
  }
}

</style>
