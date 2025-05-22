# 创建EditorCanvas目录下的文件
$editorCanvasFiles = @(
    @{Path="EditorCanvas/index.vue"; Desc="编辑画布组件，提供拖拽放置组件的核心编辑区域"},
    @{Path="EditorCanvas/ComponentContainer/index.vue"; Desc="组件容器，用于在低代码编辑器中容纳和管理拖放的组件"},
    @{Path="EditorCanvas/DragHelper/index.vue"; Desc="拖拽辅助组件，用于在低代码编辑器中提供拖拽相关的辅助功能"},
    @{Path="EditorCanvas/SelectionManager/index.vue"; Desc="选择管理组件，用于在低代码编辑器中处理组件的选择和多选操作"},
    @{Path="EditorCanvas/AlignmentGuides/index.vue"; Desc="对齐辅助组件，用于在低代码编辑器中提供组件拖拽时的对齐参考线"},
    @{Path="EditorCanvas/ContextMenu/index.vue"; Desc="右键菜单组件，用于在低代码编辑器中提供组件的右键菜单功能"},
    @{Path="EditorCanvas/CanvasToolbar/index.vue"; Desc="画布工具栏组件，提供缩放、网格显示等编辑器画布的控制功能"}
)

# 创建PropertyPanel目录下的文件
$propertyPanelFiles = @(
    @{Path="PropertyPanel/index.vue"; Desc="属性编辑面板，用于在低代码编辑器中编辑组件的各种属性和配置"},
    @{Path="PropertyPanel/PropertyForm/index.vue"; Desc="属性表单组件，用于在低代码编辑器中编辑组件的属性"},
    @{Path="PropertyPanel/StyleEditor/index.vue"; Desc="样式编辑器组件，用于在低代码编辑器中编辑组件的样式属性"},
    @{Path="PropertyPanel/EventEditor/index.vue"; Desc="事件编辑器组件，用于在低代码编辑器中配置组件的事件处理"},
    @{Path="PropertyPanel/DataBindingPanel/index.vue"; Desc="数据绑定面板，用于在低代码编辑器中配置组件与数据源的绑定关系"},
    @{Path="PropertyPanel/TemplateManager/index.vue"; Desc="模板管理组件，用于在低代码编辑器中保存和管理组件模板配置"}
)

# 创建Renderer目录下的文件
$rendererFiles = @(
    @{Path="Renderer/ComponentRenderer/index.vue"; Desc="组件渲染核心，负责渲染组件和管理组件状态"},
    @{Path="Renderer/ContainerRenderer/index.vue"; Desc="容器渲染组件，用于渲染容器类组件"},
    @{Path="Renderer/ChartRenderer/index.vue"; Desc="图表渲染组件，用于渲染各类图表组件"},
    @{Path="Renderer/FormRenderer/index.vue"; Desc="表单渲染组件，用于渲染表单类组件"}
)

# 创建DataManager目录下的文件
$dataManagerFiles = @(
    @{Path="DataManager/DataModeler/index.vue"; Desc="数据模型设计组件，用于定义和管理数据模型"},
    @{Path="DataManager/ApiConfigurator/index.vue"; Desc="API配置组件，用于配置和管理API接口"},
    @{Path="DataManager/MockDataGenerator/index.vue"; Desc="Mock数据生成器，用于生成测试数据"},
    @{Path="DataManager/DataTransformer/index.vue"; Desc="数据转换组件，用于转换和处理数据"}
)

# 创建types目录下的文件
$typesFiles = @(
    @{Path="types/component.ts"; Desc="组件类型定义，包含所有组件相关的类型声明"; IsTS=$true},
    @{Path="types/schema.ts"; Desc="Schema类型定义，包含所有Schema相关的类型声明"; IsTS=$true},
    @{Path="types/editor.ts"; Desc="编辑器类型定义，包含所有编辑器相关的类型声明"; IsTS=$true},
    @{Path="types/data.ts"; Desc="数据类型定义，包含所有数据相关的类型声明"; IsTS=$true}
)

# 创建hooks目录下的文件
$hooksFiles = @(
    @{Path="hooks/useDrag.ts"; Desc="拖拽hook，用于处理组件拖拽相关的逻辑"; IsTS=$true},
    @{Path="hooks/useComponentRenderer.ts"; Desc="渲染hook，用于处理组件渲染相关的逻辑"; IsTS=$true},
    @{Path="hooks/usePropertyEditor.ts"; Desc="属性编辑hook，用于处理组件属性编辑相关的逻辑"; IsTS=$true},
    @{Path="hooks/useHistory.ts"; Desc="历史记录hook，用于处理编辑操作的历史记录"; IsTS=$true}
)

# 创建utils目录下的文件
$utilsFiles = @(
    @{Path="utils/schemaUtils.ts"; Desc="Schema工具函数，用于处理Schema相关的操作"; IsTS=$true},
    @{Path="utils/styleUtils.ts"; Desc="样式工具函数，用于处理样式相关的操作"; IsTS=$true},
    @{Path="utils/eventUtils.ts"; Desc="事件工具函数，用于处理事件相关的操作"; IsTS=$true},
    @{Path="utils/exportUtils.ts"; Desc="导出工具函数，用于处理导出相关的操作"; IsTS=$true}
)

# 创建services目录下的文件
$servicesFiles = @(
    @{Path="services/renderService.ts"; Desc="渲染服务，提供组件渲染相关的服务"; IsTS=$true},
    @{Path="services/exportService.ts"; Desc="导出服务，提供页面导出相关的服务"; IsTS=$true},
    @{Path="services/importService.ts"; Desc="导入服务，提供页面导入相关的服务"; IsTS=$true},
    @{Path="services/historyService.ts"; Desc="历史记录服务，提供操作历史相关的服务"; IsTS=$true}
)

# 合并所有文件列表
$allFiles = $editorCanvasFiles + $propertyPanelFiles + $rendererFiles + $dataManagerFiles + $typesFiles + $hooksFiles + $utilsFiles + $servicesFiles

# 创建文件
foreach ($file in $allFiles) {
    $basePath = "src/components/lowCodeEditor/"
    $fullPath = $basePath + $file.Path
    $dirPath = Split-Path -Path $fullPath -Parent
    
    # 创建目录
    if (-not (Test-Path $dirPath)) {
        New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
    }
    
    # 创建文件
    if (-not (Test-Path $fullPath)) {
        $filename = Split-Path -Path $file.Path -Leaf
        $fileFolder = Split-Path -Path $file.Path -Parent
        
        if ($file.IsTS) {
            # TypeScript 文件使用 JSDoc 格式注释
            $content = "/**`r`n * @file: $filename`r`n * @description: $($file.Desc)`r`n * @author: vue-component`r`n * @created: 自动生成`r`n */"
        } else {
            # Vue 文件使用 HTML 注释
            $content = "<!--`r`n  @file: $fileFolder/$filename`r`n  @description: $($file.Desc)`r`n  @author: vue-component`r`n  @created: 自动生成`r`n-->"
        }
        
        New-Item -Path $fullPath -ItemType File -Value $content -Force | Out-Null
        Write-Host "创建文件: $fullPath"
    }
}

Write-Host "文件结构创建完成！" 