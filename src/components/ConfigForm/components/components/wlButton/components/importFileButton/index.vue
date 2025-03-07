<template>
  <div>
    <input name="file" type="file" accept="*" @change="fileChange" ref="selectFile" class="none" />
    <el-button class="button" :loading="loading" v-bind="$attrs" v-on="listeners">
      <template #default>
        <span v-if="title">{{ title }}</span>
        <slot name="default"></slot>
      </template>
    </el-button>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'importFileButton',
  props: {
    accept: { type: String, default: '' },
    title: { type: String, default: '' },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    listeners() {
      const listeners = { ...this.$listeners }
      const { click } = listeners
      listeners.click = (event) => {
        this.$refs.selectFile.click()
        click?.(event)
      }
      return listeners
    },
  },
  methods: {
    fileChange(e) {
      this.$emit('change', e.target.files[0])
      e.target.value = ''
    },
  },
})
</script>

<style scoped lang="scss"></style>
