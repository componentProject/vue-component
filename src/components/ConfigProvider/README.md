# ConfigProvider 组件

## 组件简介
ConfigProvider 用于为子组件提供全局配置（如主题、语言、尺寸等），实现统一的配置管理。

## 用法
```vue
<ConfigProvider :locale="zhCN">
  <App/>
</ConfigProvider>
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| locale | Object | 国际化语言包对象 |

## 说明
- 适用于需要全局配置的场景。
- 通常包裹在应用根节点。 