<template>
  <div class="example-container">
    <h3>基础用法 - URL跳转</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="basicText"
        :size="200"
      />
      <div class="value-display">
        URL地址: {{ basicText }}
        <br>
        <small>扫码后会自动跳转到该地址</small>
      </div>
    </div>

    <h3>自动补全URL协议</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="autoCompleteText"
        :size="200"
        :auto-complete-url="true"
      />
      <div class="value-display">
        输入: {{ autoCompleteText }}
        <br>
        实际生成: https://{{ autoCompleteText }}
        <br>
        <small>自动添加 https:// 协议</small>
      </div>
    </div>

    <h3>自定义颜色</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="customText"
        :size="200"
        color-dark="#007bff"
        color-light="#f0f8ff"
        :margin="2"
      />
      <div class="value-display">
        文本内容: {{ customText }}
      </div>
    </div>

    <h3>带Logo的二维码</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="logoText"
        :size="250"
        :show-logo="true"
        logo-url="https://via.placeholder.com/100"
        :logo-size="50"
        :logo-margin="4"
        logo-background-color="#ffffff"
      />
      <div class="value-display">
        文本内容: {{ logoText }}
      </div>
    </div>

    <h3>带边框的二维码</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="borderText"
        :size="200"
        :show-border="true"
        :border-width="2"
        border-color="#333333"
      />
      <div class="value-display">
        文本内容: {{ borderText }}
      </div>
    </div>

    <h3>可下载的二维码</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="downloadText"
        :size="200"
        :downloadable="true"
        download-file-name="my-qrcode"
        image-type="image/png"
        @download="onDownload"
      />
      <div class="value-display">
        文本内容: {{ downloadText }}
        <br>
        <small>点击二维码可下载</small>
      </div>
    </div>

    <h3>高错误纠正级别</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="highErrorText"
        :size="200"
        error-correction-level="H"
        :margin="4"
      />
      <div class="value-display">
        错误纠正级别: H (最高)
      </div>
    </div>

    <h3>动态文本</h3>
    <div class="qr-code-demo">
      <QrCode
        :text="dynamicText"
        :size="200"
      />
      <div class="value-display">
        <input
          v-model="dynamicText"
          type="text"
          placeholder="输入文本生成二维码"
          style="width: 300px; padding: 8px; margin-top: 10px;"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QrCode from './index.vue'

const basicText = ref('https://www.example.com')
const autoCompleteText = ref('www.example.com')
const customText = ref('自定义颜色二维码')
const logoText = ref('https://www.example.com')
const borderText = ref('https://www.example.com')
const downloadText = ref('https://www.example.com')
const highErrorText = ref('https://www.example.com')
const dynamicText = ref('https://www.example.com')

function onDownload(url: string) {
  console.log('二维码下载:', url)
  // 下载成功提示
  console.log('二维码下载成功！')
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 20px;
  max-width: 1200px;
  font-family: Arial, sans-serif;

  h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 18px;
    color: #333;
    font-weight: 600;

    &:first-child {
      margin-top: 0;
    }
  }

  .qr-code-demo {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .value-display {
    font-size: 14px;
    color: #666;
    text-align: center;
  }
}
</style>
