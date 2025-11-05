# QrCode

## 组件示例

二维码生成组件，支持自定义样式、Logo、边框和下载功能。

### 基础用法

基础二维码生成，只需提供文本内容。

:::demo
QrCode/base/basic
:::

### 文本内容（text）

可以编码各种类型的文本内容，包括URL、普通文本、电话号码等。

:::demo
QrCode/base/text
:::

### 尺寸（size）

控制二维码的显示尺寸，单位为像素。

:::demo
QrCode/base/size
:::

### 错误纠正级别（errorCorrectionLevel）

错误纠正级别决定了二维码的容错能力。级别越高，二维码越复杂，但容错能力越强。

L级别：约7%的错误可以被纠正

:::demo
QrCode/errorCorrectionLevel/level-l
:::

M级别：约15%的错误可以被纠正

:::demo
QrCode/errorCorrectionLevel/level-m
:::

Q级别：约25%的错误可以被纠正

:::demo
QrCode/errorCorrectionLevel/level-q
:::

H级别：约30%的错误可以被纠正（默认）

:::demo
QrCode/errorCorrectionLevel/level-h
:::

### 二维码颜色（colorDark）

自定义二维码前景色，支持各种颜色值。

:::demo
QrCode/color/colorDark
:::

### 背景颜色（colorLight）

自定义二维码背景色，支持各种颜色值。

:::demo
QrCode/color/colorLight
:::

### 颜色组合

可以同时自定义前景色和背景色，创建个性化的二维码样式。

:::demo
QrCode/color/colorCombination
:::

### 边距（margin）

控制二维码周围的空白边距，单位为模块数。

:::demo
QrCode/margin/margin
:::

### 显示边框（showBorder）

是否在二维码周围显示边框。

:::demo
QrCode/border/showBorder
:::

### 边框宽度（borderWidth）

当 `showBorder` 为 `true` 时，控制边框的宽度，单位为像素。

:::demo
QrCode/border/borderWidth
:::

### 边框颜色（borderColor）

当 `showBorder` 为 `true` 时，控制边框的颜色。

:::demo
QrCode/border/borderColor
:::

### 显示Logo（showLogo）

是否在二维码中央显示Logo图片。

:::demo
QrCode/logo/showLogo
:::

### Logo尺寸（logoSize）

当 `showLogo` 为 `true` 时，控制Logo的显示尺寸，单位为像素。

:::demo
QrCode/logo/logoSize
:::

### Logo边距（logoMargin）

当 `showLogo` 为 `true` 时，控制Logo周围的边距，单位为像素。

:::demo
QrCode/logo/logoMargin
:::

### Logo背景颜色（logoBackgroundColor）

当 `showLogo` 为 `true` 时，控制Logo背景的颜色。

:::demo
QrCode/logo/logoBackgroundColor
:::

### 可下载（downloadable）

是否支持点击二维码下载图片。

:::demo
QrCode/download/downloadable
:::

### 下载文件名（downloadFileName）

当 `downloadable` 为 `true` 时，控制下载文件的名称（不含扩展名）。

:::demo
QrCode/download/downloadFileName
:::

### 图片类型（imageType）

当 `downloadable` 为 `true` 时，控制下载图片的格式。

:::demo
QrCode/download/imageType
:::

### 图片质量（quality）

当 `imageType` 为 `image/jpeg` 时，控制JPEG图片的质量，范围0-1。

:::demo
QrCode/download/quality
:::

### URL自动补全（autoCompleteUrl）

当 `text` 为URL格式但没有协议时，是否自动添加 `https://` 协议。

自动补全开启

:::demo
QrCode/autoCompleteUrl/autoCompleteUrl-true
:::

自动补全关闭

:::demo
QrCode/autoCompleteUrl/autoCompleteUrl-false
:::

### 事件（ready）

二维码生成完成时触发，返回生成的图片Data URL。

:::demo
QrCode/events/ready
:::

### 事件（download）

当 `downloadable` 为 `true` 且用户点击二维码下载时触发，返回图片Data URL。

:::demo
QrCode/events/download
:::

### 事件（error）

二维码生成失败时触发，返回错误对象。

:::demo
QrCode/events/error
:::

### 默认插槽（default）

用于在二维码区域添加自定义内容。

:::demo
QrCode/slots/default
:::

### Logo插槽（logo）

当 `showLogo` 为 `true` 时，用于自定义Logo的显示内容。

:::demo
QrCode/slots/logo
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `text` | 要编码的文本内容 | `string` | `''` |
| `size` | 二维码尺寸（像素） | `number` | `200` |
| `errorCorrectionLevel` | 错误纠正级别 | ^[String]`'L' \| 'M' \| 'Q' \| 'H'` | `'H'` |
| `colorDark` | 二维码颜色 | `string` | `'#000000'` |
| `colorLight` | 背景颜色 | `string` | `'#ffffff'` |
| `margin` | 二维码边距（模块数） | `number` | `4` |
| `showBorder` | 是否显示边框 | `boolean` | `false` |
| `borderWidth` | 边框宽度（像素） | `number` | `1` |
| `borderColor` | 边框颜色 | `string` | `'#000000'` |
| `showLogo` | 是否显示Logo | `boolean` | `false` |
| `logoUrl` | Logo图片地址 | `string` | `''` |
| `logoSize` | Logo尺寸（像素） | `number` | `40` |
| `logoMargin` | Logo边距（像素） | `number` | `4` |
| `logoBackgroundColor` | Logo背景颜色 | `string` | `'#ffffff'` |
| `downloadable` | 是否支持下载 | `boolean` | `false` |
| `downloadFileName` | 下载文件名 | `string` | `'qrcode'` |
| `imageType` | 图片类型 | ^[String]`'image/png' \| 'image/jpeg' \| 'image/webp'` | `'image/png'` |
| `quality` | 图片质量（仅对JPEG有效，0-1） | `number` | `0.92` |
| `autoCompleteUrl` | 是否自动补全URL（如果text是URL但没有协议，自动添加https://） | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `ready` | 二维码生成完成时触发 | ^[Function]`(url: string) => void` |
| `error` | 二维码生成失败时触发 | ^[Function]`(error: Error) => void` |
| `download` | 下载时触发 | ^[Function]`(url: string) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 默认插槽，用于自定义二维码显示区域 |
| `logo` | Logo插槽，用于自定义Logo显示 |

### Expose

该组件不提供暴露方法。

