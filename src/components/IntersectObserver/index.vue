<template>
  <div id="intersection-observer-box" v-bind="$attrs">
    <slot />
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
                            /**
                             * 元素是否进入视口
                             * */
                            isIntersecting: {
                              type: Boolean,
                              default: true
                            },
                            /**
                             * 进入或离开视口的比例
                             * */
                            threshold: {
                              type: Number,
                              default: 1.0
                            },
                            /**
                             * 默认进入或离开容器触发监听,
                             * 如果设置了rootMargin，分别对应容器上右下左收缩的比例
                             * 例如[0,0,0.8,0] 代表仅监听0-20%高度部分
                             */
                            rootMargin: {
                              type: Array,
                              default: () => [0, 0, 0, 0]
                            },
                            /**
                             * 需要监听进入/离开容器的元素列表
                             * */
                            observers: {
                              type: Array,
                              default: () => []
                            },
                            /**
                             * 需要监听进入/离开容器的元素id列表
                             * */
                            observerIds: {
                              type: Array,
                              default: () => []
                            }
                          })
/**
 * mutate接受根据isIntersecting判断的进入或离开视口的元素
 * getTargets接受根据observerIds获取到的元素组成的{id:target} 隐射对象
 * */
const emits = defineEmits([
                            /**
                             * 根据isIntersecting判断的进入或离开视口的元素
                             */
                            'mutate',
                            /**
                             * 根据observerIds获取到的元素组成的{id:target} 隐射对象
                             */
                            'getTargets'
                          ])

let rootElement = null
let observer, resizeObserver
onMounted(() => {
  rootElement = document.getElementById('intersection-observer-box')
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize) {
        // Firefox将' contentBoxSize '实现为单个内容矩形，而不是数组
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize
        const { blockSize, inlineSize } = contentBoxSize
        if (observer) observer.disconnect()

        const { threshold, isIntersecting, observers, observerIds } = props

        let rootMargin = ''
        props.rootMargin.forEach((item, index) => {
          rootMargin += `${index % 2 ? -inlineSize * item : -blockSize * item}px `
        })
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              console.log('entry', entry)
              if (entry.isIntersecting == isIntersecting) {
                emits('mutate', entry)
              }
            })
          },
          {
            root: rootElement,
            rootMargin,
            threshold: [threshold]
          }
        )
        observers.forEach((domItem) => {
          observer.observe(domItem)
        })
        const targets = observerIds.reduce((p, id) => {
          p[id] = document.getElementById(id)
          return p
        }, {})
        Object.values(targets).forEach((domItem) => {
          observer.observe(domItem)
        })
        emits('getTargets', targets)
      }
    }
  })
  resizeObserver.observe(rootElement, {
    box: 'content-box'
  })
})
onBeforeUnmount(() => {
  resizeObserver.disconnect()
  observer.disconnect()
})
</script>

<style scoped lang="scss"></style>
