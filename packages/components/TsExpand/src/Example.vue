<template>
  <div>
    <h3>基础用法</h3>
    <div class="example-item">
      <TsExpand :rows="3">
        <div>
          <p>这是一段很长的文本内容，用于测试折叠组件的功能。</p>
          <p>这是第二行内容，当内容超过指定的行数时，会自动显示展开按钮。</p>
          <p>这是第三行内容，点击展开按钮可以查看全部内容。</p>
          <p>这是第四行内容，展示展开后的效果。</p>
          <p>这是第五行内容，可以继续添加更多内容来测试。</p>
          <p>这是第六行内容，用于验证折叠功能是否正常工作。</p>
        </div>
      </TsExpand>
    </div>

    <h3>自定义行数</h3>
    <div class="example-item">
      <TsExpand :rows="2">
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容，超过2行会显示展开按钮。</p>
          <p>这是第四行内容。</p>
        </div>
      </TsExpand>
    </div>

    <h3>自定义按钮文本</h3>
    <div class="example-item">
      <TsExpand
        :rows="3"
        expand-text="查看更多"
        collapse-text="收起"
      >
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义的按钮文本。</p>
        </div>
      </TsExpand>
    </div>

    <h3>默认展开</h3>
    <div class="example-item">
      <TsExpand
        :rows="3"
        :default-expanded="true"
      >
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，默认展开状态。</p>
        </div>
      </TsExpand>
    </div>

    <h3>自定义行高</h3>
    <div class="example-item">
      <TsExpand
        :rows="3"
        :line-height="32"
      >
        <div>
          <p style="line-height: 32px;">
            这是第一行内容，行高为32px。
          </p>
          <p style="line-height: 32px;">
            这是第二行内容。
          </p>
          <p style="line-height: 32px;">
            这是第三行内容。
          </p>
          <p style="line-height: 32px;">
            这是第四行内容，超过3行会显示展开按钮。
          </p>
        </div>
      </TsExpand>
    </div>

    <h3>按钮位置</h3>
    <div class="example-item">
      <p>按钮在右边（默认）：</p>
      <TsExpand
        :rows="3"
        toggle-position="right"
      >
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，按钮在右边。</p>
        </div>
      </TsExpand>
      <p style="margin-top: 20px;">
        按钮在左边：
      </p>
      <TsExpand
        :rows="3"
        toggle-position="left"
      >
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，按钮在左边。</p>
        </div>
      </TsExpand>
    </div>

    <h3>自定义展开按钮</h3>
    <div class="example-item">
      <TsExpand :rows="3">
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，使用了自定义的展开按钮样式。</p>
        </div>
        <template #toggle="{ expanded, toggle }">
          <ElButton
            type="primary"
            size="small"
            @click="toggle"
          >
            {{ expanded ? '收起' : '展开' }}
          </ElButton>
        </template>
      </TsExpand>
    </div>

    <h3>事件监听</h3>
    <div class="example-item">
      <TsExpand
        :rows="3"
        @change="handleChange"
        @expand="handleExpand"
        @collapse="handleCollapse"
      >
        <div>
          <p>这是第一行内容。</p>
          <p>这是第二行内容。</p>
          <p>这是第三行内容。</p>
          <p>这是第四行内容，展开或收起时会触发事件。</p>
        </div>
      </TsExpand>
      <div class="event-log">
        <p>事件日志：</p>
        <ul>
          <li
            v-for="(log, index) in eventLogs"
            :key="index"
          >
            {{ log }}
          </li>
        </ul>
      </div>
    </div>

    <h3>列表内容</h3>
    <div class="example-item">
      <TsExpand :rows="3">
        <ul>
          <li v-for="i in 10" :key="i">
            列表项 {{ i }}
          </li>
        </ul>
      </TsExpand>
    </div>

    <h3>非文本内容 - 固定高度列表项（重要）</h3>
    <div class="example-item">
      <p class="tip-text">
        注意：组件要求每一行高度必须是固定的。此示例中每个列表项高度固定为 24px（与 lineHeight 一致）
      </p>
      <TsExpand :rows="3" :line-height="24">
        <div><ElTag effect="dark" round size="small" /></div>
        <div><ElTag effect="dark" round size="small" /></div>
        <div><ElTag effect="dark" round size="small" /></div>
        <div><ElTag effect="dark" round size="small" /></div>
        <div><ElTag effect="dark" round size="small" /></div>
        <div><ElTag effect="dark" round size="small" /></div>
      </TsExpand>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import TsExpand from './index.vue'

const eventLogs = ref<string[]>([])

function handleChange(expanded: boolean) {
  eventLogs.value.push(`状态改变: ${expanded ? '展开' : '收起'}`)
}

function handleExpand() {
  eventLogs.value.push('触发展开事件')
}

function handleCollapse() {
  eventLogs.value.push('触发收起事件')
}
</script>

<style scoped lang="scss">
h3 {
  font-size: 24px;
  font-weight: bold;
}
.example-item {
  border: 1px solid;
}
</style>
