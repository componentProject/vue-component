# ConfigForm 配置化表单组件

一个基于 JSON Schema 的配置化表单组件，支持多 UI 框架（Element Plus、Ant Design Vue）适配。

## 核心设计思想

### 1. 字段类型分类（参考 Formily）

ConfigForm 将表单字段分为三大类，这是整个架构的基础：

| 类型 | 说明 | dataType | 是否产生数据 |
|------|------|----------|-------------|
| **Field** | 普通输入字段 | string/number/boolean/date/any | ✅ 产生数据 |
| **ArrayField** | 数组字段 | array | ✅ 产生数组数据 |
| **VoidField** | 布局字段 | void | ❌ 不产生数据 |

```typescript
// Field - 普通字段（使用 type 属性）
{ type: 'input', title: '用户名' }  // dataType: 'string'
{ type: 'number', title: '年龄' }   // dataType: 'number'
{ type: 'switch', title: '启用' }   // dataType: 'boolean'

// ArrayField - 数组字段
{
  type: 'array',
  title: '工作经历',
  items: { ... }  // 有 items 表示数组
}

// VoidField - 布局字段（使用 layout 属性，不产生数据）
{
  layout: 'tabs',
  tabs: [...]  // 标签页布局
}
```

### 2. `type` vs `layout` vs `dataType` 的分离

这是 ConfigForm 的核心设计理念：

| 属性 | 作用 | 说明 |
|------|------|------|
| `type` | **数据字段组件** | 决定用什么组件渲染（input/select/number...） |
| `layout` | **布局字段类型** | 明确标识布局字段（tabs/collapse/card...） |
| `dataType` | **数据类型** | 决定数据是什么类型（string/number/array...） |

**为什么要分离 `type` 和 `layout`？**

```typescript
// 数据字段 - 使用 type
{ type: 'input', title: '用户名' }

// 布局字段 - 使用 layout（语义更清晰）
{
  layout: 'card',
  title: '基本信息',
  properties: {
    name: { type: 'input' },
    age: { type: 'number' }
  }
}

// 判断是否为布局字段极其简单
const isVoidField = field.layout != null
```

**好处：**
- 语义清晰：一眼就能看出是数据字段还是布局字段
- 判断简单：`field.layout != null` 即可判断
- 不需要维护布局类型列表
- 配置更直观

**dataType 推断优先级：**

1. `field.dataType`（Schema 中显式指定）
2. `field.layout`（有 layout 属性 → 'void'）
3. 结构推断（有 `items` → 'array'）
4. `type === 'object'` → 'object'
5. `adapter.inferDataType`（自定义推断方法）
6. `fields[type].dataType`（Adapter 完整格式配置）
7. `adapter.dataTypeMap[type]`（Adapter 映射表）
8. `DEFAULT_DATA_TYPE_MAP[type]`（默认映射表）
9. `'any'`（最终兜底）

### 3. 布局字段类型

使用 `layout` 属性指定布局类型：

```typescript
// 可用的布局类型
type LayoutFieldType =
  | 'void'      // 通用布局容器
  | 'group'     // 字段分组
  | 'card'      // 卡片容器
  | 'collapse'  // 折叠面板
  | 'tabs'      // 标签页
  | 'divider'   // 分割线
  | 'alert'     // 提示信息

// 示例
{
  layout: 'tabs',
  tabs: [
    { key: 'basic', title: '基本', properties: {...} },
    { key: 'advanced', title: '高级', properties: {...} }
  ]
}

{
  layout: 'collapse',
  panels: [
    { key: 'section1', title: '第一节', properties: {...} }
  ]
}

{
  layout: 'card',
  title: '卡片标题',
  properties: {...}
}
```

### 4. Adapter 适配器模式

ConfigForm 通过 Adapter 模式支持多 UI 框架：

```typescript
interface UIAdapter {
  name: string
  
  // 字段组件（支持简写和完整格式）
  fields: {
    input: ElInput,                                    // 简写
    number: { component: ElInputNumber, dataType: 'number' },  // 完整
  }
  
  // 布局组件
  layout: { form, formItem, row, col, card, tabs, collapse, ... }
  
  // dataType 映射（用于简写格式的兜底）
  dataTypeMap: {
    input: 'string',
    select: 'any',
  }
}
```

**fields 的两种格式：**

```typescript
fields: {
  // 简写格式 - 使用 dataTypeMap 的默认值
  input: ElInput,
  
  // 完整格式 - 直接指定 dataType（推荐用于数字、布尔、数组类型）
  number: { component: ElInputNumber, dataType: 'number' },
  switch: { component: ElSwitch, dataType: 'boolean' },
  multiSelect: { component: ElSelect, dataType: 'array', defaultProps: { multiple: true } },
}
```

### 5. Schema 校验分层

校验分为两层：

| 层级 | 时机 | 校验内容 |
|------|------|---------|
| **Schema 校验** | 开发时 | 配置结构是否正确（type: 'array' 必须有 items） |
| **DataType 校验** | 运行时 | 值是否符合类型（number 字段的值是否为数字） |

```typescript
// Schema 结构校验（开发模式）
validateSchemaInDev(schema, 'ConfigForm')

// 运行时值类型校验
validateFormValuesInDev(schema, values, adapter)
```

## 使用示例

### 基础表单

```typescript
const schema: FormSchema = {
  properties: {
    username: { type: 'input', title: '用户名', required: true },
    age: { type: 'number', title: '年龄' },
    gender: {
      type: 'select',
      title: '性别',
      dataSource: {
        type: 'static',
        data: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      }
    }
  }
}
```

### 自定义组件

```typescript
import TagInput from './TagInput.vue'

const schema: FormSchema = {
  properties: {
    tags: {
      type: 'input',          // 语义化类型
      title: '标签',
      dataType: 'array',      // 显式指定数据类型
      component: TagInput,    // 自定义渲染组件
      componentProps: { maxTags: 5 }
    }
  }
}
```

### 布局组件

```typescript
const schema: FormSchema = {
  properties: {
    // 使用 layout 属性定义布局，不产生数据
    basicInfo: {
      layout: 'card',
      title: '基本信息',
      properties: {
        name: { type: 'input', title: '姓名' },
        age: { type: 'number', title: '年龄' }
      }
    },
    
    // tabs 布局
    settings: {
      layout: 'tabs',
      tabs: [
        {
          key: 'basic',
          title: '基本设置',
          properties: {
            theme: { type: 'select', title: '主题' },
            language: { type: 'select', title: '语言' }
          }
        },
        {
          key: 'advanced',
          title: '高级设置',
          properties: {
            debug: { type: 'switch', title: '调试模式' }
          }
        }
      ]
    },
    
    // collapse 布局
    notification: {
      layout: 'collapse',
      panels: [
        {
          key: 'email',
          title: '邮件通知',
          properties: {
            emailEnabled: { type: 'switch' }
          }
        }
      ]
    }
  }
}
```

## 目录结构

```
ConfigForm/
├── src/
│   ├── adapters/          # UI 框架适配器
│   │   ├── element-plus.ts
│   │   └── ant-design-vue.ts
│   ├── components/        # 渲染组件
│   │   ├── FieldRenderer.vue
│   │   ├── ArrayFieldRenderer.vue
│   │   ├── ObjectFieldRenderer.vue
│   │   └── VoidFieldRenderer.vue
│   ├── composables/       # 组合式函数
│   ├── types/             # 类型定义
│   │   ├── field.ts       # 字段类型（含 DataType、LayoutFieldType）
│   │   ├── adapter.ts     # 适配器类型
│   │   └── constants.ts   # 常量
│   ├── utils/             # 工具函数
│   │   ├── adapter.ts     # Adapter 工具（含 inferDataType）
│   │   └── schemaValidator.ts
│   └── index.vue          # 主组件
└── README.md
```

## 扩展点

### 添加自定义字段类型

1. 在 Adapter 的 `fields` 中注册组件
2. 如果是非标准 dataType，在 `dataTypeMap` 中配置或使用完整格式

### 添加新的布局类型

1. 在 `LayoutFieldType` 类型中添加
2. 在 `VoidFieldRenderer.vue` 中实现渲染逻辑
3. 在 Adapter 的 `layout` 中注册对应的 UI 组件
