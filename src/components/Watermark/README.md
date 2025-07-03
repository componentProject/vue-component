# Watermark 水印组件

## 组件简介
Watermark 组件用于在页面或指定区域添加自定义水印，支持文字、图片、旋转、透明度等配置。

## 用法
```vue
<Watermark content="保密" :opacity="0.2" />
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| content | String | 水印内容 |
| image | String | 水印图片地址（可选） |
| opacity | Number | 水印透明度 |
| rotate | Number | 水印旋转角度 |

## 说明
- 支持全局和局部水印。
- 适合敏感信息保护、品牌展示等场景。 