<template>
  <div class="bg-primary p-[16px]">
    <TsFooter :items="base" align="center" />
    <TsFooter :items="left" align="left" />
    <TsFooter :items="right" align="right" />
    <TsFooter :items="['© 2025 Trasen']" />
    <TsFooter :items="[{ text: '官网', link: 'https://example.com' }]" />
    <TsFooter :items="['客服：400-123-4567', { text: '隐私', link: 'https://example.com/privacy' }]" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TsFooter from './index.vue'

const base = ref([
  '© 2025 Trasen',
  { text: '官网', link: 'https://example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
])
const left = ref(['沪ICP备00000000号-1'])
const right = ref([{ text: 'GitHub', link: 'https://github.com' }])
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/main.scss';
</style>
