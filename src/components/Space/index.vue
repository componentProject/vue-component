<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, inject } from 'vue'
import { computed } from 'vue'
import type { SizeType, SpaceProps } from './types/Space'
import type { ConfigProviderPropsType } from '@/components/ConfigProvider/types/index.ts'
import classNames from 'classnames'


const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'small',
  direction: 'horizontal',
  align: 'start',
  wrap: false
})

const classes = computed(() => {
  const { align, direction, className } = props
  const mergedAlign = direction === 'horizontal' && align == undefined ? 'center' : align

  return classNames('space',
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign
    },
    className
  )
})


const spaceSizeMap = {
  small: 8,
  middle: 16,
  large: 24
}

function getNumberSize(size: SizeType) {
  if (typeof size === 'string') {
    return spaceSizeMap[size]
  } else {
    return size || 0
  }
}

const configProvider: ConfigProviderPropsType = inject('configProvider', {})
const styles = computed(() => {
  const { size, wrap, height, width } = props
  const spaceSize = configProvider.space || size
  const [horizontalSize, verticalSize] = ((Array.isArray(spaceSize) ? spaceSize : [spaceSize, spaceSize]) as [SizeType, SizeType]).map(item =>
    getNumberSize(item)
  )
  const otherStyles: CSSProperties = {}
  otherStyles['column-gap'] = horizontalSize + 'px'
  otherStyles.rowGap = verticalSize + 'px'


  function getHeightOrWidth(str: string | undefined) {
    if(!str) return;
    return Number.isNaN(+str) ? str : str + 'px'
  }

  if (wrap) {
    otherStyles.flexWrap = 'wrap'
  }
  return { height: getHeightOrWidth(height), width: getHeightOrWidth(width), ...otherStyles, ...props.style }

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
