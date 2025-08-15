<template>
  <div class="overview-container">
    <div class="search-content">
      <ElInput
        ref="searchRef"
        v-model="query"
        :prefix-icon="Search"
        size="large"
        placeholder="Search Components"
      />
    </div>

    <div class="main-content">
      <div
        v-for="(group, groupIndex) in filteredSidebars"
        :key="groupIndex"
        class="component-group"
      >
        <p class="component-title">
          {{ group.text }}
          <ElTag effect="dark" round size="small">
            {{ group.items.length }}
          </ElTag>
        </p>
        <div class="card-content">
          <ElCard
            v-for="(item, index) in group.items"
            :key="index"
            tabindex="0"
            shadow="hover"
            @click="toPage(item.link)"
            @keydown.enter="toPage(item.link)"
          >
            <template #header>
              <ElText truncated>
                {{ item.text }}
              </ElText>
            </template>

            <template #default>
              <img src="https://vxeui.com/resource/img/546.gif" alt="没图了">
            </template>
          </ElCard>
        </div>
      </div>

      <ElEmpty
        v-if="!filteredSidebars.length"
        description="没有"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useData, useRouter } from 'vitepress'
import { ElCard, ElEmpty, ElInput, ElTag, ElText } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { baseUrl } from '../../../contants/web.ts'

import type { InputInstance } from 'element-plus'

const router = useRouter()
const { site, page } = useData()
function getSidebars() {
  if (!page.value) {
    return {
      sidebars: computed(() => []),
      hasSidebar: computed(() => false),
    }
  }
  const sidebars = computed(() => {
    const sidebar = site.value?.themeConfig?.sidebar || {}
    const componentSidebar = sidebar['/components/']
    if (componentSidebar) {
      return componentSidebar
    }
    return []
  })

  return {
    sidebars,
    hasSidebar: computed(() => sidebars.value.length > 0),
  }
}

const { sidebars } = getSidebars()
const query = ref('')
const searchRef = ref<InputInstance>()
const filteredSidebars = computed(() =>
  sidebars.value
    .slice(1)
    .map(group => ({
      ...group,
      items: group.items.filter((item) => {
        const value = query.value.trim().toLowerCase()
        return (
          group.text.toLowerCase().includes(value)
          || item.text.toLowerCase().includes(value)
          || item.promotion?.includes(value)
        )
      }),
    }))
    .filter(group => group.items.length),
)

function toPage(link: string) {
  router.go(`${baseUrl}${link}`)
}

onMounted(() => {
  nextTick(() => {
    searchRef.value?.focus()
  })
})
</script>

<style scoped lang="scss">
.overview-container {
  position: relative;

  .search-content {
    position: sticky;
    top: 60px;
    z-index: 10;

    .el-input {
      background: var(--bg-color);
    }
  }

  .main-content {
    .component-group {
      margin-top: 32px;

      .component-title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        gap: 8px;
      }

      .card-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;

        :deep(.el-card) {
          cursor: pointer;
          transition: none;

          &:focus-visible {
            outline: 2px solid var(--el-color-primary);
            outline-offset: 1px;
          }

          .el-card__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;

            .el-text {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-regular);
              line-height: 24px;
            }
          }

          .el-card__body {
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 280 / 180;

            svg {
              width: 100%;
              height: auto;
            }
          }
        }
      }
    }

    .designed-by {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
      font-size: 14px;
    }
  }
}
</style>
