<template>
  <div class="settings-modal">
    <div class="modal-content custom-scrollbar">
      <div class="user-section">
        <div class="avatar">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar">
        </div>
        <div class="user-info">
          <div class="name-row">
            <span class="name">欧阳顺德</span>
            <span class="role">副主任医师/001254</span>
            <span class="edit-btn">✎ 编辑</span>
          </div>
          <div class="dept">
            消化外科门诊
          </div>
          <div class="meta">
            登录时间：2025/11/10 10:19:23
          </div>
          <div class="meta">
            IP地址：192.168.31.167
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          显示设置
        </h3>
        <div v-for="(item, key) in displaySettings" :key="key" class="setting-item">
          <span class="label">{{ item.label }}</span>
          <div class="stepper">
            <button :disabled="item.value <= item.min" @click="updateSetting(key, -1)">
              −
            </button>
            <input type="text" readonly :value="formatValue(item)">
            <button :disabled="item.value >= item.max" @click="updateSetting(key, 1)">
              +
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          系统级操作
        </h3>
        <div class="system-actions">
          <div class="action-btn active">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <span>切换科室</span>
          </div>
          <div class="action-btn">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span>切换系统</span>
          </div>
          <div class="action-btn">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <span>修改密码</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          布局中心
        </h3>
        <div class="layout-grid">
          <div
            v-for="layout in layouts"
            :key="layout.id"
            class="layout-card"
            :class="{ active: currentLayout === layout.id }"
            @click="currentLayout = layout.id"
          >
            <div class="layout-preview-box">
              <div class="lp-wrapper">
                <div class="lp-header" :class="{ full: layout.id === 'top' }" />
                <div class="lp-body">
                  <div v-if="layout.id !== 'top'" class="lp-aside" />
                  <div class="lp-main" />
                </div>
              </div>
            </div>
            <div class="radio-label-box">
              <div class="radio-circle">
                <div class="radio-dot" />
              </div>
              <span>{{ layout.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          主题中心
        </h3>
        <div class="theme-grid">
          <div
            v-for="theme in themes"
            :key="theme.id"
            class="theme-card"
            :class="{ active: currentTheme === theme.id }"
            :style="{
              borderColor: currentTheme === theme.id ? theme.color : '#dcdfe6',
            }"
            @click="currentTheme = theme.id"
          >
            <div class="theme-color-block" :style="{ background: theme.color }" />

            <div class="theme-label-box">
              <div class="radio-circle">
                <div class="radio-dot" />
              </div>
              {{ theme.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          其他
        </h3>
        <div class="other-link">
          下载单点登录插件
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <span class="version">测试环境6.1版本</span>
      <button class="logout-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        退出系统
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// --- 类型定义 ---
interface SettingItem {
  label: string
  value: number
  unit?: string
  min: number
  max: number
}

interface LayoutOption {
  id: string
  name: string
}

interface ThemeOption {
  id: string
  name: string
  color: string
}

// --- 状态数据 ---
const displaySettings = reactive<Record<string, SettingItem>>({
  cache: { label: '缓存页面', value: 20, min: 5, max: 50 },
  scale: { label: '页面大小', value: 100, unit: '%', min: 80, max: 150 },
  fontSize: { label: '字体大小', value: 14, min: 12, max: 24 },
})

const currentLayout = ref('top')
const layouts: LayoutOption[] = [
  { id: 'mixed', name: '综合导航' },
  { id: 'top', name: '顶部导航' },
  { id: 'left', name: '左侧导航' },
]

const currentTheme = ref('blue')
const themes: ThemeOption[] = [
  { id: 'teal', name: '碧波万顷', color: '#00b894' },
  { id: 'blue', name: '青出于蓝', color: '#409eff' },
  { id: 'pink', name: '姹紫嫣红', color: '#ff7675' },
  { id: 'purple', name: '紫气东来', color: '#6c5ce7' },
  { id: 'green', name: '郁郁葱葱', color: '#00b894' },
  { id: 'red', name: '午后暖阳', color: '#a23030' },
  { id: 'cyan', name: '湖光山色', color: '#00cec9' },
  { id: 'ink', name: '水墨丹青', color: '#2d3436' },
]

// --- 方法 ---
function updateSetting(key: string, delta: number) {
  const item = displaySettings[key]
  const newValue = item.value + delta
  if (newValue >= item.min && newValue <= item.max) {
    item.value = newValue
  }
}

function formatValue(item: SettingItem) {
  return item.value + (item.unit || '')
}
</script>

<style scoped>
/* 全局容器 */
.settings-modal {
  max-width: 440px;
  max-height: 60vh;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

/* 滚动区域 */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #303133;
}

/* 用户信息区 */
.user-section {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
}
.avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f2f5;
}
.user-info {
  flex: 1;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.role {
  font-size: 12px;
  color: #606266;
}
.edit-btn {
  color: #409eff;
  cursor: pointer;
  margin-left: auto;
}
.dept {
  color: #409eff;
  font-weight: 500;
  margin-bottom: 4px;
}

/* 显示设置 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.label {
  font-size: 14px;
  color: #606266;
}
.stepper {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.stepper button {
  width: 32px;
  height: 30px;
  border: none;
  background: #f5f7fa;
  cursor: pointer;
  color: #606266;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stepper button:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
.stepper input {
  width: 50px;
  border: none;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  text-align: center;
  font-size: 13px;
  color: #606266;
  outline: none;
}

/* 系统级操作 */
.system-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding: 12px 20px;
  border-radius: 6px;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #f5f7fa;
}
.action-btn.active {
  background: #ecf5ff;
  color: #409eff;
}
.action-btn.active .icon-box {
  color: #409eff;
}
.icon-box {
  width: 24px;
  height: 24px;
  color: #606266;
}
.action-btn span {
  font-size: 12px;
}

/* --- 布局中心 --- */
.layout-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.layout-card {
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}
.layout-card.active {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}
.layout-preview-box {
  background: #f9fafc;
  padding: 12px 8px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lp-wrapper {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background: #fff;
  padding: 2px;
}
.radio-label-box {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #606266;
  gap: 6px;
  background: #fff;
}
.layout-card.active .radio-label-box {
  color: #409eff;
  font-weight: 500;
}
/* 公用单选圆圈样式 */
.radio-circle {
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.active .radio-circle {
  border-color: #409eff;
}
.radio-dot {
  width: 0;
  height: 0;
  background: #409eff;
  border-radius: 50%;
  transition: all 0.2s;
}
.active .radio-dot {
  width: 8px;
  height: 8px;
}

.lp-header {
  height: 8px;
  background: #409eff;
  width: 100%;
  border-radius: 1px;
  opacity: 0.8;
}
.lp-header.full {
  width: 100%;
}
.lp-body {
  flex: 1;
  display: flex;
  gap: 3px;
}
.lp-aside {
  width: 8px;
  background: #a0cfff;
  height: 100%;
  border-radius: 1px;
}
.lp-main {
  flex: 1;
  background: #ecf5ff;
  border-radius: 1px;
}

/* --- 主题中心 (重点修改) --- */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.theme-card {
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden; /* 确保色块不溢出圆角 */
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}
/* 选中样式 */
.theme-card.active {
  box-shadow: 0 0 0 1px;
}
.theme-card.active .theme-label-box {
  color: #409eff;
  font-weight: 500;
}

/* 上部色块 */
.theme-color-block {
  height: 16px;
  width: 100%;
  /* background color 由内联样式控制 */
}

/* 下部文字区域 */
.theme-label-box {
  padding: 12px 0; /* 增加高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #606266;
  gap: 6px;
  background: #fff;
}

/* 其他 */
.other-link {
  background: #f0f9ff;
  color: #409eff;
  padding: 10px;
  text-align: center;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
}
.other-link:hover {
  opacity: 0.8;
}

/* 底部 */
.modal-footer {
  border-top: 1px solid #e4e7ed;
  padding: 12px 20px;
  background: #f9fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.version {
  font-size: 12px;
  color: #606266;
}
.logout-btn {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}
.logout-btn:hover {
  background: #fde2e2;
}
</style>
