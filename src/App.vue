<template>
  <el-config-provider :locale="zhCn" :empty-values="[undefined, '']">
    <h1>{{ t('language') }}</h1>
    <header>
      <select @change="changeLang">
        <option v-for="(item, lng) in lngs" :label="item.nativeName" :key="lng" :value="lng" />
        ))}
      </select>
    </header>
    <Suspense>
      <RouterView />
      <template #fallback> 正在加载中..... </template>
    </Suspense>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const lngs = {
  zh: { nativeName: '中文' },
  en: { nativeName: 'English' },
}
function changeLang(e) {
  const lng = e.target.value
  localStorage.setItem('lang', lng)
  locale.value = lng
}
</script>
<style scoped></style>
