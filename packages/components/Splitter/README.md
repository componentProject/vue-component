# Splitter 分割面板组件

基于 element-plus 的 Splitter 组件进行封装，支持多面板分割和自定义内容。

## 基本用法

```vue
<template>
  <wl-splitter>
    <template #left>
      <div>左侧内容</div>
    </template>
    <template #right>
      <div>右侧内容</div>
    </template>
  </wl-splitter>
</template>
```

## 三栏分割

```vue
<template>
  <wl-splitter>
    <template #panel1>
      <div>第一栏</div>
    </template>
    <template #panel2>
      <div>第二栏</div>
    </template>
    <template #panel3>
      <div>第三栏</div>
    </template>
  </wl-splitter>
</template>
```

## 属性

| 属性名    | 说明                             | 类型   | 默认值       |
| --------- | -------------------------------- | ------ | ------------ |
| direction | 分割方向，horizontal 或 vertical | string | 'horizontal' |
| size      | 分割面板的大小                   | string | '100%'       |

## 插槽

组件会根据提供的具名插槽数量自动生成对应数量的分割面板。命名方式为：

- 两个面板时：`left`, `right`（水平方向）或 `top`, `bottom`（垂直方向）
- 多个面板时：`panel1`, `panel2`, `panel3`, ...

## 事件

| 事件名 | 说明                 | 参数                                 |
| ------ | -------------------- | ------------------------------------ |
| resize | 当面板大小调整时触发 | (sizes: number[]) 各个面板的大小比例 |
