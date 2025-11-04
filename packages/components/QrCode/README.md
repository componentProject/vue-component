# QrCode 二维码组件

基于 `qrcode` 库封装的二维码生成组件，支持自定义样式、Logo、边框和下载功能。

## 功能特性

- ✅ 支持自定义二维码尺寸和颜色
- ✅ 支持错误纠正级别配置
- ✅ 支持添加Logo图片
- ✅ 支持自定义边框样式
- ✅ 支持二维码下载
- ✅ 支持多种图片格式（PNG、JPEG、WebP）
- ✅ 完整的 TypeScript 类型支持
- ✅ 响应式设计，自动更新

## 基础用法 - URL跳转

要让二维码扫码后跳转到指定地址，只需要将 `text` 属性设置为URL地址即可：

```vue
<template>
  <QrCode
    :text="url"
    :size="200"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

// 方式1：完整URL（推荐）
const url = ref('https://www.example.com')

// 方式2：自动补全URL（如果忘记加协议，组件会自动添加https://）
const url2 = ref('www.example.com') // 会自动变成 https://www.example.com
</script>
```

**扫码跳转说明：**
- 当二维码内容是URL时（以 `http://` 或 `https://` 开头），扫描器会自动识别并打开该URL
- 如果设置了 `autoCompleteUrl="true"`（默认开启），即使URL没有协议，组件也会自动添加 `https://`
- 扫码后，手机扫描器会自动在浏览器中打开该地址

## 自定义颜色

```vue
<template>
  <QrCode
    :text="qrText"
    :size="200"
    color-dark="#007bff"
    color-light="#f0f8ff"
    :margin="2"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const qrText = ref('自定义颜色二维码')
</script>
```

## 带Logo的二维码

```vue
<template>
  <QrCode
    :text="qrText"
    :size="250"
    :show-logo="true"
    logo-url="/path/to/logo.png"
    :logo-size="50"
    :logo-margin="4"
    logo-background-color="#ffffff"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const qrText = ref('带Logo的二维码')
</script>
```

## 带边框的二维码

```vue
<template>
  <QrCode
    :text="qrText"
    :size="200"
    :show-border="true"
    :border-width="2"
    border-color="#333333"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const qrText = ref('带边框的二维码')
</script>
```

## 可下载的二维码

```vue
<template>
  <QrCode
    :text="qrText"
    :size="200"
    :downloadable="true"
    download-file-name="my-qrcode"
    image-type="image/png"
    @download="onDownload"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const qrText = ref('可下载的二维码')

function onDownload(url) {
  console.log('二维码下载:', url)
}
</script>
```

## 高错误纠正级别

```vue
<template>
  <QrCode
    :text="qrText"
    :size="200"
    error-correction-level="H"
    :margin="4"
  />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const qrText = ref('高错误纠正级别')
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| text | 要编码的文本内容 | `string` | `''` |
| size | 二维码尺寸（像素） | `number` | `200` |
| errorCorrectionLevel | 错误纠正级别 | `'L' \| 'M' \| 'Q' \| 'H'` | `'H'` |
| colorDark | 二维码颜色 | `string` | `'#000000'` |
| colorLight | 背景颜色 | `string` | `'#ffffff'` |
| margin | 二维码边距（模块数） | `number` | `4` |
| showBorder | 是否显示边框 | `boolean` | `false` |
| borderWidth | 边框宽度（像素） | `number` | `1` |
| borderColor | 边框颜色 | `string` | `'#000000'` |
| showLogo | 是否显示Logo | `boolean` | `false` |
| logoUrl | Logo图片地址 | `string` | `''` |
| logoSize | Logo尺寸（像素） | `number` | `40` |
| logoMargin | Logo边距（像素） | `number` | `4` |
| logoBackgroundColor | Logo背景颜色 | `string` | `'#ffffff'` |
| downloadable | 是否支持下载 | `boolean` | `false` |
| downloadFileName | 下载文件名 | `string` | `'qrcode'` |
| imageType | 图片类型 | `'image/png' \| 'image/jpeg' \| 'image/webp'` | `'image/png'` |
| quality | 图片质量（仅对JPEG有效，0-1） | `number` | `0.92` |
| autoCompleteUrl | 是否自动补全URL（如果text是URL但没有协议，自动添加https://） | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| ready | 二维码生成完成时触发 | `(url: string)` |
| error | 二维码生成失败时触发 | `(error: Error)` |
| download | 下载时触发 | `(url: string)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认插槽，用于自定义二维码显示区域 |
| logo | Logo插槽，用于自定义Logo显示 |

## 错误纠正级别说明

- **L (Low)**: 约7%的错误可以被纠正
- **M (Medium)**: 约15%的错误可以被纠正
- **Q (Quartile)**: 约25%的错误可以被纠正
- **H (High)**: 约30%的错误可以被纠正（默认）

错误纠正级别越高，二维码的容错能力越强，但二维码会变得越复杂。

## URL跳转使用说明

### 如何生成扫码跳转的二维码

1. **直接使用完整URL**（推荐）：
```vue
<QrCode text="https://www.example.com" />
```

2. **自动补全URL协议**：
```vue
<!-- 组件会自动将 www.example.com 转换为 https://www.example.com -->
<QrCode text="www.example.com" :auto-complete-url="true" />
```

3. **自定义跳转地址**：
```vue
<template>
  <QrCode :text="jumpUrl" :size="200" />
</template>

<script setup>
import { ref } from 'vue'
import { QrCode } from '@moluoxixi/components'

const jumpUrl = ref('https://www.your-website.com/page?id=123')
</script>
```

**扫码后的行为：**
- 手机扫描二维码后，扫描器会读取二维码中的URL
- 如果URL以 `http://` 或 `https://` 开头，扫描器会自动在浏览器中打开该地址
- 这是二维码扫描器的标准行为，无需额外配置

## 注意事项

1. 当 `text` 属性为空时，不会生成二维码
2. Logo图片需要支持跨域访问（CORS），否则可能无法正常显示
3. 下载功能需要浏览器支持 `download` 属性
4. 二维码尺寸建议不小于 100px，以确保扫描识别率
5. 当 `showLogo` 为 `true` 时，建议使用较高的错误纠正级别（如 `'H'`），以提高容错能力
6. **URL跳转**：确保URL格式正确，建议使用完整的 `https://` 开头的URL，以确保所有扫描器都能正确识别


