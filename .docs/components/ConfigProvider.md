---
title: 全局配置
description: ConfigProvider 全局配置组件，用于为组件提供统一的全局配置
date: 2025-01-27
tags:
  - 组件
---

# 全局配置组件

ConfigProvider 组件提供一种全局配置的方式，使得可以统一设置一些公共属性，简化开发流程。

## 全局设置间距大小

通过 ConfigProvider 可以统一设置 Space 组件的间距大小。

:::demo
```vue
<template>
  <div class="config-demo">
    <div class="control-panel">
      <span>全局间距大小：</span>
      <el-radio-group v-model="spaceSize">
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="middle">中</el-radio-button>
        <el-radio-button label="large">大</el-radio-button>
      </el-radio-group>
    </div>
    
    <ConfigProvider :space="spaceSize">
      <div class="space-examples">
        <div class="example-item">
          <h4>水平间距</h4>
          <Space>
            <div class="box blue"></div>
            <div class="box blue"></div>
            <div class="box blue"></div>
          </Space>
        </div>
        
        <div class="example-item">
          <h4>垂直间距</h4>
          <Space direction="vertical">
            <div class="box green"></div>
            <div class="box green"></div>
            <div class="box green"></div>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const spaceSize = ref('small')
</script>

<style scoped>
.config-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.control-panel {
  display: flex;
  align-items: center;
  gap: 10px;
}
.space-examples {
  display: flex;
  gap: 40px;
}
.example-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.box {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}
.blue {
  background-color: #409EFF;
}
.green {
  background-color: #67C23A;
}
</style>
```
:::

## 全局设置国际化

通过 ConfigProvider 可以统一设置组件的语言环境。

:::demo
```vue
<template>
  <div class="config-demo">
    <div class="control-panel">
      <span>全局语言设置：</span>
      <el-radio-group v-model="locale">
        <el-radio-button label="zh-CN">中文</el-radio-button>
        <el-radio-button label="en-US">英文</el-radio-button>
      </el-radio-group>
    </div>
    
    <ConfigProvider :locale="locale">
      <div class="calendar-container">
        <Calendar />
      </div>
    </ConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const locale = ref('zh-CN')
</script>

<style scoped>
.config-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.control-panel {
  display: flex;
  align-items: center;
  gap: 10px;
}
.calendar-container {
  width: 100%;
  max-width: 500px;
}
</style>
```
:::

## 嵌套配置

ConfigProvider 支持嵌套使用，内层配置会覆盖外层配置。

:::demo
```vue
<template>
  <div class="config-demo">
    <ConfigProvider locale="en-US" space="large">
      <div class="nested-example">
        <h4>外层配置（英文 + 大间距）</h4>
        <div class="example-container">
          <Space>
            <div class="box blue"></div>
            <div class="box blue"></div>
            <div class="box blue"></div>
          </Space>
          
          <div class="calendar-container">
            <Calendar />
          </div>
        </div>
        
        <div class="nested-config">
          <h4>内层配置（中文 + 小间距）</h4>
          <ConfigProvider locale="zh-CN" space="small">
            <div class="example-container">
              <Space>
                <div class="box green"></div>
                <div class="box green"></div>
                <div class="box green"></div>
              </Space>
              
              <div class="calendar-container">
                <Calendar />
              </div>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </ConfigProvider>
  </div>
</template>

<style scoped>
.config-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.nested-example {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.nested-config {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #dcdfe6;
}
.example-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.calendar-container {
  width: 100%;
  max-width: 500px;
}
.box {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}
.blue {
  background-color: #409EFF;
}
.green {
  background-color: #67C23A;
}
</style>
```
:::

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| space | 设置 Space 组件的间距大小 | string \| number | small / middle / large / number | — |
| locale | 设置组件的语言环境 | string | zh-CN / en-US | zh-CN |

## 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 需要应用全局配置的内容 | — |