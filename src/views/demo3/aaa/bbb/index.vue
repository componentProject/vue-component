<template>
  <div class="grid grid-cols-3">
    <div class="box">
      1
    </div>
    <div class="box">
      <div class="h-[300px]">
        1222
      </div>
    </div>
    <div class="box">
      1
    </div>
    <div class="box">
      1
    </div>
    <div class="box h-[300px]">
      1
    </div>
    <div class="box">
      1
    </div>
    <div class="box">
      1
    </div>
    <div class="box">
      1
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '三级菜单的三级菜单',
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {},
})
</script>

<style scoped lang="scss">
.box {
  background-color: red;
  border: 1px solid black;
}
</style>
